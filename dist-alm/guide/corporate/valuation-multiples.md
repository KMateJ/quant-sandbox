# Valuation Multiples: P/E, EV/EBITDA, Peers

P/E, EV/EBITDA and other multiples, choosing peers, and how multiples relate to DCF value. Free interactive lesson with worked examples.

"Discounted cash flow valuation" values a firm from its own forecast cash flows. In practice analysts almost always check that number against a second one: what similar firms trade for in the market. This lesson explains that relative valuation with multiples, how to apply a multiple correctly, and how a multiple connects back to the discounting of the earlier lesson.

## What a multiple is

A **multiple** is a market value divided by a measure of the firm's size or performance. If comparable firms trade at about 15 times their earnings, a similar firm with earnings of 4 per share might be worth about $15 \times 4 = 60$ per share. The multiple turns one firm's market price into a rate that can be applied to another firm.

The common multiples fall into two families, depending on whose claim the numerator measures:

- **Equity multiples** put the value of the shares on top: price to earnings (P/E), price to book value of equity (P/B). The denominator must also belong to shareholders: net income, book equity.
- **Enterprise multiples** put the **enterprise value** on top, the value of the whole business to all its investors, $\text{EV} = \text{equity value} + \text{net debt}$. The denominator must be earned before any payment to lenders: EBITDA (earnings before interest, taxes, depreciation and amortisation), EBIT or sales.

Mixing the families is the most common error. EBITDA is earned for lenders and shareholders together, so dividing the share price by EBITDA compares a part with the whole, and the result depends on how much debt the firm has, not on how well it operates.

> Numerator and denominator must belong to the same investors: equity value with net income or book equity, enterprise value with EBITDA, EBIT or sales.

## From a multiple to a value

Applying an enterprise multiple gives an enterprise value; the equity value then follows by subtracting net debt, exactly as at the end of a DCF valuation:

$$
\text{EV}_{\text{target}} = m \cdot \text{EBITDA}_{\text{target}}, \qquad \text{Equity}_{\text{target}} = \text{EV}_{\text{target}} - \text{net debt}.
$$

Example: a target with EBITDA of 50 and net debt of 120 (in millions), valued at 10 times EBITDA, has $\text{EV} = 500$ and equity worth $500 - 120 = 380$. Using 500 as the equity value would overstate it by the whole debt.

## Choosing comparable firms

A multiple is only as good as the firms it comes from. **Comparable firms** (peers) should resemble the target in what drives value: the same industry and business model, similar growth, similar risk and similar margins. Peers are rarely perfect, so the analyst summarises several of them.

Example: five peers trade at P/E ratios of 14, 16, 15, 22 and 13, and the target earns 4 per share. The **median** is the middle value after sorting (13, 14, 15, 16, 22).

### Worked example: Mean and median P/E of five peers

1. The mean of the five peer multiples.
   $$\bar m = \frac{1}{5}\sum_{i=1}^{5} m_i$$ → **16**
2. The median: the middle value of the sorted list.
   $$\tilde m = m_{(3)}$$ → **15**
3. Value per share using the mean.
   $$P = \bar m \cdot E$$ → **64**
4. Value per share using the median.
   $$P = \tilde m \cdot E$$ → **60**

The single high value of 22 pulls the mean up but does not move the median, which is why the median is the usual summary.

## Multiples and growth

Peers seldom have the same growth, and faster-growing firms deserve higher multiples. A simple fix is to plot the peers' multiples against their expected growth and fit a straight line by least squares, $m = a + b \cdot g$. The target's multiple is then read off the line at its own expected growth, instead of taking the median of firms that grow faster or slower than it does.

The figure does this with six made-up but plausible peers, A to F, valued on EV/EBITDA, and the target from the example above (EBITDA 50, net debt 120). Drag the diamond sideways, or focus it and use the arrow keys, to set the target's expected growth; it slides along the fitted line, and the readouts show the multiple on the line, the implied enterprise value and the implied equity value. Click a peer to drop it from the fit, and click again to bring it back. At the defaults, with all six peers and 7% growth, the line gives 11.38 times EBITDA and an equity value of 449.2. Peer F trades at 16.5 times on takeover rumours; drop it and the line gives 10.30 times and an equity value of 394.8, and the median falls from 10.35 to 9.9. One unusual peer moves the answer by more than 10%.

*[Interactive figure: multiples peers](https://quantsandbox.dev/guide/corporate/valuation-multiples)*

## The justified multiple

A multiple is not only a market convention; it can be derived from the discounting of the previous lessons. Suppose a firm pays out a fixed share $b$ of its earnings as dividends, and earnings and dividends grow at $g$ for ever. With the Gordon formula and required return $r$, the share price today is

$$
P_0 = \frac{D_1}{r - g} = \frac{b\,E_0\,(1 + g)}{r - g}, \qquad \frac{P_0}{E_0} = \frac{b\,(1 + g)}{r - g}.
$$

This **justified P/E** shows what a multiple encodes: it rises with growth and payout and falls with risk. With $b = 60\%$, $r = 9\%$ and $g = 3\%$, the justified P/E is $0.6 \times 1.03 / 0.06 = 10.3$. If peers trade at 15 times earnings, the market is either expecting more growth or less risk than these inputs, or the peers are expensive. A multiple is therefore a compressed DCF: it hides the same assumptions, but does not state them.

## Summary

- A multiple divides a market value by a size or performance measure; it transfers a market price from peers to the target.
- Equity values pair with equity measures (P/E, P/B) and enterprise values with operating measures (EV/EBITDA, EV/Sales); equity value is EV minus net debt.
- The median is the usual summary of peer multiples because a single outlier moves the mean but not the median.
- Differences in growth can be handled by regressing multiples on growth and reading the target's multiple off the line.
- The justified P/E $b(1+g)/(r-g)$ links a multiple to the same inputs as a DCF valuation.

> The next lesson, "Real options: the value of flexibility", adds what neither DCF nor multiples capture well: the value of being able to delay, expand or abandon a project.

[Compare a multiple-based value with a full DCF in the Valuation lab](https://quantsandbox.dev/valuation)

## Interactive labs

- [DCF Valuation Model: Free Cash Flow & Terminal Value](https://quantsandbox.dev/valuation)

## Practice questions

### 1. Which of these multiples pairs a numerator and a denominator that belong to the same investors?

- a) Share price / EBITDA
- b) Enterprise value / net income
- c) Enterprise value / EBITDA
- d) Share price / sales

**Answer:** c) Enterprise value / EBITDA

EBITDA is earned for lenders and shareholders together, so it goes with the enterprise value. Price with EBITDA or sales, or EV with net income, mixes a part with the whole, and the result depends on the firm's debt.

### 2. Peers trade at 8 times EBITDA. The target has EBITDA of 80 and net debt of 200. What is its implied equity value?

**Answer:** 440

The enterprise multiple gives $\text{EV} = 8 \times 80 = 640$; subtracting net debt leaves $640 - 200 = 440$ for the shareholders.

---

Source: https://quantsandbox.dev/guide/corporate/valuation-multiples

Previous lesson: [DCF Valuation: Free Cash Flow and Terminal Value](https://quantsandbox.dev/guide/corporate/dcf-valuation)

Next lesson: [Real Options Valuation: Delay, Expand and Abandon](https://quantsandbox.dev/guide/corporate/real-options)
