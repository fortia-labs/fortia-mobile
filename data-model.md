# Modelo de datos inicial de FortIA

## Objetivo

Definir las entidades mínimas para que FortIA gestione clientes, entrenadores profesionales, programas de entrenamiento, seguimiento y asistencia de IA.

## Principios

- Cada registro pertenece a un usuario o relación autorizada.
- El cliente controla sus datos personales y de entrenamiento.
- El entrenador solo puede acceder a clientes vinculados a él.
- La verificación profesional tiene estados explícitos y trazables.
- Los pagos no forman parte del modelo funcional del primer MVP.

## Entidades principales

### profiles

Identidad común de cualquier cuenta.

- `id`: identificador del usuario.
- `email`: correo de acceso.
- `full_name`: nombre visible.
- `avatar_url`: fotografía opcional.
- `role`: `client`, `coach` o `admin`.
- `locale`: `es` o `en`.
- `created_at`, `updated_at`.

### client_profiles

Información deportiva del cliente.

- `user_id`.
- `goal`: hipertrofia, fuerza, composición corporal u otro objetivo permitido.
- `experience_level`.
- `training_days_per_week`.
- `equipment`.
- `restrictions`.
- `preferences`.
- `date_of_birth` o rango de edad, según la política de privacidad.

### coach_profiles

Información pública y profesional del entrenador.

- `user_id`.
- `bio`.
- `specialties`: fuerza, hipertrofia, powerlifting, etc.
- `years_experience`.
- `methodology`.
- `price_reference`.
- `profile_status`: `draft`, `published`, `paused`.
- `verification_status`: `pending`, `approved`, `rejected`, `suspended`.

### coach_verifications

Solicitud y revisión de credenciales profesionales.

- `id`.
- `coach_id`.
- `identity_status`.
- `credential_status`.
- `specialty_evidence`.
- `review_notes`.
- `reviewed_by`.
- `submitted_at`, `reviewed_at`.

No se deben guardar documentos sensibles sin definir previamente almacenamiento, retención y acceso administrativo.

### coaching_relationships

Vinculación entre cliente y entrenador.

- `id`.
- `client_id`.
- `coach_id`.
- `status`: `requested`, `active`, `paused`, `ended`, `rejected`.
- `started_at`, `ended_at`.

Debe existir control para evitar relaciones duplicadas activas para la misma pareja.

### exercises

Catálogo de ejercicios disponibles.

- `id`.
- `name`.
- `description`.
- `muscle_groups`.
- `equipment`.
- `instructions`.
- `created_by` o indicador de ejercicio oficial.

### programs

Programa asignado por un entrenador.

- `id`.
- `coach_id`.
- `client_id`.
- `name`.
- `objective`.
- `status`: `draft`, `active`, `completed`, `archived`.
- `start_date`, `end_date`.

### mesocycles

Bloque estructurado dentro de un programa.

- `id`.
- `program_id`.
- `name`.
- `duration_weeks`.
- `focus`.
- `deload_week`.

### workouts

Sesión planificada.

- `id`.
- `mesocycle_id`.
- `week_number`.
- `day_number`.
- `name`.
- `scheduled_date`.

### workout_exercises

Ejercicio prescrito dentro de una sesión.

- `id`.
- `workout_id`.
- `exercise_id`.
- `order_index`.
- `sets_target`.
- `reps_min`, `reps_max`.
- `rir_target`.
- `rest_seconds`.
- `load_target`.
- `coach_notes`.

### set_logs

Resultado real de una serie realizada por el cliente.

- `id`.
- `workout_exercise_id`.
- `client_id`.
- `set_number`.
- `load_used`.
- `repetitions`.
- `rir_reported`.
- `pain_reported`.
- `completed_at`.

### recovery_checkins

Registro de recuperación y percepción del cliente.

- `id`.
- `client_id`.
- `sleep_quality`.
- `fatigue_level`.
- `stress_level`.
- `soreness_level`.
- `pain_notes`.
- `general_notes`.
- `created_at`.

## Relaciones

```text
profiles
 ├── client_profiles
 └── coach_profiles

coach_profiles ── coach_verifications
client_profiles ── coaching_relationships ── coach_profiles
coach + client ── programs ── mesocycles ── workouts
workouts ── workout_exercises ── exercises
workout_exercises ── set_logs
client_profiles ── recovery_checkins
```

## Fuera del MVP

Se reservarán para fases posteriores `subscriptions`, `payments`, `payouts`, reseñas públicas, chat avanzado y recomendaciones nutricionales clínicas.
