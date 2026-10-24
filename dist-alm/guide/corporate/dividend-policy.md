# Dividend Discount Model and Dividend Policy

The Gordon growth model, growth from retained earnings, Modigliani–Miller dividend irrelevance and when payout does matter.

A share entitles its owner to the dividends the firm will pay. Valuing it is therefore a discounting problem of the kind solved in "Interest, compounding and discounting", and with steady growth the sum collapses to the growing perpetuity of "Annuities, perpetuities and loan amortization". This lesson derives that formula, shows where the growth comes from, and asks the question that "Capital structure and the Modigliani–Miller theorems" asked about debt, now about payout: does it matter how much of its earnings a firm pays out?

## Dividends and the dividend discount model

Let $D_t$ be the dividend per share expected at the end of year $t$, and $k$ the return shareholders require on a share of this risk, the **cost of equity**. The price today is the present value of all future dividends, the **dividend discount model**:

$$
P_0 = \sum_{t=1}^{\infty} \frac{D_t}{(1+k)^t}.
$$

A share has no maturity, so the sum is infinite. It may seem that an investor who plans to sell after a year is buying the dividend and the sale price, not an infinite stream; but the sale price is itself the present value of the dividends from year 2 on, so the two views agree.

## The Gordon growth formula

If dividends grow at a constant rate $g$, so that $D_t = D_1 (1+g)^{t-1}$, the sum is a growing perpetuity. Provided $g < k$ it converges to the **Gordon growth formula**:

$$
P_0 = \frac{D_1}{k - g}.
$$

The formula is simple, and it is very sensitive near $g = k$: as the growth rate approaches the discount rate the denominator goes to zero and the price explodes. For $g \ge k$ the sum diverges and the formula has no meaning; no firm can grow faster than the discount rate for ever. Rearranged, $k = D_1/P_0 + g$: the required return is the dividend yield plus the growth rate.

## Growth from retained earnings

Growth is not free. A firm grows its earnings by reinvesting part of them. Let $E_1$ be next year's earnings per share (EPS), $d$ the **payout ratio** (the share of earnings paid as dividends) and $b = 1 - d$ the **retention ratio**. If retained earnings are invested at a **return on equity** ROE, earnings and dividends grow at

$$
g = b \cdot \text{ROE}, \qquad D_1 = d \cdot E_1, \qquad P_0 = \frac{d\,E_1}{k - b\,\text{ROE}}.
$$

Here is the trade-off. Retaining more lowers today's dividend but raises the growth rate. Which effect wins depends only on how ROE compares with $k$. If the firm earns more on reinvested money than shareholders require, retention creates value and the price rises as the payout falls. If it earns less, retention destroys value, and shareholders would be better off receiving the cash.

