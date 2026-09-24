/// <reference lib="webworker" />

import {
  blackScholesCall,
  blackScholesDelta,
  blackScholesGamma,
  blackScholesRho,
  blackScholesTheta,
  blackScholesVega,
} from "../black-scholes/blackScholes.math";
import {
  discountedCallPriceFromTerminalStock,
  hestonCallPriceMC,
  hestonGreeks,
  hestonGreeksProfile,
  impliedVolFromCallPrice,
  simulateHestonPaths,
  simulateHestonTerminalStock,
} from "./heston.math";
import type {
  GreeksComparison,
  HestonPricingWorkerResponse,
  HestonWorkerRequest,
  HestonWorkerResponse,
  PriceComparisonPoint,
  SmilePoint,
} from "./heston.types";
import { smooth } from "./heston.utils";

self.onmessage = (event: MessageEvent<HestonWorkerRequest>) => {
  const data = event.data;

  if (data.kind === "paths") {
    const simulation = simulateHestonPaths({
      S0: data.S0,
      K: data.strike,
      r: data.rate,
      v0: data.v0,
      theta: data.theta,
      kappa: data.kappa,
      xi: data.xi,
      rho: data.rho,
      T: data.maturity,
      steps: data.steps,
      paths: data.pathCount,
    });

    const response: HestonWorkerResponse = {
      kind: "paths",
      requestId: data.requestId,
      stockData: simulation.stockData,
      varianceData: simulation.varianceData,
    };

    self.postMessage(response);
    return;
  }

  const {
    requestId,
    S0,
    strike,
    rate,
    v0,
    theta,
    kappa,
    xi,
    rho,
    maturity,
    pricingSteps,
    pricingPaths,
  } = data;

  const pricePointCount = 15;
  const sMin = S0 * 0.6;
  const sMax = S0 * 1.5;

  const rawPrice = Array.from({ length: pricePointCount }, (_, i) => {
    const S = sMin + (i / (pricePointCount - 1)) * (sMax - sMin);

    const bs = blackScholesCall(S, strike, maturity, rate, Math.sqrt(v0));

    const heston = hestonCallPriceMC({
      S0: S,
      K: strike,
      r: rate,
      v0,
      theta,
      kappa,
      xi,
      rho,
      T: maturity,
      steps: pricingSteps,
      paths: pricingPaths,
    });

    return { S, bs, heston };
  });

  const smoothedPrice = smooth(rawPrice.map((p) => p.heston), 1);

  const priceComparisonData: PriceComparisonPoint[] = rawPrice.map((p, i) => ({
    S: Number(p.S.toFixed(2)),
    bs: Number(p.bs.toFixed(6)),
    heston: Number(smoothedPrice[i].toFixed(6)),
  }));

  const terminalStock = simulateHestonTerminalStock({
    S0,
    K: strike,
    r: rate,
    v0,
    theta,
    kappa,
    xi,
    rho,
    T: maturity,
    steps: pricingSteps,
    paths: pricingPaths,
  });

  const strikeCount = 11;
  const rawSmile = Array.from({ length: strikeCount }, (_, i) => {
    const K = S0 * (0.75 + (i / (strikeCount - 1)) * 0.5);

    const hestonPrice = discountedCallPriceFromTerminalStock(
      terminalStock,
      K,
      rate,
      maturity
    );

    const hestonIv = impliedVolFromCallPrice(
      hestonPrice,
      S0,
      K,
      maturity,
      rate
    );

    return {
      moneyness: Number((K / S0).toFixed(3)),
      bsIv: Number(Math.sqrt(v0).toFixed(6)),
      hestonIv,
    };
  });

  const smoothedSmile = smooth(rawSmile.map((p) => p.hestonIv), 1);

  const smileData: SmilePoint[] = rawSmile.map((p, i) => ({
    moneyness: p.moneyness,
    bsIv: p.bsIv,
    hestonIv: Number(smoothedSmile[i].toFixed(6)),
  }));

  const sigma = Math.sqrt(v0);
  const hg = hestonGreeks({
    S0,
    K: strike,
    r: rate,
    v0,
    theta,
    kappa,
    xi,
    rho,
    T: maturity,
    steps: pricingSteps,
    paths: pricingPaths,
  });
  const greeks: GreeksComparison = {
    bsPrice: blackScholesCall(S0, strike, maturity, rate, sigma),
    hestonPrice: hg.price,
    sigma,
    rows: [
      {
        key: "delta",
        bs: blackScholesDelta(S0, strike, maturity, rate, sigma),
        heston: hg.delta,
      },
      {
        key: "gamma",
        bs: blackScholesGamma(S0, strike, maturity, rate, sigma),
        heston: hg.gamma,
      },
      {
        key: "vega",
        bs: blackScholesVega(S0, strike, maturity, rate, sigma),
        heston: hg.vega,
      },
      {
        key: "theta",
        bs: blackScholesTheta(S0, strike, maturity, rate, sigma),
        heston: hg.theta,
      },
      {
        key: "rho",
        bs: blackScholesRho(S0, strike, maturity, rate, sigma),
        heston: hg.rho,
      },
    ],
  };

  const profilePointCount = 25;
  const profileSpots = Array.from({ length: profilePointCount }, (_, i) => {
    const min = S0 * 0.6;
    const max = S0 * 1.5;
    return min + (i / (profilePointCount - 1)) * (max - min);
  });

  const greeksProfile = hestonGreeksProfile(
    {
      S0,
      K: strike,
      r: rate,
      v0,
      theta,
      kappa,
      xi,
      rho,
      T: maturity,
      steps: pricingSteps,
      paths: pricingPaths,
    },
    profileSpots
  );

  const response: HestonPricingWorkerResponse = {
    kind: "pricing",
    requestId,
    priceComparisonData,
    smileData,
    greeks,
    greeksProfile,
  };

  self.postMessage(response);
};

export {};
