<script setup lang="ts">
import { Get } from '@/services/requests';
import { useUserStore } from '@/stores/user';
import { useMatchStore } from '@/stores/match';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

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
  // Get('/auth/jwt-status').then(res => {
  //   loggedUser.value = res.data;

  // });
  getMatchHistory();
});
</script>

<template>
  <h2>Match history</h2>

  <h3>{{ userClick?.username }}</h3>
  <h3>{{ userClick?.id }}</h3>

  <div class="container">
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
            <td>{{ match.players[0].username }}</td>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 75%;
}
</style>
