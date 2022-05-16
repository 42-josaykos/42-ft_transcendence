<script setup lang="ts">
import { ref } from 'vue';
import { Get } from '@/services/requests';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const { userClick } = storeToRefs(useUserStore());
const stats = ref([7, 7, 7, 7]);

async function getSingleStats() {
  let response;
  try {
    response = await Get(`/users/${userClick.value?.id}/stats`);
    if (response.status === 200) {
      stats.value[0] = response.data.played;
      stats.value[1] = response.data.win;
      stats.value[2] = response.data.lose;
      stats.value[3] = response.data.ratio * 100;
    }
  } catch (error: any) {}
}

onMounted(() => {
  getSingleStats();
});
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
      <td>{{ stats[3].toFixed(2) }}%</td>
    </tr>
  </table>
</template>

<style scoped>
.stat_table {
  width: 100%;
  border-spacing: 15px;
  border-collapse: separate;
}

.stat_table th {
  text-align: left;
}
</style>
