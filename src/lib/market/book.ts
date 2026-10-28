import type { Book, Fill, Level, Owner, RestingOrder, Side, Taker } from "./market.types";

type Walk = { levels: Level[]; fills: Fill[]; filled: number; notional: number };

/// A book with no orders.
export function emptyBook(): Book {
  return { bids: [], asks: [], nextId: 1 };
}

/// Best bid in ticks, or null when there are no bids.
export const bestBid = (b: Book): number | null => b.bids[0]?.price ?? null;
/// Best ask in ticks, or null when there are no asks.
export const bestAsk = (b: Book): number | null => b.asks[0]?.price ?? null;

/// Mid in ticks (may be x.5); null when a side is empty.
export function midTicks(b: Book): number | null {
  const bid = bestBid(b);
  const ask = bestAsk(b);
  return bid === null || ask === null ? null : (bid + ask) / 2;
}

/// Quoted spread in ticks; null when a side is empty.
export function spreadTicks(b: Book): number | null {
  const bid = bestBid(b);
  const ask = bestAsk(b);
  return bid === null || ask === null ? null : ask - bid;
}

const opposite = (side: Side): "bids" | "asks" => (side === "buy" ? "asks" : "bids");
const own = (side: Side): "bids" | "asks" => (side === "buy" ? "bids" : "asks");
const crosses = (side: Side, levelPrice: number, limit: number) =>
  side === "buy" ? levelPrice <= limit : levelPrice >= limit;
const levelSize = (l: Level) => l.orders.reduce((s, o) => s + o.size, 0);

/// Execute `size` against the opposite-side `levels` in price–time order up to `limit`.
function walk(levels: Level[], side: Side, size: number, limit: number, t: number, taker: Taker): Walk {
  const out = levels.slice();
  const fills: Fill[] = [];
  let left = size;
  let notional = 0;
  while (left > 0 && out.length > 0 && crosses(side, out[0].price, limit)) {
    const level = out[0];
    const orders = level.orders.slice();
    while (left > 0 && orders.length > 0) {
      const o = orders[0];
      const take = Math.min(left, o.size);
      fills.push({ makerId: o.id, makerOwner: o.owner, taker, side, price: level.price, size: take, t });
      left -= take;
      notional += take * level.price;
      if (take === o.size) orders.shift();
      else orders[0] = { ...o, size: o.size - take };
    }
    if (orders.length === 0) out.shift();
    else out[0] = { price: level.price, orders };
  }
  return { levels: out, fills, filled: size - left, notional };
}

/// Append `order` at the back of its level, inserting the level in sorted position.
function insertResting(levels: Level[], order: RestingOrder): Level[] {
  const better = (p: number) => (order.side === "buy" ? p > order.price : p < order.price);
  const out = levels.slice();
  let i = 0;
  while (i < out.length && better(out[i].price)) i++;
  if (out[i]?.price === order.price) out[i] = { price: order.price, orders: [...out[i].orders, order] };
  else out.splice(i, 0, { price: order.price, orders: [order] });
  return out;
}

/// Place a limit order; a marketable part executes first (price–time), the rest rests at the back of its level.
export function addLimit(
  b: Book,
  o: { side: Side; price: number; size: number; owner: Owner; t: number },
  taker: Taker = o.owner,
): { book: Book; id: number; fills: Fill[] } {
  const id = b.nextId;
  const w = walk(b[opposite(o.side)], o.side, o.size, o.price, o.t, taker);
  const book: Book = { ...b, [opposite(o.side)]: w.levels, nextId: id + 1 };
  const rest = o.size - w.filled;
  if (rest > 0) book[own(o.side)] = insertResting(b[own(o.side)], { id, ...o, size: rest });
  return { book, id, fills: w.fills };
}

/// Execute a market order of `size`; `unfilled` is what the book could not absorb.
export function marketOrder(b: Book, side: Side, size: number, t: number, taker: Taker) {
  const limit = side === "buy" ? Infinity : -Infinity;
  const w = walk(b[opposite(side)], side, size, limit, t, taker);
  const book: Book = { ...b, [opposite(side)]: w.levels };
  const avgPrice = w.filled > 0 ? w.notional / w.filled : null;
  return { book, fills: w.fills, filled: w.filled, avgPrice, unfilled: size - w.filled };
}

/// The levels a market order of `size` would take, without changing the book (hover previews).
export function previewMarket(b: Book, side: Side, size: number) {
  const rows: { price: number; take: number; cum: number }[] = [];
  let cum = 0;
  let notional = 0;
  for (const level of b[opposite(side)]) {
    if (cum >= size) break;
    const take = Math.min(levelSize(level), size - cum);
    cum += take;
    notional += take * level.price;
    rows.push({ price: level.price, take, cum });
  }
  return { rows, avgPrice: cum > 0 ? notional / cum : null, filled: cum, unfilled: size - cum };
}

function filterOrders(levels: Level[], keep: (o: RestingOrder) => boolean): Level[] {
  let changed = false;
  const out: Level[] = [];
  for (const level of levels) {
    const orders = level.orders.filter(keep);
    if (orders.length !== level.orders.length) changed = true;
    if (orders.length > 0) out.push(orders.length === level.orders.length ? level : { price: level.price, orders });
  }
  return changed ? out : levels;
}

/// Remove order `id` (no-op if it is gone).
export function cancel(b: Book, id: number): Book {
  const keep = (o: RestingOrder) => o.id !== id;
  return { ...b, bids: filterOrders(b.bids, keep), asks: filterOrders(b.asks, keep) };
}

/// Remove every order of `owner`.
export function cancelOwner(b: Book, owner: Owner): Book {
  const keep = (o: RestingOrder) => o.owner !== owner;
  return { ...b, bids: filterOrders(b.bids, keep), asks: filterOrders(b.asks, keep) };
}

/// All resting orders of `owner`, bids first, in priority order.
export function ordersOf(b: Book, owner: Owner): RestingOrder[] {
  return [...b.bids, ...b.asks].flatMap((l) => l.orders.filter((o) => o.owner === owner));
}

/// Shares queued ahead of order `id` at its level; null if it is not resting.
export function queueAhead(b: Book, id: number): number | null {
  for (const level of [...b.bids, ...b.asks]) {
    const i = level.orders.findIndex((o) => o.id === id);
    if (i >= 0) return level.orders.slice(0, i).reduce((s, o) => s + o.size, 0);
  }
  return null;
}

/// Best `n` levels of the book side holding `side` orders, with size and cumulative size.
export function depth(b: Book, side: Side, n: number): { price: number; size: number; cum: number }[] {
  let cum = 0;
  return b[own(side)].slice(0, n).map((l) => {
    const size = levelSize(l);
    cum += size;
    return { price: l.price, size, cum };
  });
}
