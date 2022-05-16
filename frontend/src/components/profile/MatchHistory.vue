<script setup lang="ts">
import { Get } from '@/services/requests';
import { useUserStore } from '@/stores/user';
import { useMatchStore } from '@/stores/match';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';

const { userClick } = storeToRefs(useUserStore());
const { matches } = storeToRefs(useMatchStore());

async function getMatchHistory() {
  let response;
  try {
    response = await Get(`/users/${userClick.value?.id}/matches/played`);
    if (response.status === 200) {
      matches.value = response.data.reverse();
    }
  } catch (error: any) {}
}

onMounted(() => {
  getMatchHistory();
});
</script>

<template>
  <h3>{{ userClick?.username }}</h3>
  <h3>{{ userClick?.id }}</h3>

  <div class="container">
    <div class="history">
      <table class="table table-dark table-bordered">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Player 1</th>
            <th scope="col">Player 2</th>
            <th scope="col">Score</th>
            <th scope="col">Win / Lose</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(match, index) in matches" :key="match.id">
            <th scope="row">{{ index + 1 }}</th>
            <td>
              <a
                href="#"
                @click="
                  userClick = match.players[0];
                  getMatchHistory();
                "
                >{{ match.players[0].username }}</a
              >
            </td>
            <td>
              <a
                href="#"
                @click="
                  userClick = match.players[1];
                  getMatchHistory();
                "
                >{{ match.players[1].username }}</a
              >
            </td>
            <td>{{ match.score[0] }} - {{ match.score[1] }}</td>
            <td v-if="match.winner.id === userClick?.id">Win</td>
            <td v-else>Lose</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 75%;
}
</style>
