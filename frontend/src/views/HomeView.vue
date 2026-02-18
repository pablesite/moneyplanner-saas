<script setup lang="ts">
type PhaseStatus = 'done' | 'active' | 'next';

type Phase = {
  id: number;
  title: string;
  focus: string;
  status: PhaseStatus;
};

const phases: Phase[] = [
  { id: 1, title: 'Estado inicial', focus: 'Foto real y deudas base', status: 'done' },
  { id: 2, title: 'Flujo de caja positivo', focus: 'Superavit mensual estable', status: 'active' },
  { id: 3, title: 'Fondo de emergencia', focus: 'Colchon de seguridad', status: 'next' },
  { id: 4, title: 'Mejorar patrimonio', focus: 'Balancear activo y pasivo', status: 'next' },
  { id: 5, title: 'Libertad financiera I', focus: 'Cubrir gastos corrientes', status: 'next' },
  { id: 6, title: 'Libertad financiera II', focus: 'Cubrir extras sin tension', status: 'next' },
  { id: 7, title: 'Libertad financiera III', focus: 'Cubrir gastos mobiliarios', status: 'next' },
  { id: 8, title: 'Libertad financiera IV', focus: 'Cubrir ahorro e inversion', status: 'next' },
];
</script>

<template>
  <div class="container">
    <section class="card ui-home-intro">
      <div class="ui-home-intro-text">
        <p class="ui-home-kicker">Inicio</p>
        <h1 class="h1 ui-home-title">Vas por buen camino: Fase 2 en progreso</h1>
        <p class="subtle ui-home-copy">
          Estas consolidando habitos de flujo positivo. El siguiente salto es construir un fondo de
          emergencia que te de tranquilidad.
        </p>
      </div>
      <div class="ui-home-intro-actions">
        <RouterLink to="/" class="btn btn-primary">Ir a Patrimonio</RouterLink>
        <RouterLink to="/account" class="btn">Revisar Cuenta</RouterLink>
      </div>
    </section>

    <section class="section grid-2">
      <article class="card">
        <h2 class="h2">Ruta por fases</h2>
        <p class="subtle ui-home-block-copy">
          Progreso guiado. Todo esta visible, pero te recomendamos priorizar segun tu momento.
        </p>
        <ol class="ui-home-phase-list">
          <li
            v-for="phase in phases"
            :key="phase.id"
            class="ui-home-phase-item"
            :class="{
              'ui-home-phase-done': phase.status === 'done',
              'ui-home-phase-active': phase.status === 'active',
            }"
          >
            <span class="ui-home-phase-id">F{{ phase.id }}</span>
            <div class="ui-home-phase-main">
              <div class="ui-home-phase-title">{{ phase.title }}</div>
              <div class="ui-home-phase-focus">{{ phase.focus }}</div>
            </div>
            <span class="badge">
              {{
                phase.status === 'done'
                  ? 'Completada'
                  : phase.status === 'active'
                    ? 'Actual'
                    : 'Siguiente'
              }}
            </span>
          </li>
        </ol>
      </article>

      <article class="card">
        <h2 class="h2">Siguiente mejor accion</h2>
        <p class="subtle ui-home-block-copy">
          Dedica 20 minutos hoy para revisar estos puntos y seguir avanzando sin saturarte.
        </p>
        <ul class="list">
          <li>Registrar todos los gastos variables de la semana.</li>
          <li>Confirmar que no hay nuevos pasivos sin categorizar.</li>
          <li>Definir objetivo de ahorro automatico para este mes.</li>
        </ul>
        <div class="ui-home-quick-links">
          <RouterLink to="/data" class="btn">Ajustar settings</RouterLink>
          <RouterLink to="/account" class="btn">Cuenta y seguridad</RouterLink>
        </div>
      </article>
    </section>
  </div>
</template>

<style scoped>
.ui-home-intro {
  display: grid;
  gap: 14px;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
}

.ui-home-kicker {
  margin: 0 0 6px;
  color: rgba(74, 222, 128, 0.9);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
}

.ui-home-title {
  margin-bottom: 8px;
}

.ui-home-copy {
  margin: 0;
}

.ui-home-intro-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ui-home-block-copy {
  margin-top: 0;
}

.ui-home-phase-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.ui-home-phase-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 10px;
}

.ui-home-phase-id {
  font-size: 12px;
  color: var(--muted);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  padding: 2px 8px;
}

.ui-home-phase-title {
  font-weight: 600;
  font-size: 14px;
}

.ui-home-phase-focus {
  font-size: 12px;
  color: var(--muted);
}

.ui-home-phase-done {
  border-color: rgba(34, 197, 94, 0.35);
}

.ui-home-phase-active {
  border-color: rgba(45, 212, 191, 0.65);
  background: rgba(45, 212, 191, 0.08);
}

.ui-home-quick-links {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 900px) {
  .ui-home-intro {
    grid-template-columns: 1fr;
  }
}
</style>
