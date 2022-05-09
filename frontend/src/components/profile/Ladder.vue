<script setup lang="ts">
import { Get } from '@/services/requests';
import { ref } from 'vue';

const players = ref();

async function getPlayersStats() {
  let response;
  try {
    response = await Get('/stats');
    if (response.status === 200) {
      players.value = response.data;
      console.log(players.value);
    }
  } catch (error: any) {}
}

function getLadder() {
  players.value = players.value.sort();
}

getPlayersStats();
</script>

<template>
  <h4>Ladder</h4>
  <table class="table table-dark table-bordered">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Player name</th>
        <th scope="col">Win rate</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(player, index) in players">
        <th scope="row">{{ index + 1 }}</th>
        <td>{{ player.user.username }}</td>
        <td>{{ player.ratio }} %</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped></style>
