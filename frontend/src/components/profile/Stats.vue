<script setup lang="ts">
const props = defineProps<{
  stats: number[];
}>();
</script>

<template>
  <h4>Stats</h4>
  <div class="stats">
    Played: {{ stats[0] }} Win: {{ stats[1] }} Lose: {{ stats[2] }} Ratio:
    {{ stats[3] }}%
  </div>
</template>

<style scoped></style>
