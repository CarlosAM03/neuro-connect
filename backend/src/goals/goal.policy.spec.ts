import { GoalStatus } from '@prisma/client';
import { assertActive, assertTransition } from './goal.policy';

describe('Goal lifecycle', () => {
  const states = Object.values(GoalStatus);
  for (const from of states)
    for (const to of states) {
      it(`${from} → ${to}`, () => {
        if (from === 'COMPLETED' && to === 'PAUSED')
          expect(() => assertTransition(from, to)).toThrow();
        else expect(() => assertTransition(from, to)).not.toThrow();
      });
    }
  it.each(states)('CheckIn only for ACTIVE (%s)', (status) => {
    if (status === 'ACTIVE') expect(() => assertActive(status)).not.toThrow();
    else expect(() => assertActive(status)).toThrow();
  });
});
