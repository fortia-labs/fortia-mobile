# Contrato de onboarding y descubrimiento de FortIA

## Objetivo

Definir el límite entre el onboarding móvil y los servicios que recomiendan entrenadores. La fuente de tipos es `src/contracts`.

## Envío del onboarding del cliente

El móvil envía un `ClientOnboardingInput`:

```json
{
  "locale": "es",
  "goal": "muscle_gain",
  "focus": "lower_body",
  "experienceLevel": "intermediate",
  "trainingLocation": "gym",
  "trainingDaysPerWeek": 4,
  "sessionDurationMinutes": 60,
  "equipment": ["full_gym"],
  "healthConsiderations": ["none"]
}
```

El servidor identifica al cliente con la sesión autenticada; el payload nunca incluye `clientId`.

`equipment` usa únicamente los valores canónicos `full_gym`, `dumbbells`, `resistance_bands` y `bodyweight`. Las especialidades no se duplican en el payload: se derivan de `goal` mediante `COACH_SPECIALTIES_BY_CLIENT_GOAL`.

`healthConsiderations` es información privada. Si contiene una opción distinta de `none`, el producto muestra una advertencia educativa y recomienda consultar a un profesional de salud. No diagnostica ni prescribe.

## Respuesta de entrenadores sugeridos

La respuesta contiene solo `CoachProfile` público y razones de coincidencia localizadas:

```json
{
  "coaches": [
    {
      "id": "coach-alba-rojas",
      "displayName": "Alba Rojas",
      "specialties": ["hypertrophy"],
      "verificationStatus": "approved",
      "acceptingClients": true,
      "matchReasons": [
        {
          "es": "Experiencia compatible con tu objetivo",
          "en": "Experience aligned with your goal"
        }
      ]
    }
  ]
}
```

Un entrenador solo aparece y puede recibir solicitudes cuando `verificationStatus` es `approved` y `acceptingClients` es `true`.

## Postulación de entrenador

El onboarding profesional usa `CoachApplicationInput`. Identidad, número de documento, código de certificación, archivos y las tres respuestas de evaluación son privados. Nunca se envían en `CoachProfile` ni a otros clientes.

La postulación sigue el orden `draft` → `questionnaire_submitted` → `documents_required` → `under_review`; los documentos solo se envían después de ser requeridos. La revisión manual puede solicitar cambios, aprobar o rechazar la postulación. El perfil se mantiene fuera del catálogo hasta la aprobación administrativa.

## Solicitud de acompañamiento

```json
{
  "coachId": "coach-alba-rojas",
  "message": "Quiero mejorar mi fuerza y técnica."
}
```

El backend crea una relación `requested`. El entrenador puede aceptarla o rechazarla.
