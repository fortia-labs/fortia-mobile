# Política inicial de verificación de entrenadores

## Objetivo

Proteger al cliente y mantener un estándar de calidad para los profesionales que ofrecen acompañamiento en FortIA.

## Requisitos iniciales

El entrenador debe aportar:

- Identidad verificable.
- Formación, certificación o experiencia relevante.
- Especialidades declaradas.
- Descripción de su metodología.
- Experiencia práctica con clientes, cuando corresponda.
- Declaración de los servicios que ofrece y de sus límites profesionales.

## Estados

```text
pending → approved
pending → rejected
approved → suspended
```

- `pending`: información enviada y pendiente de revisión.
- `approved`: puede aparecer como entrenador verificado.
- `rejected`: no cumple los requisitos o debe aportar información adicional.
- `suspended`: se retira temporalmente la visibilidad por una incidencia o revisión.

## Revisión

Durante el MVP la revisión será manual por un administrador autorizado. Cada decisión debe registrar:

- Revisor.
- Fecha.
- Estado anterior y nuevo.
- Motivo de la decisión.
- Información faltante o acción requerida.

## Perfil público

El cliente podrá ver nombre, fotografía, especialidades, experiencia, metodología, precio orientativo y estado de verificación. No podrá ver documentos de identidad, certificados privados ni notas internas.

## Suspensión o rechazo

Puede producirse por documentación insuficiente, información falsa, conducta inapropiada, incumplimiento de las reglas de la plataforma o prestación de servicios fuera de la competencia declarada.

## Límites de responsabilidad

FortIA facilita la conexión y las herramientas de seguimiento, pero no debe presentar la verificación como garantía de resultados médicos o deportivos. Las recomendaciones sobre lesiones, enfermedades o nutrición clínica deben remitirse a profesionales habilitados.
