// Strings for the "amortization-schedule" guide figure. Keys are prefixed ixAn to stay unique.
import type { annuityScheduleHu } from "./annuitySchedule.hu";

export const annuityScheduleEn: Record<keyof typeof annuityScheduleHu, string> = {
  ixAnTitle: "Amortization schedule: interest and principal year by year",
  ixAnTerm: "Term",
  ixAnTermOption: "{{n}} years",
  ixAnRate: "Rate",
  ixAnHint: "Click a year (or Tab to it and press Enter) to see that row of the schedule below.",
  ixAnAria: "Annual loan payments split into interest and principal, with the remaining balance",
  ixAnBarAria: "Year {{year}}: interest {{interest}}, principal {{principal}}",
  ixAnInterest: "Interest",
  ixAnPrincipal: "Principal",
  ixAnBalance: "Remaining balance (end of year)",
  ixAnYear: "Year {{year}}",
  ixAnOpening: "Opening balance",
  ixAnPayment: "Payment",
  ixAnClosing: "Closing balance",
  ixAnInterestLine: "Interest = {{rate}} × {{opening}} = {{interest}}",
  ixAnPrincipalLine: "Principal = {{payment}} − {{interest}} = {{principal}}",
  ixAnClosingLine: "Closing balance = {{opening}} − {{principal}} = {{closing}}",
  ixAnTotalInterest: "Total interest paid",
  ixAnFirstShare: "Interest share of the first payment",
};
