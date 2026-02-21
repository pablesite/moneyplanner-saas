<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { getActiveGuidePhase, guidePhases, type GuidePhase } from '@/domains/guide/phases';

const phases = guidePhases;
const activePhase = computed(() => getActiveGuidePhase());
const completedPhases = computed(() => phases.filter((phase) => phase.progress >= 100).length);

function phaseState(phase: GuidePhase): 'done' | 'active' | 'next' {
  if (phase.progress >= 100) return 'done';
  if (phase.id === activePhase.value.id) return 'active';
  return 'next';
}

function phaseStateLabel(phase: GuidePhase): string {
  const state = phaseState(phase);
  if (state === 'done') return 'Completada';
  if (state === 'active') return 'Actual';
  return 'Pendiente';
}

function phaseDetailTo(phaseId: number): string {
  return `/guia/fases/${phaseId}`;
}
</script>

<template>
  <div class="container ui-pro-page">
    <section class="card ui-pro-panel ui-home-intro">
      <div class="ui-home-intro-text">
        <p class="ui-pro-kicker">Guia financiera</p>
        <h1 class="h1 ui-home-title">
          Ruta activa: Fase {{ activePhase.id }} - {{ activePhase.title }}
        </h1>
        <p class="subtle ui-home-copy">
          Hoja de ruta por fases para avanzar sin perder el foco. Entra en cada fase para ver
          diagnostico, contexto y siguientes acciones.
        </p>
      </div>
      <div class="ui-home-intro-kpis">
        <div class="ui-home-intro-kpi">
          <span>Fases completadas</span>
          <strong>{{ completedPhases }}/{{ phases.length }}</strong>
        </div>
        <div class="ui-home-intro-kpi">
          <span>Progreso fase activa</span>
          <strong>{{ activePhase.progress }}%</strong>
        </div>
      </div>
    </section>

    <article class="section card ui-pro-panel">
      <h2 class="h2">Ruta por fases</h2>
      <p class="subtle ui-home-block-copy">
        Selecciona una fase para abrir su vista de detalle y revisar el diagnostico asociado.
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
          <RouterLink class="ui-home-phase-link" :to="phaseDetailTo(phase.id)">
            <div class="ui-home-phase-head">
              <span class="ui-home-phase-id">F{{ phase.id }}</span>
              <span class="badge">{{ phaseStateLabel(phase) }}</span>
            </div>

            <div class="ui-home-phase-title">{{ phase.title }}</div>
            <div class="ui-home-phase-focus">{{ phase.focus }}</div>

            <div class="ui-home-phase-donut" :style="{ '--phase-progress': `${phase.progress}%` }">
              <div class="ui-home-phase-donut-inner">{{ phase.progress }}%</div>
            </div>

            <div class="ui-home-phase-cta">Ver detalle de fase</div>
          </RouterLink>
        </li>
      </ol>
    </article>
  </div>
</template>

<style scoped>
.ui-home-intro {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 14px;
  align-items: end;
}

.ui-home-intro-kpis {
  display: grid;
  gap: 8px;
  min-width: 220px;
}

.ui-home-intro-kpi {
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.03);
  display: grid;
  gap: 3px;
}

.ui-home-intro-kpi span {
  font-size: 12px;
  color: var(--muted);
}

.ui-home-intro-kpi strong {
  font-size: 21px;
}

.ui-home-phase-link {
  color: inherit;
  text-decoration: none;
  display: grid;
  gap: 8px;
  height: 100%;
}

.ui-home-phase-cta {
  margin-top: auto;
  font-size: 12px;
  font-weight: 600;
  color: rgba(45, 212, 191, 0.95);
}

@media (max-width: 860px) {
  .ui-home-intro {
    grid-template-columns: 1fr;
  }

  .ui-home-intro-kpis {
    min-width: 0;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
