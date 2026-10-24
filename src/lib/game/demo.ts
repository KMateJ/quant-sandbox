/// State after each step: `out[k]` folds the actions of `steps[0..k]` from `start`.
export function foldStates<S, X>(start: S, steps: readonly { actions: readonly X[] }[], reduce: (s: S, x: X) => S): S[] {
  const out: S[] = [];
  let state = start;
  for (const step of steps) {
    state = step.actions.reduce(reduce, state);
    out.push(state);
  }
  return out;
}

/// Index of the step with `id`, or −1.
export function stepIndexById(steps: readonly { id: string }[], id: string): number {
  return steps.findIndex((s) => s.id === id);
}
