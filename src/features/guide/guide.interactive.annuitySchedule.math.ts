/// One year of a level-payment loan.
export type ScheduleRow = {
  year: number;
  opening: number;
  payment: number;
  interest: number;
  principal: number;
  closing: number;
};

export const LOAN_AMOUNT = 200_000;
export const LOAN_TERMS = [5, 10, 20, 30] as const;
export const LOAN_RATES = [0.03, 0.06, 0.09] as const;

/// Present value of 1 a year for `n` years at rate `r` (the annuity factor), `(1 − (1 + r)^{−n}) / r`.
export function annuityFactor(r: number, n: number): number {
  return r === 0 ? n : (1 - Math.pow(1 + r, -n)) / r;
}

/// Level annual payment that repays `loan` over `n` years at rate `r`.
export function loanPayment(loan: number, r: number, n: number): number {
  return loan / annuityFactor(r, n);
}

/// Year-by-year amortization schedule: interest is charged on the opening balance, the rest of the payment repays principal.
export function amortizationSchedule(loan: number, r: number, n: number): ScheduleRow[] {
  const payment = loanPayment(loan, r, n);
  const rows: ScheduleRow[] = [];
  let balance = loan;
  for (let year = 1; year <= n; year++) {
    const interest = balance * r;
    const principal = payment - interest;
    const closing = year === n ? 0 : balance - principal;
    rows.push({ year, opening: balance, payment, interest, principal, closing });
    balance = closing;
  }
  return rows;
}

/// Payment, total interest over the life of the loan and the interest share of the first payment.
export function scheduleSummary(rows: ScheduleRow[]) {
  const payment = rows[0]?.payment ?? 0;
  const totalInterest = rows.reduce((sum, row) => sum + row.interest, 0);
  return { payment, totalInterest, firstInterestShare: rows[0] ? rows[0].interest / payment : 0 };
}
