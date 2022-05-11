<script setup lang="ts">
import { ref } from 'vue';

let stats = ref([7,7,7,7])

</script>

<template>
  <h4>
    <b><u>Stats</u></b>
  </h4>
  <table class="stat_table">
    <tr>
      <th>Game Played</th>
      <td>{{ stats[0] }}</td>

    </tr>
    <tr>
      <th>Game Win</th>
      <td>{{ stats[1] }}</td>
    </tr>
    <tr>
      <th>Game Lose</th>
      <td>{{ stats[2] }}</td>
    </tr>
    <tr>
      <th>Winrate</th>
      <td>{{ stats[3] }}%</td>
    </tr>
  </table>
</template>

<style scoped>

.stat_table{
  width: 100%;
  border-spacing: 15px;
  border-collapse: separate;
}

.stat_table th{
  text-align: left;
}

</style>
