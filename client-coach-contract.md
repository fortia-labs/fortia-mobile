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
  "equipment": ["gym"],
  "specialtiesOfInterest": ["hypertrophy"],
  "healthConsiderations": ["none"]
}
```

El servidor identifica al cliente con la sesión autenticada; el payload nunca incluye `clientId`.

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

El onboarding profesional usa `CoachApplicationInput`. Identidad, número de documento, código de certificación, archivos y respuestas de evaluación son privados. Nunca se envían en `CoachProfile` ni a otros clientes.

Tras el envío, la postulación queda en revisión manual. El perfil se mantiene fuera del catálogo hasta la aprobación administrativa.

## Solicitud de acompañamiento

```json
{
  "coachId": "coach-alba-rojas",
  "message": "Quiero mejorar mi fuerza y técnica."
}
```

El backend crea una relación `requested`. El entrenador puede aceptarla o rechazarla.