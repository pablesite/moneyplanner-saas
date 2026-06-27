<script setup lang="ts">
import type { NavItem } from './appShellNav';

defineProps<{
  name: NavItem['iconKey'];
}>();
</script>

<template>
  <svg
    class="ui-shell-bottom-nav-icon"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'status'">
      <path d="M5 13a7 7 0 0 1 14 0" />
      <path d="M12 13l4-4" />
      <path d="M4 17h16" />
      <path d="M7 17l-2 3" />
      <path d="M17 17l2 3" />
    </template>
    <template v-else-if="name === 'wealth'">
      <path d="M4 8.5h16v10H4z" />
      <path d="M7 8.5V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2.5" />
      <path d="M16 13h4" />
      <path d="M8 14h4" />
    </template>
    <template v-else-if="name === 'budget'">
      <path d="M5 19V5" />
      <path d="M19 19H5" />
      <path d="M9 15v-4" />
      <path d="M13 15V8" />
      <path d="M17 15v-6" />
    </template>
    <template v-else-if="name === 'movements'">
      <path d="M7 7h10" />
      <path d="M7 12h10" />
      <path d="M7 17h6" />
      <path d="M4 7h.01" />
      <path d="M4 12h.01" />
      <path d="M4 17h.01" />
    </template>
    <template v-else>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4" />
      <path d="M16 3v4" />
      <path d="M4 10h16" />
      <path d="M9 15l2 2 4-5" />
    </template>
  </svg>
</template>
