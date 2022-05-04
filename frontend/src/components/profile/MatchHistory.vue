<script setup lang="ts">
import { Get } from '@/services/requests';
import { useUserStore } from '@/stores/user';
import { useMatchStore } from '@/stores/match';
import { storeToRefs } from 'pinia';
import Stats from './Stats.vue';
import Ladder from './Ladder.vue';
import { onMounted } from 'vue';

const { loggedUser } = storeToRefs(useUserStore());
const { matches } = storeToRefs(useMatchStore());

async function getMatchHistory() {
  let response;
  try {
    response = await Get(`/users/${loggedUser.value?.id}/matches/played`);
    if (response.status === 200) {
      matches.value = response.data;
      console.log(matches);
    }
  } catch (error: any) {}
}

onMounted(() => {
  Get('/auth/jwt-status').then(res => {
    loggedUser.value = res.data;
    getMatchHistory();
  });
});
</script>

<template>
  <h2>Match history</h2>

  <h3>{{ loggedUser?.username }}</h3>
  <h3>{{ loggedUser?.id }}</h3>

  <div class="container">
    <div class="stats">
      <Stats />
      <Ladder />
    </div>
    <div class="history">
      <h4>History</h4>
      <table class="table table-dark table-bordered">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Player 1</th>
            <th scope="col">Player 2</th>
            <th scope="col">Score</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(match, index) in matches" :key="match.id">
            <th scope="row">{{ index + 1 }}</th>
            <td class="winner">{{ match.players[0].username }}</td>
            <td>{{ match.players[1].username }}</td>
            <td>{{ match.score[0] }} - {{ match.score[1] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 75%;
  justify-items: center;
}

.winner {
  font-style: bold;
}
</style>
