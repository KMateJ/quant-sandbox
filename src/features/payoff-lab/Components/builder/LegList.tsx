import { useState } from "react";
import { useI18n } from "../../../../i18n";
import type { PositionGroup, StrategyLeg } from "../../payoff.types";
import { createEmptyLeg } from "../../payoff.legs";
import { addToGroup, flattenPositions, groupLegs, nextPositionName, ungroup } from "../../payoff.positions";
import LegCard from "./LegCard";
import PositionCard from "./PositionCard";
import GroupBar from "./GroupBar";

type Positions = { legs: StrategyLeg[]; groups: PositionGroup[] };

type Props = Positions & {
  /// Every edit goes through here; it also clears the active preset.
  onChange: (next: Positions) => void;
};

/// Stand-alone legs and positions in leg order; tick legs to bundle them or move them into a position.
export default function LegList({ legs, groups, onChange }: Props) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const live = new Set(legs.map((l) => l.id));
  const picked = new Set([...selected].filter((id) => live.has(id)));

  const setLegs = (next: StrategyLeg[]) => onChange({ legs: next, groups });
  const updateLeg = (id: string, patch: Partial<StrategyLeg>) =>
    setLegs(legs.map((leg) => (leg.id === id ? { ...leg, ...patch } : leg)));
  const updateGroup = (id: string, patch: Partial<PositionGroup>) =>
    onChange({ legs, groups: groups.map((g) => (g.id === id ? { ...g, ...patch } : g)) });

  const toggle = (id: string) => {
    const next = new Set(picked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const groupSelected = () => {
    onChange(groupLegs(legs, groups, picked, nextPositionName(groups, (n) => t("payoffPositionDefaultName", { n }))));
    setSelected(new Set());
  };

  const legCard = (leg: StrategyLeg) => (
    <LegCard
      key={leg.id}
      leg={leg}
      number={legs.indexOf(leg) + 1}
      selected={picked.has(leg.id)}
      onToggleSelect={() => toggle(leg.id)}
      onUpdate={(patch) => updateLeg(leg.id, patch)}
      onRemove={() => setLegs(legs.filter((l) => l.id !== leg.id))}
    />
  );

  const groupById = new Map(groups.map((g) => [g.id, g]));
  const rendered = new Set<string>();

  return (
    <div className="controls-grid">
      <GroupBar
        selectedCount={picked.size}
        groups={groups}
        onGroup={groupSelected}
        onAddTo={(groupId) => {
          onChange(addToGroup(legs, groups, picked, groupId));
          setSelected(new Set());
        }}
        onClear={() => setSelected(new Set())}
      />

      {legs.map((leg) => {
        const group = leg.groupId ? groupById.get(leg.groupId) : undefined;
        if (!group) return legCard(leg);
        if (rendered.has(group.id)) return null;
        rendered.add(group.id);
        const members = legs.filter((l) => l.groupId === group.id);
        return (
          <PositionCard
            key={group.id}
            group={group}
            effectiveLegs={flattenPositions(members, [group])}
            onUpdate={(patch) => updateGroup(group.id, patch)}
            onUngroup={() => onChange(ungroup(legs, groups, group.id))}
            onRemove={() => setLegs(legs.filter((l) => l.groupId !== group.id))}
            onAddLeg={() => setLegs([...legs, { ...createEmptyLeg(legs.length + 1), groupId: group.id }])}
          >
            {members.map(legCard)}
          </PositionCard>
        );
      })}

      <button type="button" className="metric-button" onClick={() => setLegs([...legs, createEmptyLeg(legs.length + 1)])}>
        {t("payoffAddLeg")}
      </button>
    </div>
  );
}
