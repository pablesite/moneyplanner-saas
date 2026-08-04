<script setup lang="ts">
defineProps<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
}>();
</script>

<template>
  <header class="sect-head">
    <div>
      <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
      <div class="sect-title-row">
        <h2 class="sect-title">{{ title }}</h2>
        <slot name="hint" />
      </div>
      <!-- El subtítulo es texto plano en la mayoría de secciones, pero algunas
           necesitan énfasis o partes condicionales; el slot evita que esas se
           queden fuera de la primitiva y vuelvan a montar el head a mano. -->
      <p v-if="$slots.subtitle" class="sect-sub"><slot name="subtitle" /></p>
      <p v-else-if="subtitle" class="sect-sub">{{ subtitle }}</p>
    </div>
    <div v-if="$slots.actions" class="actions">
      <slot name="actions" />
    </div>
  </header>
</template>
