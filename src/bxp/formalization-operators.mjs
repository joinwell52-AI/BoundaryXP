const slots = {
  obligation: ['A', 'O'], prohibition: ['B'], completion: ['C'], constraint: ['R', 'V', 'A', 'C'],
  interval: ['R', 'C'], entity: ['I', 'O', 'P', 'V'], relation: ['A', 'P', 'V', 'C'],
  target_set: ['A', 'B'], allowed_set: ['A', 'B'], handoff: ['I', 'O', 'A', 'C'], artifact_state: ['O', 'C', 'B'],
};

export const FORMALIZATION_OPERATOR_SLOTS = Object.freeze(Object.fromEntries(
  Object.entries(slots).map(([operator, allowed]) => [operator, Object.freeze(allowed)]),
));
