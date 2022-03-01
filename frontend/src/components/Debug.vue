<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Get, Post, Delete, Patch } from '@/services/requests';

import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useMatchStore } from '@/stores/match';
import { useInputStore } from '@/stores/input';
import type { User } from '@/models/user.model';
import type { Match } from '@/models/match.model';

// Request url to API
const user_url = 'http://localhost:3000/users';
const match_url = 'http://localhost:3000/matches';

// Single user
const user = ref<User | null>(null);

// List of all users
const userStore = useUserStore();
const { users } = storeToRefs(userStore);

// Single match
const match = ref<Match | null>(null);

// List of all matches
const matchStore = useMatchStore();
const { matches } = storeToRefs(matchStore);

// Track forms inputs
const inputStore = useInputStore();
const { input } = storeToRefs(inputStore);

onMounted(() => {
  Get(user_url).then(res => (users.value = res.data));
  Get(match_url).then(res => (matches.value = res.data));
});
</script>

<template>
  <h2 class="debug">Debug</h2>
  <h3 class="title">Tests GET requests to backend API => USER</h3>

  <h4>Get by name</h4>
  <form
    @submit.prevent.trim.lazy="
      Get(user_url + '?username=' + input.search).then(res => {
        if (res.status == 200) {
          user = res.data[0];
        }
        inputStore.$reset();
      })
    "
    method="GET"
  >
    <label for="name">Username:</label>
    <input v-model="input.search" name="username" type="text" />
    <input type="submit" value="Submit" />
  </form>
  <p>{{ user }}</p>

  <h4>Create User</h4>
  <form
    @submit.prevent.trim.lazy="
      Post(user_url, { username: input.create }).then(res => {
        if (res.status == 201) {
          userStore.createUser(res.data);
        }
        inputStore.$reset();
      })
    "
    method="POST"
  >
    <label for="name">Username:</label>
    <input v-model="input.create" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

  <h4>Update User</h4>
  <form
    @submit.prevent.trim.lazy="
      Patch(user_url + '/' + input.user_id, {
        username: input.update_username
      }).then(res => {
        if (res.status == 200) {
          userStore.updateUser(+input.user_id, {
            username: input.update_username
          });
        }
        inputStore.$reset();
      })
    "
    method="PATCH"
  >
    <label for="id">id:</label>
    <input v-model="input.user_id" name="id" type="text" />
    <label for="name">new username:</label>
    <input v-model="input.update_username" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

  <h4>Get all - id, name</h4>
  <ul v-if="users">
    <li v-for="item in users" :key="item.id">
      Id: {{ item.id }}, Username: {{ item.username }}
      <button
        @click="
          Delete(user_url + '/' + item.id.toString()).then(res => {
            if (res.status == 200) {
              userStore.deleteUser(item.id);
            }
          })
        "
      >
        delete
      </button>
    </li>
  </ul>
  <p v-else>Not Found</p>

  <h3 class="title">Tests GET requests to backend API => MATCH</h3>

  <h4>Get by id</h4>
  <form
    @submit.prevent.trim.lazy="
      Get(match_url + '?id=' + input.match_id).then(res => {
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
      Post(match_url, {
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
        match_url + '/' + input.update_match_id,
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
          Delete(match_url + '/' + item.id.toString()).then(res => {
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

<style>
.debug {
  color: red;
}
.title {
  color: blue;
}
</style>
*/
