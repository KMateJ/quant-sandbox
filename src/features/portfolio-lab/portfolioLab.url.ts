import { urlEnum, urlNumber, urlString } from "../../lib/urlState";

export const PORTFOLIO_TABS = ["riskReturn", "correlations", "riskDecomp"] as const;
export type PortfolioTab = (typeof PORTFOLIO_TABS)[number];

/// Default risk-free rate (matches the shared portfolio universe); left out of the URL.
export const DEFAULT_RISK_FREE = 0.03;

/// Query-string keys owned by Portfolio Lab: open tab, risk-free rate and the allocation (`w`, see encodeAllocation).
/// Asset assumptions and correlations are not encoded, so `w` only applies while the universe has the same size.
export const PORTFOLIO_URL_SCHEMA = {
  tab: urlEnum(PORTFOLIO_TABS, "riskReturn"),
  rf: urlNumber(DEFAULT_RISK_FREE, 0, 0.1, 4),
  w: urlString(""),
};
