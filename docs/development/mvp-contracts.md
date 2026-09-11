# Contratos compartidos del MVP

Estos contratos unen el onboarding móvil actual con los datos que expondrá el backend. Todo el contenido visible al cliente existe en español e inglés mediante `LocalizedText`.

## Importación

```ts
import {
  isDiscoverableCoach,
  mockCoaches,
  type ClientOnboardingInput,
  type CoachApplicationInput,
} from '../../src';

const catalogue = mockCoaches.filter(isDiscoverableCoach);
```

El catálogo **solo** debe ofrecer solicitud de acompañamiento cuando el perfil está `approved` y `acceptingClients` es `true`.

## Cliente: valores de onboarding

- `goal`: `weight_loss`, `muscle_gain`, `body_recomposition`, `strength` o `start_training`. La interfaz actual presenta los primeros cuatro; `start_training` se conserva para una entrada inicial compatible.
- `focus`: `upper_body`, `core` o `lower_body`.
- `experienceLevel`: `beginner`, `intermediate` o `advanced`.
- `trainingLocation`: `gym` o `home`.
- `trainingDaysPerWeek`: de 2 a 6.
- `sessionDurationMinutes`: de 30 a 150, en intervalos de 15 minutos.
- `equipment`: `full_gym`, `dumbbells`, `resistance_bands` o `bodyweight`. Este campo describe recursos disponibles y no duplica `trainingLocation`.
- `healthConsiderations`: lista privada de condiciones declaradas. `none` no debe coexistir con otra opción. Si hay una opción distinta de `none`, la interfaz recomienda una consulta médica; no diagnostica ni prescribe.

El backend obtiene el identificador del cliente desde la sesión autenticada, nunca del payload móvil.

`specialtiesOfInterest` no forma parte del payload. El matchmaking obtiene las especialidades canónicas a partir de `goal` mediante el mapeo exhaustivo `COACH_SPECIALTIES_BY_CLIENT_GOAL`.

## Entrenador: postulación privada

`CoachProfile` es el perfil público. No contiene documento de identidad, correo, código de certificado, archivos ni notas de revisión.

`CoachApplicationInput` modela los datos privados de identidad, formación, casos de éxito y filosofía. La evaluación contiene exactamente tres escenarios de conocimiento y seguridad. `CoachQuestionnaireSubmissionInput` y `CoachDocumentsSubmissionInput` separan las fronteras de envío para impedir que el cliente móvil solicite documentos antes de que el backend los requiera.

Los archivos se representan únicamente por metadatos y una clave privada de almacenamiento; no viajan como contenido del documento ni como URL pública.

La progresión contractual es `draft` → `questionnaire_submitted` → `documents_required` → `under_review`. La revisión puede terminar en `approved`, `rejected` o `changes_requested`; una cuenta aprobada también puede pasar a `suspended`. El perfil no aparece en el catálogo hasta que un administrador asigna `verificationStatus: 'approved'`.

## Datos simulados

Todos los seis entrenadores en `src/mocks/coach-list.json` son ficticios. No usan fotografías, credenciales, personas ni resultados reales.

El archivo contiene:

- Cuatro entrenadores aprobados y con cupos.
- Un perfil `pending`, que no debe aparecer en recomendaciones.
- Un perfil aprobado sin cupos, que tampoco debe mostrar solicitud de acompañamiento.

## Comprobación

El repositorio aún no contiene el proyecto Expo. La comprobación aislada de contratos utiliza `tsconfig.contracts.json`.

Cuando el frontend esté incorporado, ejecutar:

```bash
tsc -p tsconfig.contracts.json
```

Además de TypeScript, `validateMockCoaches()` valida al cargar que cada ejemplo coincide con la forma de `CoachProfile`, usa especialidades e idiomas canónicos y no repite identificadores ni valores en esas listas.
