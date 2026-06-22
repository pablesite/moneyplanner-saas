<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { FamilyMemberManager, OwnershipManager } from '@/domains/people';
import { AButton, APageHead } from '@/domains/ui';

const router = useRouter();
type Tab = 'members' | 'ownerships';
const tab = ref<Tab>('members');
</script>

<template>
  <div class="container ui-page-shell">
    <APageHead title="Personas">
      <template #actions>
        <AButton @click="router.push('/account')">Cuenta</AButton>
        <AButton @click="router.push('/patrimonio')"> Volver a Patrimonio </AButton>
      </template>
    </APageHead>

    <div class="card ui-section-card mt-1">
      <div class="mb-3.5 flex gap-2.5">
        <AButton
          class="opacity-60"
          :class="{ '!opacity-100': tab === 'members' }"
          @click="tab = 'members'"
        >
          Miembros
        </AButton>

        <AButton
          class="opacity-60"
          :class="{ '!opacity-100': tab === 'ownerships' }"
          @click="tab = 'ownerships'"
        >
          Titularidades
        </AButton>
      </div>

      <div class="grid gap-3.5">
        <FamilyMemberManager v-if="tab === 'members'" />
        <OwnershipManager v-else />
      </div>
    </div>
  </div>
</template>
