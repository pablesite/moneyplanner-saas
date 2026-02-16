<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goToPeople() {
  router.push('/people');
}
</script>

<template>
  <button class="btn" type="button" @click="goToPeople">Personas</button>
</template>
