/// One query-string field: how to read it (with a fallback) and how to write it (`null` = leave it out).
export type UrlField<T> = {
  parse: (raw: string | null) => T;
  serialize: (value: T) => string | null;
};

/// A typed description of the query-string keys a page owns.
export type UrlSchema<S> = { [K in keyof S]: UrlField<S[K]> };

const round = (value: number, decimals?: number) =>
  decimals === undefined ? value : Number(value.toFixed(decimals));

/// Number in [min, max], rounded to `decimals`; missing or invalid → `fallback`. The fallback itself is not written.
export function urlNumber(fallback: number, min: number, max: number, decimals?: number): UrlField<number> {
  return {
    parse: (raw) => {
      const value = raw === null || raw.trim() === "" ? NaN : Number(raw);
      return Number.isFinite(value) ? round(Math.min(max, Math.max(min, value)), decimals) : fallback;
    },
    serialize: (value) => (value === fallback ? null : String(round(value, decimals))),
  };
}

/// One of a fixed set of strings; anything else → `fallback`.
export function urlEnum<T extends string>(values: readonly T[], fallback: T): UrlField<T> {
  return {
    parse: (raw) => (values as readonly string[]).includes(raw ?? "") ? (raw as T) : fallback,
    serialize: (value) => (value === fallback ? null : value),
  };
}

/// Boolean written as "1" / "0".
export function urlBool(fallback: boolean): UrlField<boolean> {
  return {
    parse: (raw) => (raw === "1" ? true : raw === "0" ? false : fallback),
    serialize: (value) => (value === fallback ? null : value ? "1" : "0"),
  };
}

/// Free text; empty → `fallback`.
export function urlString(fallback: string): UrlField<string> {
  return {
    parse: (raw) => (raw ? raw : fallback),
    serialize: (value) => (value === fallback || value === "" ? null : value),
  };
}

/// Reads every schema key from the query string.
export function parseUrlState<S>(schema: UrlSchema<S>, params: URLSearchParams): S {
  const out = {} as S;
  for (const key in schema) out[key] = schema[key].parse(params.get(key));
  return out;
}

/// Writes the schema keys of `state` into a copy of `params`; keys the schema doesn't own are kept.
export function writeUrlState<S>(schema: UrlSchema<S>, state: S, params: URLSearchParams): URLSearchParams {
  const next = new URLSearchParams(params);
  for (const key in schema) {
    const raw = schema[key].serialize(state[key]);
    if (raw === null) next.delete(key);
    else next.set(key, raw);
  }
  return next;
}
