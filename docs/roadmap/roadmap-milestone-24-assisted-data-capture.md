# Milestone 24 Roadmap: Asistente para captura de datos

## Objetivo
Disenar y entregar un `Asistente para captura de datos` que ayude al usuario a completar rapidamente una base minima util para:
1. Balance patrimonial (`Patrimonio`)
2. Balance anual (`Ingresos` / `Gastos`)

## Problema que resuelve
1. La app ofrece mucho valor cuando hay datos, pero el primer arranque puede sentirse vacio o exigente.
2. Muchos usuarios no saben:
   - que datos son importantes
   - en que orden introducirlos
   - que cosas pequeñas/medias conviene registrar
3. El objetivo no es capturar todo de forma perfecta, sino alcanzar una base suficiente y refinable.

## Intencion de producto
1. Guiar al usuario con preguntas simples y concretas en lugar de mostrar formularios vacios.
2. Priorizar decisiones con impacto alto en el diagnostico:
   - vivienda
   - vehiculo
   - deudas
   - ingresos recurrentes
   - gastos estructurales
3. Permitir una primera configuracion rapida (valor temprano) y refinamiento posterior.

## Resultado esperado (v1)
1. Al abrir la app por primera vez (o cuando falten datos criticos), se ofrece un asistente guiado.
2. El asistente hace preguntas de cribado y crea/propone registros base.
3. El usuario termina con datos suficientes para empezar a ver:
   - patrimonio neto aproximado
   - ingresos/gastos anuales base
   - primeros indicadores de calidad de dato

## Alcance (primera aproximacion)
### 1) Deteccion de estado inicial
1. Detectar si el usuario tiene datos minimos ya cargados.
2. Mostrar el asistente cuando:
   - es primera visita
   - o faltan bloques criticos (sin ingresos, sin gastos, sin activos, sin pasivos)
3. Permitir omitir el asistente y volver despues.

### 2) Flujo guiado de preguntas (screening)
Preguntas orientativas v1:
1. `Vivienda`:
   - Tienes vivienda en propiedad o en alquiler?
   - Si en propiedad, hay hipoteca?
2. `Vehiculo`:
   - Tienes vehiculo propio?
   - Si si, esta financiado?
3. `Activos de valor medio`:
   - Tienes activos de mas de 300 EUR (movil, portatil, bici, joyas, etc.)?
4. `Ingresos`:
   - Tienes un ingreso principal recurrente?
   - Convives con otra persona que aporte ingresos?
5. `Gastos base`:
   - Pagas alquiler/hipoteca?
   - Gastos habituales de alimentacion, transporte, suministros?
6. `Deudas`:
   - Tienes prestamos personales, tarjeta aplazada u otras deudas?

### 3) Captura guiada (propuesta de datos)
1. Cada respuesta puede:
   - crear registros base automaticamente
   - abrir un mini-formulario precompletado
   - dejar una tarea sugerida para completar despues
2. Ejemplos:
   - Si indica vivienda en propiedad + hipoteca -> proponer alta de activo inmobiliario + pasivo hipoteca
   - Si indica vehiculo financiado -> proponer activo vehiculo + pasivo asociado
   - Si indica movil/portatil >300 -> proponer activos mobiliarios simples

### 4) Refinamiento progresivo
1. El asistente no exige precision total en el primer paso.
2. Campos opcionales pueden quedar pendientes:
   - fecha exacta
   - TAE exacta
   - comisiones
   - valor de compra exacto
3. Se guarda un estado de `pendiente de completar` para sugerencias futuras.

## Principios UX del asistente
1. Preguntas cortas y lenguaje cotidiano.
2. Una decision por pantalla (o maximo 2 relacionadas).
3. Ejemplos concretos para activar memoria del usuario.
4. Respuestas por opciones primero; texto libre despues.
5. Progreso visible (por ejemplo `Paso 3 de 8`).
6. Posibilidad de saltar una pregunta (`No lo se ahora` / `Luego`).

## Propuesta de arquitectura funcional (v1)
### A. Motor de preguntas (reglas)
1. Preguntas declarativas con:
   - `id`
   - `texto`
   - `tipo` (opciones, booleano, importe, texto)
   - `condiciones de visibilidad`
   - `impacto esperado` (activos, pasivos, ingresos, gastos)
2. Reglas simples de ramificacion:
   - si `vivienda = propiedad` -> preguntar hipoteca
   - si `hipoteca = si` -> pedir datos minimos del pasivo

### B. Motor de propuestas (drafts)
1. Generar borradores de:
   - activo
   - pasivo
   - ingreso anual
   - gasto anual
2. Antes de guardar:
   - mostrar resumen de lo que se va a crear
   - permitir editar o descartar cada propuesta

### C. Integracion con modulos existentes
1. Reutilizar contratos y formularios de `Introduccion de datos` cuando sea posible.
2. Evitar duplicar logica de validacion.
3. Marcar registros creados por asistente (metadata) si aporta trazabilidad.

## Casos de uso prioritarios (v1)
1. Usuario con trabajo asalariado + alquiler + gastos basicos.
2. Usuario con vivienda en propiedad + hipoteca.
3. Usuario con vehiculo y prestamo personal.
4. Usuario con pocos datos y activos mobiliarios de valor medio (>300 EUR).

## Sugerencias inteligentes (v1.5 / evolutivo)
1. Autocompletado por categoria (defaults razonables).
2. Sugerencias por nombre/similitud:
   - ejemplo: `Iphone` (pasivo) -> sugerir `Iphone Pro 16` como activo financiado
3. Sugerencias por combinacion de respuestas:
   - vivienda en propiedad + deuda -> sugerir `hipoteca` antes que `prestamo personal`
4. Confirmacion explicita del usuario antes de aplicar inferencias.

## Fuera de alcance (primera iteracion)
1. Asistente conversacional libre (chat completo).
2. OCR / importaciones automaticas.
3. Scoring final del usuario durante onboarding.
4. Recomendaciones financieras personalizadas complejas.

## Criterios de aceptacion (primera aproximacion)
1. El usuario puede completar un flujo inicial guiado y generar una base minima de datos util.
2. El asistente cubre al menos activos/pasivos/ingresos/gastos basicos.
3. El usuario puede saltar preguntas y volver mas tarde.
4. Los datos creados por el asistente son editables desde `Introduccion de datos`.
5. El asistente mejora la completitud inicial sin bloquear el uso normal de la app.

## Riesgos y mitigaciones
1. Riesgo: demasiadas preguntas -> abandono.
   - Mitigacion: flujo corto v1 + refinamiento progresivo.
2. Riesgo: inferencias incorrectas.
   - Mitigacion: propuestas con confirmacion, no autoguardado silencioso.
3. Riesgo: duplicar formularios y validaciones.
   - Mitigacion: reutilizar componentes/servicios existentes.

## Decisiones abiertas
1. Ubicacion del asistente:
   - modal al primer acceso
   - vista dedicada
   - banner CTA en `Introduccion de datos`
2. Persistencia del progreso:
   - local (frontend)
   - backend (por usuario)
3. Nivel de granularidad v1:
   - solo screening + propuestas
   - o mini-formularios embebidos en cada paso

## Entregables esperados
1. Documento de detalle del hito (este archivo).
2. Flujo UX v1 del asistente (wireframe o implementacion inicial).
3. Motor de preguntas/propuestas v1.
4. Integracion con `Introduccion de datos`.
