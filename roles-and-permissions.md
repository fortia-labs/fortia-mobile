# Roles y permisos iniciales

## Roles

### Cliente

Puede:

- Gestionar su perfil y objetivos.
- Explorar entrenadores publicados y verificados.
- Solicitar una relación de coaching.
- Ver su programa asignado.
- Registrar entrenamientos y check-ins.
- Consultar al asistente educativo de IA.

No puede:

- Ver datos de otros clientes.
- Editar la programación creada por el entrenador.
- Ver documentos privados de verificación.
- Aprobar cambios de programación de otros usuarios.

### Entrenador

Puede:

- Gestionar su perfil profesional.
- Enviar documentación para verificación.
- Ver únicamente clientes con relación autorizada.
- Crear y modificar programas de sus clientes.
- Consultar registros, progresos y check-ins de sus clientes.
- Usar funciones de IA como apoyo para análisis y borradores.

No puede:

- Ver clientes de otros entrenadores.
- Aprobar su propia verificación.
- Acceder a credenciales privadas de otro entrenador.
- Ejecutar acciones administrativas.

### Administrador

Puede:

- Revisar y resolver solicitudes de verificación.
- Publicar, pausar o suspender perfiles.
- Atender incidencias y solicitudes de soporte.
- Consultar registros de auditoría necesarios para la operación.

Debe existir un registro de quién realizó cada acción administrativa.

## Reglas de acceso

- El usuario autenticado solo puede modificar su propio perfil.
- El cliente accede únicamente a programas y registros asociados a su `client_id`.
- El entrenador accede únicamente a datos de clientes vinculados mediante una relación `active`.
- La información de verificación es privada y solo accesible por el entrenador propietario y administradores autorizados.
- Las claves de IA y otros secretos nunca se almacenan en el cliente móvil.
- Las funciones administrativas deben ejecutarse en backend y quedar auditadas.

## Estados de una relación de coaching

```text
requested → active → paused → ended
             ↓
          rejected
```

Solo una relación `active` permite al entrenador consultar y modificar el programa del cliente.
