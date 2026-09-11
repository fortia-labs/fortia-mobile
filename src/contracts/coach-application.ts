import type {
  CoachProfile,
  CoachSpecialty,
} from './coach-profile';
import type { LocalizedText } from './user-roles';

export const COACH_EDUCATION_TYPES = [
  'university_degree',
  'international_certification',
] as const;

export type CoachEducationType = (typeof COACH_EDUCATION_TYPES)[number];

export const COACH_DOCUMENT_TYPES = [
  'identity_document',
  'degree_or_certificate',
] as const;

export type CoachDocumentType = (typeof COACH_DOCUMENT_TYPES)[number];

export const COACH_ASSESSMENT_QUESTIONS = [
  'safety_lumbar_adaptation',
  'programming_beginner_short_sessions',
] as const;

export type CoachAssessmentQuestionId =
  (typeof COACH_ASSESSMENT_QUESTIONS)[number];

export const COACH_PHILOSOPHIES = [
  'evidence',
  'biomechanics',
  'performance',
  'holistic',
] as const;

export type CoachPhilosophy = (typeof COACH_PHILOSOPHIES)[number];

export const COACH_APPLICATION_STATUSES = [
  'draft',
  'submitted',
  'under_review',
  'approved',
  'rejected',
] as const;

export type CoachApplicationStatus =
  (typeof COACH_APPLICATION_STATUSES)[number];

/** Private file metadata only. Raw files, public URLs and document contents
 * are deliberately excluded from this shared mobile contract. */
export type CoachDocumentMetadata = Readonly<{
  type: CoachDocumentType;
  fileName: string;
  mimeType: 'application/pdf' | 'image/jpeg' | 'image/png';
  storageKey: string;
}>;

export type CoachAssessmentAnswer = Readonly<{
  questionId: CoachAssessmentQuestionId;
  selectedOptionId: string;
}>;

export type CoachSuccessCase = Readonly<{
  clientGoal: string;
  durationLabel: string;
  strategy: string;
  hasMediaAuthorization: boolean;
  mediaStorageKeys?: readonly string[];
}>;

/**
 * Private submission consumed only by the verification service and authorized
 * administrators. Never expose this object through coach discovery endpoints.
 */
export type CoachApplicationInput = Readonly<{
  legalName: string;
  identityDocumentNumber: string;
  educationType: CoachEducationType;
  credentialVerificationCode: string;
  documents: readonly CoachDocumentMetadata[];
  assessmentAnswers: readonly CoachAssessmentAnswer[];
  successCases: readonly CoachSuccessCase[];
  philosophies: readonly CoachPhilosophy[];
  publicProfileDraft: Pick<
    CoachProfile,
    | 'displayName'
    | 'bio'
    | 'specialties'
    | 'experienceYears'
    | 'methodology'
    | 'languages'
    | 'acceptingClients'
    | 'priceReference'
  >;
}>;

export type CoachApplication = Readonly<
  CoachApplicationInput & {
    id: string;
    coachId: string;
    status: CoachApplicationStatus;
    submittedAt?: string;
  }
>;

export type CoachDiscoveryMatch = Readonly<{
  coach: CoachProfile;
  matchReasons: readonly LocalizedText[];
}>;
