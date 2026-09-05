# Contrato inicial cliente–entrenador

## Objetivo

Definir los datos mínimos que el frontend enviará y recibirá durante el onboarding y la exploración de entrenadores.

## Envío de onboarding

El frontend enviará:

```json
{
  "goal": "hypertrophy",
  "experienceLevel": "intermediate",
  "trainingDaysPerWeek": 4,
  "equipment": ["gym"],
  "specialtiesOfInterest": ["hypertrophy"],
  "restrictions": [],
  "locale": "es"
}
```

El backend validará los valores permitidos y asociará el resultado al cliente autenticado.

## Respuesta de entrenadores sugeridos

```json
{
  "coaches": [
    {
      "id": "coach-001",
      "name": "Nombre del entrenador",
      "avatarUrl": null,
      "specialties": ["hypertrophy"],
      "experienceYears": 6,
      "methodology": "Descripción breve",
      "priceReference": "Desde ...",
      "verificationStatus": "approved",
      "matchReasons": ["Especialista en tu objetivo"]
    }
  ]
}
```

## Solicitud de coaching

El cliente enviará:

```json
{
  "coachId": "coach-001",
  "message": "Quiero trabajar mi fuerza y mejorar mi técnica."
}
```

El backend creará una relación con estado `requested`. El entrenador podrá aceptarla o rechazarla.

## Reglas

- Nunca se confía en el `clientId` enviado por el móvil; se obtiene del usuario autenticado.
- Un entrenador no puede aparecer como sugerido si su verificación no está `approved`.
- El cliente solo recibe información pública del perfil.
- Los mensajes y notas privadas no se incluyen en el perfil público.
- Los errores deben devolver códigos manejables por el frontend, sin exponer información sensible.
