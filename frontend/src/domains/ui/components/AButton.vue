<script setup lang="ts">
// Primitiva de botón Direction A. Envuelve las clases compartidas
// `.btn / .btn-primary / .btn-ghost / .btn-icon` para garantizar consistencia
// y eliminar los <button> crudos repartidos por las vistas.
withDefaults(
  defineProps<{
    variant?: 'default' | 'primary' | 'ghost' | 'icon';
    size?: 'md' | 'sm';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    loading?: boolean;
    block?: boolean;
  }>(),
  {
    variant: 'default',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    block: false,
  },
);
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="[
      variant !== 'default' ? `btn-${variant}` : '',
      size === 'sm' ? 'btn-sm' : '',
      { 'btn-block': block, 'is-loading': loading },
    ]"
    :disabled="disabled || loading"
    :aria-busy="loading ? 'true' : undefined"
  >
    <span v-if="loading" class="btn-spinner" aria-hidden="true" />
    <slot />
  </button>
</template>
