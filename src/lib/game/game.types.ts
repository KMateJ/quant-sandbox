/// Live or final verdict on one objective.
export type ObjectiveStatus = "onTrack" | "atRisk" | "pass" | "fail";
/// One evaluated objective. `D` is the desk's objective definition union.
export type ObjectiveResult<D> = { def: D; status: ObjectiveStatus; value: number };
/// Minimal mission shape every desk mission extends. Empty `objectives` = free play (future sandbox mode).
export type MissionBase<D> = { id: string; objectives: D[] };
/// Event envelope: `t` is the clock tick (day, month or year) the event belongs to.
export type GameEventBase = { t: number; kind: string };
export type ClockUnit = "day" | "month" | "year";
export type AdviceTone = "urgent" | "suggest" | "info" | "done";
/// Advice item; `A` is the desk's action union, `vars` feed the copy.
export type AdviceItem<A> = { id: string; tone: AdviceTone; vars: Record<string, number>; action?: A };
/// One scripted demo step; `S` = screen ids, `X` = desk action.
export type DemoStepBase<S extends string, X> = { id: string; screen: S; anchor: string; actions: X[]; holdMs: number };
/// Saved result of one mission in this browser.
export type MissionProgress = { completed: boolean; best: number | null };
/// Progress for every mission played, by id.
export type ProgressMap = Readonly<Record<string, MissionProgress>>;
export type ChallengeKind = "guess" | "range" | "pick" | "draw" | "place";
/// Saved record of one lab challenge round.
export type ChallengeStats = { played: number; hits: number; streak: number; bestStreak: number; lastAt: number };
