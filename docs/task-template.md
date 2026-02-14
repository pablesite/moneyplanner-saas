# Plantilla de Tarea (Sesión Nueva)

## Objetivo
Describe una sola meta concreta y medible.

Ejemplo:
- Definir el contrato API inicial del módulo Presupuesto en `core`.

## Contexto mínimo
1. Rama actual: `<rama>`
2. Estado breve: `<en qué punto estás>`
3. Documento guía (si aplica): `<ruta .md>`

## Alcance
### Sí
- `<carpetas/archivos/servicios que sí se tocan>`

### No
- `<carpetas/archivos/servicios que no se tocan>`

## Definición de terminado
1. `<resultado verificable 1>`
2. `<resultado verificable 2>`
3. `<resultado verificable 3>`

## Validación esperada
1. Comandos de diagnóstico mínimos:
- `docker compose ps`
- `docker compose logs --tail 100 <servicio>`

2. Validación funcional específica:
- `<curl, endpoint, test manual, etc.>`

## Restricciones
1. No borrar volúmenes DB.
2. No usar `docker compose down -v` salvo autorización explícita.
3. Mantener límites `core` vs `saas` según `docs/architecture.md`.

## Forma de trabajo
1. Diagnóstico primero.
2. Explicar opciones y tradeoffs.
3. Preguntar decisiones clave si hay ambigüedad.
4. Implementar cambios acordados.
5. Validar y reportar estado final.

## Preguntas abiertas (opcional)
1. `<pregunta 1>`
2. `<pregunta 2>`

---

## Prompt rápido (copiar/pegar)
```txt
Proyecto: moneyplanner.
Rama: <rama>.
Objetivo de esta sesión: <objetivo único>.

Alcance:
- Sí: <qué sí>
- No: <qué no>

Definición de terminado:
1) <resultado 1>
2) <resultado 2>
3) <cómo validar>

Documento de referencia principal: <ruta .md>.

Forma de trabajo:
- Diagnóstico primero.
- Luego propuestas con tradeoffs.
- Preguntas si hay decisiones.
- Después implementas y validas.
- No borrar volúmenes DB.
```
