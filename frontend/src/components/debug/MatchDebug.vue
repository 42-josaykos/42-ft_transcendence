<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Get, Post, Delete, Patch } from '@/services/requests';

import { storeToRefs } from 'pinia';
import { useMatchStore } from '@/stores/match';
import type { Match } from '@/models/match.model';
import type { Input, InputStore } from '@/stores/input';

// Props
const props = defineProps<{
  title: string;
  inputStore: InputStore;
  input: Input;
}>();

// Request url to API
const baseUrl = 'http://localhost:3000/matches';

// Single element
const match = ref<Match | null>(null);

// Stores
const matchStore = useMatchStore();
const { matches } = storeToRefs(matchStore);

// CRUD functions
const getMatch = () => {
  Get(baseUrl + '?id=' + props.input.match_id).then(res => {
    if (res.status == 200) {
      match.value = res.data;
    }
    props.inputStore.$reset();
  });
};

const createMatch = () => {
  Post(baseUrl, {
    player1: props.input.p1,
    player2: props.input.p2,
    winner: +props.input.s1 > +props.input.s2 ? props.input.p1 : props.input.p2,
    score: [+props.input.s1, +props.input.s2]
  }).then(res => {
    if (res.status == 201) {
      matchStore.createMatch(res.data);
    }
    props.inputStore.$reset();
  });
};

const updateMatch = (data: Match | null) => {
  Patch(baseUrl + '/' + props.input.update_match_id, data).then(res => {
    if (res.status == 200) {
      matchStore.updateMatch(res.data.id, res.data);
    }
    props.inputStore.$reset();
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
  <h3 class="title">{{ title }}</h3>

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
    @submit.prevent.trim.lazy="updateMatch(matchStore.getMatchUpdates(input))"
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
