/// Integer with a thin space between thousands, the same in both languages.
export const group = (v: number) => Math.round(v).toLocaleString("en-US").replace(/,/g, " ");
