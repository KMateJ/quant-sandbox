# NPV & IRR Calculator with NPV Profile

Capital budgeting made visual: net present value, internal rate of return, profitability index and the NPV profile across discount rates.

## About this tool

Net present value and internal rate of return are the core capital budgeting tools. Enter a project's cash flows to see its NPV at a chosen discount rate, its IRR, the profitability index and the NPV profile that shows how value changes as the discount rate moves.

## Frequently asked questions

### What is the difference between NPV and IRR?

NPV is the value a project adds today at a given discount rate. IRR is the discount rate at which NPV is zero. Accept a project when NPV is positive, or equivalently, for conventional cash flows, when IRR exceeds the cost of capital.

### When can NPV and IRR disagree?

When ranking mutually exclusive projects of different size or timing, or when cash flows change sign more than once, which can give multiple IRRs. NPV is the more reliable criterion.

### How do you calculate NPV?

Discount each cash flow to today and add them up: NPV = Σ CF_t / (1 + r)^t, with the initial investment as a negative CF₀. For example, investing 1,000 now for 600 in each of the next two years at a 10% discount rate gives NPV = −1,000 + 545.45 + 495.87 ≈ 41.32, so the project adds value.

### What is the profitability index?

The present value of the future cash flows divided by the initial investment. A value above 1 means a positive NPV. It helps rank projects when capital is limited, because it shows the value created per unit invested: future cash flows worth 1,041 today on a 1,000 investment give an index of about 1.04.

## Learn the theory

- [Net present value and internal rate of return](https://quantsandbox.dev/guide/corporate/npv-irr): Project cash flows, NPV, the NPV profile, IRR, the profitability index and where the IRR misleads.
- [Interest, compounding and discounting](https://quantsandbox.dev/guide/corporate/interest-discounting): Simple, compound and continuous compounding; present value and the discount factor.
- [Project risk: sensitivity, scenarios and Monte Carlo NPV](https://quantsandbox.dev/guide/corporate/capital-budgeting-risk): Which inputs move the NPV most, break-even values, scenario analysis and the distribution of NPV from simulation.
- [Real options: the value of flexibility](https://quantsandbox.dev/guide/corporate/real-options): Options to delay, expand and abandon a project, valued on a binomial tree, and the expanded NPV.

Open the interactive tool: https://quantsandbox.dev/npv-irr
