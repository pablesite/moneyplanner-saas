<script setup lang="ts">
type Phase = {
  id: number;
  title: string;
  focus: string;
  progress: number;
};

const phases: Phase[] = [
  { id: 1, title: 'Estado inicial', focus: 'Foto real y deudas base', progress: 100 },
  { id: 2, title: 'Flujo de caja positivo', focus: 'Superavit mensual estable', progress: 68 },
  { id: 3, title: 'Fondo de emergencia', focus: 'Colchon de seguridad', progress: 35 },
  { id: 4, title: 'Mejorar patrimonio', focus: 'Balancear activo y pasivo', progress: 18 },
  {
    id: 5,
    title: 'Independencia financiera',
    focus: 'Ingresos cubren tu estilo de vida',
    progress: 6,
  },
];

const fallbackPhase: Phase = phases[phases.length - 1] ?? {
  id: 5,
  title: 'Independencia financiera',
  focus: 'Ingresos cubren tu estilo de vida',
  progress: 0,
};

const activePhase = phases.find((phase) => phase.progress < 100) ?? fallbackPhase;

function phaseState(phase: Phase): 'done' | 'active' | 'next' {
  if (phase.progress >= 100) return 'done';
  if (phase.id === activePhase.id) return 'active';
  return 'next';
}

function phaseStateLabel(phase: Phase): string {
  const state = phaseState(phase);
  if (state === 'done') return 'Completada';
  if (state === 'active') return 'Actual';
  return 'Siguiente';
}
</script>

<template>
  <div class="container ui-pro-page">
    <section class="card ui-pro-panel ui-home-intro">
      <div class="ui-home-intro-text">
        <p class="ui-pro-kicker">Inicio</p>
        <h1 class="h1 ui-home-title">Vas por buen camino: Fase {{ activePhase.id }} en progreso</h1>
        <p class="subtle ui-home-copy">
          Estas consolidando habitos de flujo positivo. El siguiente salto es construir un fondo de
          emergencia que te de tranquilidad.
        </p>
      </div>
    </section>

    <article class="section card ui-pro-panel">
      <h2 class="h2">Ruta por fases</h2>
      <p class="subtle ui-home-block-copy">
        Recorrido de izquierda a derecha para visualizar tu avance total.
      </p>

      <ol class="ui-home-phase-row">
        <li
          v-for="phase in phases"
          :key="phase.id"
          class="ui-home-phase-card"
          :class="{
            'ui-home-phase-done': phaseState(phase) === 'done',
            'ui-home-phase-active': phaseState(phase) === 'active',
          }"
        >
          <div class="ui-home-phase-head">
            <span class="ui-home-phase-id">F{{ phase.id }}</span>
            <span class="badge">{{ phaseStateLabel(phase) }}</span>
          </div>

          <div class="ui-home-phase-title">{{ phase.title }}</div>
          <div class="ui-home-phase-focus">{{ phase.focus }}</div>

          <div class="ui-home-phase-donut" :style="{ '--phase-progress': `${phase.progress}%` }">
            <div class="ui-home-phase-donut-inner">{{ phase.progress }}%</div>
          </div>
        </li>
      </ol>
    </article>

    <article class="card ui-pro-panel">
      <h2 class="h2">Siguiente mejor accion</h2>
      <p class="subtle ui-home-block-copy">
        Dedica 20 minutos hoy para revisar estos puntos y seguir avanzando sin saturarte.
      </p>
      <ul class="list">
        <li>Registrar todos los gastos variables de la semana.</li>
        <li>Confirmar que no hay nuevos pasivos sin categorizar.</li>
        <li>Definir objetivo de ahorro automatico para este mes.</li>
      </ul>
    </article>
  </div>
</template>
