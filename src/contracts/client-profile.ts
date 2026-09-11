import type { Locale } from './user-roles';

export const CLIENT_GOALS = [
  'weight_loss',
  'muscle_gain',
  'body_recomposition',
  'strength',
  'start_training',
] as const;

export type ClientGoal = (typeof CLIENT_GOALS)[number];

export const EXPERIENCE_LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
] as const;

export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number];

export const TRAINING_FOCUSES = [
  'upper_body',
  'core',
  'lower_body',
] as const;

export type TrainingFocus = (typeof TRAINING_FOCUSES)[number];

export const TRAINING_LOCATIONS = ['gym', 'home'] as const;

export type TrainingLocation = (typeof TRAINING_LOCATIONS)[number];

export const EQUIPMENT_OPTIONS = [
  'full_gym',
  'dumbbells',
  'resistance_bands',
  'bodyweight',
] as const;

export type Equipment = (typeof EQUIPMENT_OPTIONS)[number];

/**
 * Private client profile, available only to the client and authorized backend
 * services. It is never a discoverable profile in the coach catalogue.
 */
export type ClientProfile = Readonly<{
  id: string;
  displayName: string;
  locale: Locale;
  goal: ClientGoal;
  experienceLevel: ExperienceLevel;
  trainingDaysPerWeek: number;
  equipment: readonly Equipment[];
  focus?: TrainingFocus;
  trainingLocation?: TrainingLocation;
  sessionDurationMinutes?: number;
}>;
