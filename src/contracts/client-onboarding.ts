import type {
  ClientGoal,
  Equipment,
  ExperienceLevel,
  TrainingFocus,
  TrainingLocation,
} from './client-profile';
import type { Locale } from './user-roles';

export const HEALTH_CONSIDERATIONS = [
  'knee',
  'lower_back',
  'shoulder',
  'cardiovascular',
  'dizziness',
  'circulatory',
  'none',
] as const;

export type HealthConsideration = (typeof HEALTH_CONSIDERATIONS)[number];

/**
 * Payload produced by the current client onboarding flow.
 *
 * Health considerations are private. The API must obtain the authenticated
 * client identifier from the session; it must not accept clientId from mobile.
 */
export type ClientOnboardingInput = Readonly<{
  locale: Locale;
  goal: ClientGoal;
  focus: TrainingFocus;
  experienceLevel: ExperienceLevel;
  trainingLocation: TrainingLocation;
  trainingDaysPerWeek: 2 | 3 | 4 | 5 | 6;
  sessionDurationMinutes: 30 | 45 | 60 | 75 | 90 | 105 | 120 | 135 | 150;
  equipment: readonly Equipment[];
  healthConsiderations: readonly HealthConsideration[];
}>;

export const requiresMedicalGuidance = (
  healthConsiderations: readonly HealthConsideration[],
): boolean => healthConsiderations.some((item) => item !== 'none');
