import rawCoachList from './coach-list.json';

import {
  COACH_SPECIALTIES,
  COACH_VERIFICATION_STATUSES,
  type CoachProfile,
} from '../contracts/coach-profile';
import { LOCALES } from '../contracts/user-roles';

const includes = <T extends string>(
  values: readonly T[],
  value: unknown,
): value is T => typeof value === 'string' && values.includes(value as T);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isLocalizedText = (value: unknown): boolean =>
  isRecord(value) &&
  LOCALES.every((locale) => typeof value[locale] === 'string');

const isCoachProfile = (value: unknown): value is CoachProfile => {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === 'string' &&
    typeof value.displayName === 'string' &&
    isLocalizedText(value.bio) &&
    Array.isArray(value.specialties) &&
    value.specialties.every((specialty) =>
      includes(COACH_SPECIALTIES, specialty),
    ) &&
    typeof value.experienceYears === 'number' &&
    isLocalizedText(value.methodology) &&
    Array.isArray(value.languages) &&
    value.languages.every((locale) => includes(LOCALES, locale)) &&
    typeof value.acceptingClients === 'boolean' &&
    includes(COACH_VERIFICATION_STATUSES, value.verificationStatus)
  );
};

export const mockCoaches: readonly CoachProfile[] = rawCoachList.map(
  (coach) => {
    if (!isCoachProfile(coach)) {
      throw new Error('coach-list.json does not match CoachProfile');
    }

    return coach;
  },
);

export const validateMockCoaches = (
  coaches: readonly CoachProfile[] = mockCoaches,
): void => {
  const ids = new Set<string>();

  coaches.forEach((coach) => {
    if (ids.has(coach.id)) {
      throw new Error(`Duplicate mock coach id: ${coach.id}`);
    }

    ids.add(coach.id);
  });
};

validateMockCoaches();
