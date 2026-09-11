import type { Locale, LocalizedText } from './user-roles';

export const COACH_SPECIALTIES = [
  'hypertrophy',
  'strength',
  'powerlifting',
] as const;

export type CoachSpecialty = (typeof COACH_SPECIALTIES)[number];

export const COACH_VERIFICATION_STATUSES = [
  'pending',
  'approved',
  'rejected',
  'suspended',
] as const;

export type CoachVerificationStatus =
  (typeof COACH_VERIFICATION_STATUSES)[number];

export type PriceReference = Readonly<{
  amount: number;
  currency: 'USD' | 'COP';
  period: 'month' | 'program';
}>;

/**
 * Information that may be returned to a client. It intentionally excludes
 * identity documents, personal email, credential codes, review notes, and
 * every other verification-only field.
 */
export type CoachProfile = Readonly<{
  id: string;
  displayName: string;
  avatarUrl?: string;
  bio: LocalizedText;
  specialties: readonly CoachSpecialty[];
  experienceYears: number;
  methodology: LocalizedText;
  languages: readonly Locale[];
  acceptingClients: boolean;
  verificationStatus: CoachVerificationStatus;
  priceReference?: PriceReference;
}>;

export const isDiscoverableCoach = (coach: CoachProfile): boolean =>
  coach.verificationStatus === 'approved' && coach.acceptingClients;
