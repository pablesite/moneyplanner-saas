<script setup lang="ts">
// `/people` y la pestaña Personas de `/data` gestionan lo mismo con los mismos
// componentes; aquí solo cambia el chrome de página. Mi Plan enlaza a esta ruta
// desde el paso de miembros, por eso se mantiene.
import '@/domains/aux-data/styles/aux-data.css';
import { FamilyMemberManager, OwnershipManager } from '@/domains/people';
import { APageHead } from '@/domains/ui';
</script>

<template>
  <div class="page a-aux-page">
    <APageHead title="Personas" />

    <FamilyMemberManager />
    <OwnershipManager />
  </div>
</template>
