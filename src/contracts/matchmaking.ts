import type { ClientGoal } from './client-profile';
import type { CoachSpecialty } from './coach-profile';

/**
 * Transparent MVP rule used to derive specialties from the client's goal.
 * `specialtiesOfInterest` is deliberately not accepted from mobile because it
 * duplicated this rule and could disagree with `goal`.
 */
export const COACH_SPECIALTIES_BY_CLIENT_GOAL = {
  weight_loss: ['hypertrophy'],
  muscle_gain: ['hypertrophy'],
  body_recomposition: ['hypertrophy', 'strength'],
  strength: ['strength', 'powerlifting'],
  start_training: ['hypertrophy', 'strength'],
} as const satisfies Readonly<Record<ClientGoal, readonly CoachSpecialty[]>>;

export const getCoachSpecialtiesForGoal = (
  goal: ClientGoal,
): readonly CoachSpecialty[] => COACH_SPECIALTIES_BY_CLIENT_GOAL[goal];
