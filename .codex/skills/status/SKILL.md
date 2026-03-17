---
name: status
description: Show the current project status: implementation state, recent commits, pending tasks, and stack health. Use at the start of a session or when orienting on the project state.
---

# Status

Da un resumen rápido del estado actual del proyecto para orientarse antes de trabajar.

## Workflow

Ejecuta los siguientes pasos en orden:

### 1. Estado de implementación
Lee `docs/project-status.md` y muestra un resumen de las funcionalidades con estado 🔄 (en progreso) y ⚪ (pendientes prioritarias), ignorando las ✅ salvo que sean relevantes.

### 2. Actividad reciente
```bash
git log --oneline -10
git status --short
```
Muestra los últimos 10 commits y los archivos modificados sin commit.

### 3. Versiones actuales
```bash
cat VERSION
cat core/VERSION
```

### 4. Estado de los contenedores
```bash
docker compose ps
```
Indica si los stacks están corriendo o no.

### 5. Orientación
Basándote en todo lo anterior, sugiere en 2-3 líneas en qué área tiene más sentido trabajar a continuación según el roadmap (`docs/roadmap/roadmap.md`).

## Output esperado

Respuesta concisa estructurada en: Estado · Reciente · Versiones · Contenedores · Sugerencia.