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

onMounted(() => {
  Get(baseUrl).then(res => (matches.value = res.data));
});
</script>

<template>
  <h3 class="title">Tests GET requests to backend API => MATCH</h3>

  <h4>Get by id</h4>
  <form
    @submit.prevent.trim.lazy="
      Get(baseUrl + '?id=' + input.match_id).then(res => {
        if (res.status == 200) {
          match = res.data;
        }
        inputStore.$reset();
      })
    "
    method="GET"
  >
    <label for="name">Id:</label>
    <input v-model="input.match_id" name="id" type="text" />
    <input type="submit" value="Submit" />
  </form>
  <p>{{ match }}</p>

  <h4>Create Match</h4>
  <form
    @submit.prevent.trim.lazy="
      Post(baseUrl, {
        player1: input.p1,
        player2: input.p2,
        winner: +input.s1 > +input.s2 ? input.p1 : input.p2,
        score: [+input.s1, +input.s2]
      }).then(res => {
        if (res.status == 201) {
          matchStore.createMatch(res.data);
        }
        inputStore.$reset();
      })
    "
    method="POST"
  >
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
      Patch(
        baseUrl + '/' + input.update_match_id,
        matchStore.getMatchUpdates(+input.update_match_id, input)
      ).then(res => {
        if (res.status == 200) {
          matchStore.updateMatch(+input.update_match_id, res.data);
        }
        inputStore.$reset();
      })
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
      <button
        @click="
          Delete(baseUrl + '/' + item.id.toString()).then(res => {
            if (res.status == 200) {
              matchStore.deleteMatch(item.id);
            }
          })
        "
      >
        delete
      </button>
    </li>
  </ul>
  <p v-else>Not Found</p>
</template>
