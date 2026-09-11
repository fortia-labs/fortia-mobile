# Contratos compartidos del MVP

Estos contratos unen el onboarding móvil actual con los datos que expondrá el backend. Todo el contenido visible al cliente existe en español e inglés mediante `LocalizedText`.

## Importación

```ts
import {
  isDiscoverableCoach,
  type ClientOnboardingInput,
  type CoachApplicationInput,
} from '../../src/contracts';
import { mockCoaches } from '../../src/mocks/coach-list';

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
- `healthConsiderations`: lista privada de condiciones declaradas. `none` no debe coexistir con otra opción. Si hay una opción distinta de `none`, la interfaz recomienda una consulta médica; no diagnostica ni prescribe.

El backend obtiene el identificador del cliente desde la sesión autenticada, nunca del payload móvil.

## Entrenador: postulación privada

`CoachProfile` es el perfil público. No contiene documento de identidad, correo, código de certificado, archivos ni notas de revisión.

`CoachApplicationInput` modela el flujo privado: identidad, formación, documentos de respaldo, respuestas a dos escenarios, casos de éxito y filosofía. Los archivos se representan únicamente por metadatos y una clave privada de almacenamiento; no viajan como contenido del documento ni como URL pública.

Al enviarse, la postulación pasa a `submitted` o `under_review`; el perfil no aparece en el catálogo hasta que un administrador asigna `verificationStatus: 'approved'`.

## Datos simulados

Todos los seis entrenadores en `src/mocks/coach-list.json` son ficticios. No usan fotografías, credenciales, personas ni resultados reales.

El archivo contiene:

- Cuatro entrenadores aprobados y con cupos.
- Un perfil `pending`, que no debe aparecer en recomendaciones.
- Un perfil aprobado sin cupos, que tampoco debe mostrar solicitud de acompañamiento.

## Comprobación

El repositorio aún no contiene el proyecto Expo ni una herramienta TypeScript instalada, por lo que esta rama aporta `tsconfig.contracts.json` pero no puede ejecutar la comprobación aquí.

Cuando el frontend esté incorporado, ejecutar:

```bash
npx -p typescript tsc -p tsconfig.contracts.json
```

Además de TypeScript, `validateMockCoaches()` valida al cargar que cada ejemplo coincide con la forma de `CoachProfile` y que sus identificadores son únicos.
