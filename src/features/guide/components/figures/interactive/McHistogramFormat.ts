/// Draw counts with a space as thousands separator, readable in both languages.
export const formatCount = (n: number) => Math.round(n).toLocaleString("en-US").replace(/,/g, " ");
