<script setup lang="ts">
import { RouterLink } from 'vue-router';
import APageHead from '@/domains/ui/components/APageHead.vue';
import ScoreGradeBadge from '@/domains/guide/components/ScoreGradeBadge.vue';
import { guidePhases, useGuideHomeState } from '@/domains/guide';

const phases = guidePhases;
const {
  isLoading,
  phaseState,
  phaseDetailTo,
  phaseDisplayProgress,
  mostTensePhase,
  strongestPhase,
} = useGuideHomeState('saas');
</script>

<template>
  <main class="page guide-home">
    <APageHead title="Estado financiero">
      <template #meta>
        <span>Mapa de 5 ámbitos</span><span class="dot"></span><span>Actualizado hoy</span>
      </template>
    </APageHead>

    <section class="sect guide-home-intro">
      <div class="guide-home-focus">
        <p class="eyebrow">Tu estado actual</p>
        <template v-if="mostTensePhase && !isLoading">
          <div class="guide-home-focus-line">
            <ScoreGradeBadge :score="mostTensePhase.score" />
            <span>Ámbito {{ mostTensePhase.phase.id }}</span>
          </div>
          <h2>{{ mostTensePhase.phase.title }}</h2>
          <p>{{ mostTensePhase.phase.focus }}</p>
        </template>
        <div v-else class="guide-skeleton guide-skeleton-focus" aria-label="Cargando foco"></div>
      </div>

      <div class="guide-home-kpis">
        <article class="guide-kpi">
          <span class="guide-kpi-label">Mayor tensión</span>
          <div v-if="isLoading" class="guide-skeleton guide-skeleton-value"></div>
          <template v-else-if="mostTensePhase">
            <strong class="mono">{{ mostTensePhase.score }}/100</strong>
            <span>A{{ mostTensePhase.phase.id }} · {{ mostTensePhase.grade }}</span>
          </template>
          <strong v-else>—</strong>
        </article>
        <article class="guide-kpi">
          <span class="guide-kpi-label">Mejor posicionada</span>
          <div v-if="isLoading" class="guide-skeleton guide-skeleton-value"></div>
          <template v-else-if="strongestPhase">
            <strong class="mono">{{ strongestPhase.score }}/100</strong>
            <span>A{{ strongestPhase.phase.id }} · {{ strongestPhase.grade }}</span>
          </template>
          <strong v-else>—</strong>
        </article>
      </div>
    </section>

    <section class="sect">
      <div class="sect-head">
        <div>
          <div class="sect-title-row">
            <h2 class="sect-title">Estado por ámbitos</h2>
            <span class="sect-count">5 áreas clave</span>
          </div>
          <p class="sect-sub">Abre un ámbito para revisar su puntuación y diagnóstico.</p>
        </div>
      </div>

      <ol class="guide-phase-strip">
        <li v-for="phase in phases" :key="phase.id">
          <RouterLink
            class="guide-phase-step"
            :class="{
              'is-active': !isLoading && phaseState(phase) === 'active',
              'is-done': !isLoading && phaseState(phase) === 'done',
              'is-loading': isLoading,
            }"
            :to="phaseDetailTo(phase.id)"
          >
            <div class="guide-phase-head">
              <span class="guide-phase-eyebrow">Ámbito {{ phase.id }}</span>
              <ScoreGradeBadge v-if="!isLoading" :score="phaseDisplayProgress(phase)" />
              <span v-else class="guide-skeleton guide-skeleton-badge"></span>
            </div>
            <strong class="guide-phase-label">{{ phase.title }}</strong>
            <span v-if="!isLoading" class="guide-phase-score mono">
              {{ phaseDisplayProgress(phase) }}/100
            </span>
            <span v-else class="guide-skeleton guide-skeleton-score"></span>
            <p>{{ phase.focus }}</p>
          </RouterLink>
        </li>
      </ol>
    </section>
  </main>
</template>
