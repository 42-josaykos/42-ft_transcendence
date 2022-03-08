<script setup lang="ts">
import MatchDebug from './MatchDebug.vue';
import UserDebug from './UserDebug.vue';

import { storeToRefs } from 'pinia';
import { useInputStore } from '@/stores/input';

// Inputs
const inputStore = useInputStore();
const { input } = storeToRefs(inputStore);
</script>

<template>
  <h2 class="debug">Debug</h2>
  <UserDebug
    title="Tests GET requests to backend API => USER"
    :inputStore="inputStore"
    :input="input"
  />
  <MatchDebug
    title="Tests GET requests to backend API => MATCH"
    :inputStore="inputStore"
    :input="input"
  />
</template>

<style>
.debug {
  color: red;
}
.title {
  color: blue;
}
</style>
