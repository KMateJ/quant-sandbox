// Shared bond parameter block (components/BondInputs), used by the bond-pricing and duration labs.

export const bondInputsHu = {
  biFace: "Névérték",
  biCoupon: "Kuponráta",
  biMaturity: "Futamidő",
  biYears: "év",
  biYtm: "Lejáratig számított hozam",
  biFrequency: "Kifizetési gyakoriság",
  biAnnual: "Éves",
  biSemiannual: "Féléves",
  biQuarterly: "Negyedéves",
};

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
