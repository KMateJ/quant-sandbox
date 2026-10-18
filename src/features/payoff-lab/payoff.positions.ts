import type { ChartComponent, PositionGroup, StrategyLeg } from "./payoff.types";
import { getStrategyValue } from "./payoff.math";

/// Groups that still have at least one member leg.
export function liveGroups(legs: StrategyLeg[], groups: PositionGroup[]): PositionGroup[] {
  const used = new Set(legs.map((leg) => leg.groupId));
  return groups.filter((g) => used.has(g.id));
}

/// Effective legs after applying each position's quantity and direction to its members.
export function flattenPositions(legs: StrategyLeg[], groups: PositionGroup[]): StrategyLeg[] {
  const byId = new Map(groups.map((g) => [g.id, g]));
  return legs.map((leg) => {
    const group = leg.groupId ? byId.get(leg.groupId) : undefined;
    if (!group) return leg;
    const direction = group.direction === "short"
      ? (leg.direction === "long" ? "short" : "long")
      : leg.direction;
    return { ...leg, direction, quantity: leg.quantity * group.quantity };
  });
}

/// Components for the chart: each stand-alone leg and each position, in first-appearance order.
export function positionComponents(
  legs: StrategyLeg[],
  groups: PositionGroup[],
  legLabel: (index: number) => string
): ChartComponent[] {
  const effective = flattenPositions(legs, groups);
  const names = new Map(groups.map((g) => [g.id, g.name]));
  const components: ChartComponent[] = [];
  const byGroup = new Map<string, ChartComponent>();

  effective.forEach((leg, index) => {
    const groupId = leg.groupId && names.has(leg.groupId) ? leg.groupId : undefined;
    if (!groupId) {
      components.push({ key: `leg-${index + 1}`, label: legLabel(index), legs: [leg] });
      return;
    }
    const existing = byGroup.get(groupId);
    if (existing) {
      existing.legs.push(leg);
      return;
    }
    const component = { key: `pos-${groupId}`, label: names.get(groupId) ?? groupId, legs: [leg] };
    byGroup.set(groupId, component);
    components.push(component);
  });

  return components;
}

/// Up-front cost of a set of legs (premiums, stock entry, cash deposits); negative = credit.
export function netCost(legs: StrategyLeg[]): number {
  return getStrategyValue(legs, 0, "payoff") - getStrategyValue(legs, 0, "profit");
}

/// Bundles the legs in `ids` into a new long ×1 position; legs leave any previous position.
export function groupLegs(
  legs: StrategyLeg[],
  groups: PositionGroup[],
  ids: Set<string>,
  name: string
): { legs: StrategyLeg[]; groups: PositionGroup[] } {
  const id = `pos-${Date.now().toString(36)}`;
  const nextLegs = legs.map((leg) => (ids.has(leg.id) ? { ...leg, groupId: id } : leg));
  return {
    legs: nextLegs,
    groups: liveGroups(nextLegs, [...groups, { id, name, direction: "long", quantity: 1 }]),
  };
}

/// Moves the legs in `ids` into an existing position, rescaling each so its own payoff is unchanged
/// (a leg joining a short ×2 position is halved and flipped before the position re-applies both).
export function addToGroup(
  legs: StrategyLeg[],
  groups: PositionGroup[],
  ids: Set<string>,
  groupId: string
): { legs: StrategyLeg[]; groups: PositionGroup[] } {
  const target = groups.find((g) => g.id === groupId);
  if (!target) return { legs, groups };
  const effective = flattenPositions(legs, groups);
  const nextLegs = legs.map((leg, i) => {
    if (!ids.has(leg.id) || leg.groupId === groupId) return leg;
    const own = effective[i];
    const direction = target.direction === "short"
      ? (own.direction === "long" ? "short" : "long")
      : own.direction;
    return { ...own, direction, quantity: own.quantity / target.quantity, groupId };
  });
  return { legs: nextLegs, groups: liveGroups(nextLegs, groups) };
}

/// Dissolves a position, baking its quantity and direction into the member legs so the payoff is unchanged.
export function ungroup(
  legs: StrategyLeg[],
  groups: PositionGroup[],
  groupId: string
): { legs: StrategyLeg[]; groups: PositionGroup[] } {
  const group = groups.find((g) => g.id === groupId);
  const others = groups.filter((g) => g.id !== groupId);
  if (!group) return { legs, groups: others };
  const baked = flattenPositions(legs, [group]);
  return {
    legs: baked.map((leg) => (leg.groupId === groupId ? { ...leg, groupId: undefined } : leg)),
    groups: others,
  };
}

/// Next unused default name, e.g. "Position 3".
export function nextPositionName(groups: PositionGroup[], template: (n: number) => string): string {
  const taken = new Set(groups.map((g) => g.name));
  let n = groups.length + 1;
  while (taken.has(template(n))) n += 1;
  return template(n);
}
