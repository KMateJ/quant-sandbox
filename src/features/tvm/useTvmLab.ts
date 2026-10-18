import { useMemo } from "react";
import { useUrlState } from "../../components/useUrlState";
import { balanceAt, balanceSchedule, contributionsAt, parseOrder, SEQUENCE_RETURNS, solvePayment, solveRate, solveYears, type DepositPlan, type TvmSolution } from "./tvm.math";
import { DEFAULT_PLANS, TVM_URL_SCHEMA, type SolveFor } from "./tvm.url";

export type { SolveFor };

/// Longest horizon drawn when the years are solved for.
const MAX_CHART_YEARS = 100;

/// State of the TVM lab: the four inputs, which one is solved for, the target balance, and everything derived.
/// Inputs live in the query string, so a configuration can be linked.
export function useTvmLab() {
  const [url, setUrl] = useUrlState(TVM_URL_SCHEMA);
  const { p: principal, pmt: payment, r: rate, n: years, solve: solveFor, target } = url;
  const setPrincipal = (v: number) => setUrl({ p: v });
  const setPayment = (v: number) => setUrl({ pmt: v });
  const setRate = (v: number) => setUrl({ r: v });
  const setYears = (v: number) => setUrl({ n: v });
  const setTarget = (v: number) => setUrl({ target: v });

  // Switching away from "future value" starts the target at today's balance, rounded, so the solved value is familiar.
  const setSolveFor = (next: SolveFor) =>
    setUrl(solveFor === "fv" && next !== "fv"
      ? { solve: next, target: Math.max(1000, Math.round(balanceAt(principal, payment, rate, years) / 1000) * 1000) }
      : { solve: next });

  const plans: DepositPlan[] = DEFAULT_PLANS.map((plan, i) => ({
    ...plan,
    amount: [url.a1, url.a2, url.a3][i],
    start: [url.s1, url.s2, url.s3][i],
  }));
  const setPlan = (i: number, patch: Partial<Pick<DepositPlan, "amount" | "start">>) => {
    const k = i + 1;
    setUrl({
      ...(patch.amount !== undefined ? { [`a${k}`]: patch.amount } : {}),
      ...(patch.start !== undefined ? { [`s${k}`]: patch.start } : {}),
    });
  };

  // The return order is a permutation in the URL; the given order is left out.
  const identity = SEQUENCE_RETURNS.map((_, i) => i);
  const order = parseOrder(url.seq, SEQUENCE_RETURNS.length) ?? identity;
  const setOrder = (next: number[]) => setUrl({ seq: next.every((v, i) => v === i) ? "" : next.join(",") });
  const sequence = { order, setOrder, withdrawalRate: url.wd, setWithdrawalRate: (v: number) => setUrl({ wd: v }) };

  const solution: TvmSolution | null = useMemo(() => {
    if (solveFor === "payment") return solvePayment(target, principal, rate, years);
    if (solveFor === "rate") return solveRate(target, principal, payment, years);
    if (solveFor === "years") return solveYears(target, principal, payment, rate);
    return null;
  }, [solveFor, target, principal, payment, rate, years]);

  // The inputs actually used: the solved one replaces its slider value when the target is reachable.
  const solved = solution?.ok ? solution.value : null;
  const eff = {
    principal,
    payment: solveFor === "payment" && solved !== null ? solved : payment,
    rate: solveFor === "rate" && solved !== null ? solved : rate,
    years: solveFor === "years" && solved !== null ? solved : years,
  };
  const horizon = Math.max(1, Math.min(MAX_CHART_YEARS, Math.ceil(eff.years)));

  const finalBalance = balanceAt(eff.principal, eff.payment, eff.rate, eff.years);
  const totalContributions = contributionsAt(eff.principal, eff.payment, eff.years);
  const data = useMemo(
    () => balanceSchedule(eff.principal, eff.payment, eff.rate, horizon),
    [eff.principal, eff.payment, eff.rate, horizon]
  );

  return {
    inputs: { principal, payment, rate, years },
    setters: { setPrincipal, setPayment, setRate, setYears },
    solveFor, setSolveFor, target, setTarget, solution, eff, horizon, plans, setPlan, sequence,
    finalBalance, totalContributions, interest: finalBalance - totalContributions, data,
  };
}

export type TvmLab = ReturnType<typeof useTvmLab>;
