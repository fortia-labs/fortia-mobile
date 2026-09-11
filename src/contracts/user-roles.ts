export const USER_ROLES = ['client', 'coach', 'admin'] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const LOCALES = ['es', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export type LocalizedText = Readonly<Record<Locale, string>>;
