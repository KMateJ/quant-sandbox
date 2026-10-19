// Shared bond parameter block (components/BondInputs), used by the bond-pricing and duration labs.
import type { bondInputsHu } from "./BondInputs.hu";

export const bondInputsEn: Record<keyof typeof bondInputsHu, string> = {
  biFace: "Face value",
  biCoupon: "Coupon rate",
  biMaturity: "Maturity",
  biYears: "years",
  biYtm: "Yield to maturity",
  biFrequency: "Payment frequency",
  biAnnual: "Annual",
  biSemiannual: "Semi-annual",
  biQuarterly: "Quarterly",
};
