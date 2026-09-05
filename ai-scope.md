# Alcance de IA para el MVP

## Objetivo

Usar IA para aumentar la capacidad del entrenador y mejorar la comprensión del cliente, manteniendo siempre supervisión humana.

## Funciones para el entrenador

- Resumir check-ins y registros recientes.
- Identificar posibles patrones de fatiga, baja adherencia o estancamiento.
- Proponer borradores de ajustes de volumen, carga o repeticiones.
- Ayudar a redactar explicaciones y notas para el cliente.
- Convertir datos estructurados en un resumen legible.

Todas las propuestas deben mostrarse como sugerencias y requerir aprobación del entrenador antes de modificar un programa.

## Funciones para el cliente

- Explicar el propósito de un ejercicio o bloque de entrenamiento.
- Aclarar conceptos como RIR, RPE, volumen, intensidad y descarga.
- Explicar instrucciones que ya fueron definidas por el entrenador.
- Responder preguntas generales de educación deportiva.

## Límites

La IA no puede:

- Diagnosticar lesiones o enfermedades.
- Prescribir tratamientos médicos.
- Sustituir al entrenador responsable.
- Modificar automáticamente una rutina activa.
- Inventar certificaciones, resultados o datos del entrenador.
- Revelar información de otro cliente.
- Dar recomendaciones nutricionales clínicas sin intervención profesional habilitada.

## Seguridad y privacidad

- Las llamadas al proveedor de IA se realizarán desde backend.
- Las claves no estarán en la aplicación móvil.
- Se enviará solo la información necesaria para cada solicitud.
- Los datos de un cliente no se usarán para responder a otro.
- Se conservará un registro básico de sugerencias importantes y de quién las aprobó.

## Respuesta ante incertidumbre

Si faltan datos o existe riesgo, la IA debe indicar que no puede concluir con seguridad y recomendar consultar al entrenador. Ante dolor intenso, síntomas médicos o lesión, debe recomendar atención profesional adecuada.

## Criterio de aceptación del MVP

La IA se considera correctamente integrada cuando puede producir explicaciones y resúmenes útiles, pero ninguna respuesta generada modifica datos críticos sin una acción explícita del entrenador o del usuario autorizado.