*[Interactive figure: payout ddm](https://quantsandbox.dev/guide/corporate/dividend-policy)*

The figure plots the Gordon price against the payout ratio for EPS of 5, with the flat line $E_1/k$ for comparison. At the defaults (ROE 12%, $k$ 10%, payout 40%) the growth rate is 7.20%, the dividend is 2.00, the price is 71.43 and the PVGO (defined below) is 21.43. Set ROE below $k$ and the curve slopes the other way; set it equal to $k$ and the curve lies on the flat line. Points where $g \ge k$ are left off, and the readouts show a dash.

### Worked example: Pricing the default share

1. Growth from retention of 60% at an ROE of 12%.
   $$g = 0.6 \times 0.12$$ → **0.072**
2. Next year's dividend at a 40% payout of EPS 5.
   $$D_1 = 0.4 \times 5$$ → **2**
3. The Gordon price.
   $$P_0 = \frac{2}{0.10 - 0.072}$$ → **71.43**
4. The no-growth value: all earnings paid out for ever.
   $$\frac{E_1}{k} = \frac{5}{0.10}$$ → **50**
5. The present value of growth opportunities.
   $$\text{PVGO} = 71.43 - 50$$ → **21.43**

## Payout irrelevance

Now set ROE equal to $k$. The price becomes $d E_1 / (k - (1-d)k) = E_1/k$ for every payout ratio: in the figure the curve sits on the flat line. Reinvesting at exactly the required return neither creates nor destroys value, so how earnings are split between dividends and reinvestment does not matter.

Miller and Modigliani showed that this holds far more generally. In perfect capital markets (no taxes, no transaction costs, no information asymmetry) and with the investment policy fixed, the payout policy does not affect the value of the firm. The argument is the same as for capital structure: investors can undo any policy themselves. A shareholder who wants more cash than the firm pays can sell a few shares, a **homemade dividend**; one who wants less can reinvest the dividend in more shares. Since anyone can build the payout they want at no cost, no one pays extra for a particular policy.

The same reasoning covers **share buybacks**. Paying 100 as a dividend or using it to repurchase shares hands shareholders the same cash; the dividend leaves every holder with the same number of shares at a lower price, the buyback leaves fewer shares at an unchanged price. In perfect markets the two are equivalent.

## When payout matters

**Taxes.** Where dividends are taxed more heavily than capital gains, or the gain can be deferred until a sale, cash paid as a dividend is worth less to the shareholder than the same cash returned through a buyback. Different tax positions also attract different investors to different policies, the so-called clientele effect.

**Signalling.** Managers know more about future earnings than outside investors. Because firms are reluctant to cut dividends, raising one is a costly and therefore credible signal that management expects earnings to hold up, and prices often react to dividend announcements accordingly.

**Agency.** Cash left inside the firm can be spent on projects that serve managers rather than shareholders. Committing to pay it out reduces that risk, which is one reason mature firms with few good projects pay high dividends.

## The present value of growth opportunities

The Gordon price can be split into the value of the current earnings, paid out for ever, and the rest:

$$
P_0 = \frac{E_1}{k} + \text{PVGO}.
$$

The **present value of growth opportunities** (PVGO) is the part of the price that comes from future investments. It is positive only if those investments earn more than $k$; it is zero when ROE equals $k$, however much the firm reinvests; and it is negative when ROE is below $k$ and the firm keeps reinvesting. A high PVGO share is a growth stock whose price depends on projects it has not yet made.

> The dividend discount model values equity directly. The discounted cash flow valuation later in this track values the whole firm from its free cash flows and uses the same Gordon formula for the terminal value.

## Summary

- The dividend discount model prices a share as the present value of all future dividends at the cost of equity $k$.
- With constant growth $g < k$ it reduces to the Gordon formula $P_0 = D_1/(k - g)$.
- Growth comes from retained earnings, $g = b \cdot \text{ROE}$; retention raises the price if and only if ROE exceeds $k$.
- With ROE = $k$ and perfect markets, payout is irrelevant: homemade dividends and buybacks undo any policy.
- Taxes, signalling and agency costs are the reasons payout matters in practice.
- PVGO $= P_0 - E_1/k$ is the value of future growth; at the defaults it is 21.43 of a 71.43 price.

[Open the Valuation Lab to see the Gordon formula at work in a terminal value](https://quantsandbox.dev/valuation)

## Interactive labs

- [DCF Valuation Model: Free Cash Flow & Terminal Value](https://quantsandbox.dev/valuation)
- [Modigliani–Miller Capital Structure Visualizer](https://quantsandbox.dev/capital-structure)

## Practice questions

### 1. EPS is 5 and the cost of equity is 10%. What is the Gordon price if the firm pays out all its earnings (payout 100%)?

**Answer:** 50

With full payout nothing is retained, so $g = 0$ and $D_1 = 5$. The price is $5 / 0.10 = 50$, the no-growth value $E_1/k$, whatever the ROE.

### 2. In the dividend discount model with growth from retained earnings, when does the payout ratio have no effect on the share price?

- a) Whenever ROE is above the cost of equity
- b) When ROE equals the cost of equity and markets have no frictions
- c) Only when the payout ratio is 100%
- d) Never: a higher payout always raises the price

**Answer:** b) When ROE equals the cost of equity and markets have no frictions

With ROE = $k$ the price is $E_1/k$ for every payout, and the Miller–Modigliani argument needs perfect markets (no taxes, costs or information gaps) so that homemade dividends are free. With ROE above $k$ retention adds value; below $k$ it destroys value.

---

Source: https://quantsandbox.dev/guide/corporate/dividend-policy

Previous lesson: [Modigliani–Miller Theorem and Capital Structure](https://quantsandbox.dev/guide/corporate/capital-structure)

Next lesson: [DCF Valuation: Free Cash Flow and Terminal Value](https://quantsandbox.dev/guide/corporate/dcf-valuation)
