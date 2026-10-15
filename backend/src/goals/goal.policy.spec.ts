import { GoalStatus } from '@prisma/client';
import { assertActive, assertTransition } from './goal.policy';

describe('Goal lifecycle', () => {
  const states = Object.values(GoalStatus);
  for (const from of states)
    for (const to of states) {
      it(`${from} → ${to}`, () => {
        const permitted: Record<GoalStatus, GoalStatus[]> = {
          ACTIVE: ['ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'],
          PAUSED: ['PAUSED', 'ACTIVE', 'CANCELLED'],
          COMPLETED: ['COMPLETED', 'ACTIVE'],
          CANCELLED: ['CANCELLED', 'ACTIVE'],
        };
        if (!permitted[from].includes(to))
          expect(() => assertTransition(from, to)).toThrow();
        else expect(() => assertTransition(from, to)).not.toThrow();
      });
    }
  it.each(states)('CheckIn only for ACTIVE (%s)', (status) => {
    if (status === 'ACTIVE') expect(() => assertActive(status)).not.toThrow();
    else expect(() => assertActive(status)).toThrow();
  });
});
