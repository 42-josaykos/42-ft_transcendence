<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Get, Post, Delete, Patch } from '@/services/requests';

import { storeToRefs } from 'pinia';
import { useMatchStore } from '@/stores/match';
import { useInputStore } from '@/stores/input';
import type { Match } from '@/models/match.model';

// Request url to API
const baseUrl = 'http://localhost:3000/matches';

// Single element
const match = ref<Match | null>(null);

// Stores
const matchStore = useMatchStore();
const { matches } = storeToRefs(matchStore);
const inputStore = useInputStore();
const { input } = storeToRefs(inputStore);

// CRUD functions
const getMatch = () => {
  Get(baseUrl + '?id=' + input.value.match_id).then(res => {
    if (res.status == 200) {
      match.value = res.data;
    }
    inputStore.$reset();
  });
};

const createMatch = () => {
  Post(baseUrl, {
    player1: input.value.p1,
    player2: input.value.p2,
    winner: +input.value.s1 > +input.value.s2 ? input.value.p1 : input.value.p2,
    score: [+input.value.s1, +input.value.s2]
  }).then(res => {
    if (res.status == 201) {
      matchStore.createMatch(res.data);
    }
    inputStore.$reset();
  });
};

const updateMatch = (data: Match | null) => {
  Patch(baseUrl + '/' + input.value.update_match_id, data).then(res => {
    if (res.status == 200) {
      matchStore.updateMatch(+input.value.update_match_id, res.data);
    }
    inputStore.$reset();
  });
};

const deleteMatch = (id: number) => {
  Delete(baseUrl + '/' + id.toString()).then(res => {
    if (res.status == 200) {
      matchStore.deleteMatch(id);
    }
  });
};

onMounted(() => {
  Get(baseUrl).then(res => (matches.value = res.data));
});
</script>

<template>
  <h3 class="title">Tests GET requests to backend API => MATCH</h3>

  <h4>Get by id</h4>
  <form @submit.prevent.trim.lazy="getMatch" method="GET">
    <label for="name">Id:</label>
    <input v-model="input.match_id" name="id" type="text" />
    <input type="submit" value="Submit" />
  </form>
  <p>{{ match }}</p>

  <h4>Create Match</h4>
  <form @submit.prevent.trim.lazy="createMatch" method="POST">
    <label for="name">Player1:</label>
    <input v-model="input.p1" name="name" type="text" />
    <label for="name">Player2:</label>
    <input v-model="input.p2" name="name" type="text" />
    <label for="name">Score1:</label>
    <input v-model="input.s1" name="name" type="text" />
    <label for="name">Score2:</label>
    <input v-model="input.s2" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

  <h4>Update Match</h4>
  <form
    @submit.prevent.trim.lazy="
      updateMatch(matchStore.getMatchUpdates(+input.update_match_id, input))
    "
    method="PATCH"
  >
    <label for="id">id:</label>
    <input v-model="input.update_match_id" name="id" type="text" />
    <label for="name">Player1:</label>
    <input v-model="input.update_p1" name="name" type="text" />
    <label for="name">Player2:</label>
    <input v-model="input.update_p2" name="name" type="text" />
    <label for="name">Score1:</label>
    <input v-model="input.update_s1" name="name" type="text" />
    <label for="name">Score2:</label>
    <input v-model="input.update_s2" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

  <h4>Get all - id, playerOne, playerTwo, winner, score</h4>
  <ul v-if="matches">
    <li v-for="item in matches" :key="item.id">
      Id: {{ item.id }}, Player1: {{ item.player1 }}, Player2:
      {{ item.player2 }}, Winner: {{ item.winner }}, Score: {{ item.score }}
      <button @click="deleteMatch(item.id)">delete</button>
    </li>
  </ul>
  <p v-else>Not Found</p>
</template>
