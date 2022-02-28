<script setup lang="ts">
import { onMounted, ref, computed, onBeforeMount } from 'vue';
import {
  getAllUsers,
  getUserByUsername,
  createUser,
  updateUser,
  deleteUser
} from '../requests/userRequests';
import {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
} from '../requests/matchRequests';

import { useUserStore } from '@/stores/user';

// Request url to API
const url = 'http://localhost:3000/users';
const urlMatch = 'http://localhost:3000/matches';

// List of all users
const userState = useUserStore();
const dataUsers: any = ref(null);

// Single user
const user: any = ref({});

// Track forms input dataUsers
const search_input = ref<string>('');
const create_input = ref<string>('');
const update_input = ref<string>('');
const update_id = ref<any>(null);

// List of all Matches
const dataMatches: any = ref(null);

// Single user
const match: any = ref({});

// Track forms input dataMatches
const id_input = ref<string>('');
const p1_input = ref<string>('');
const p2_input = ref<string>('');
const s1_input = ref<string>('');
const s2_input = ref<string>('');
const update_id_match = ref<any>(null);
const update_p1 = ref<string>('');
const update_p2 = ref<string>('');
const update_s1 = ref<string>('');
const update_s2 = ref<string>('');

function filteredDataMatch(id: string) {
  dataMatches.value = dataMatches.value.filter((t: any) => t.id !== id);
  return dataMatches.value;
}

onMounted(() => {
  getAllUsers(url).then(data => (userState.users = data));
  getAllMatches(urlMatch, dataMatches);
});
</script>

<template>
  <h2 class="debug">Debug</h2>
  <h3 class="title">Tests GET requests to backend API => USER</h3>

  <h4>Get by name</h4>
  <form
    @submit.prevent.trim.lazy="
      getUserByUsername(url + '?username=' + search_input, user).then(u => {
        user = u;
        search_input = '';
      })
    "
    method="GET"
  >
    <label for="name">Username:</label>
    <input v-model="search_input" name="username" type="text" />
    <input type="submit" value="Submit" />
  </form>
  <p>{{ user.data }}</p>

  <h4>Create User</h4>
  <form
    @submit.prevent.trim.lazy="
      createUser(url, create_input, dataUsers).then(() => (create_input = ''))
    "
    method="POST"
  >
    <label for="name">Username:</label>
    <input v-model="create_input" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

  <h4>Update User</h4>
  <form
    @submit.prevent.trim.lazy="
      updateUser(
        update_id,
        update_input,
        url + '/' + update_id,
        dataUsers
      ).then(() => {
        update_input = '';
        update_id = '';
      })
    "
    method="PATCH"
  >
    <label for="id">id:</label>
    <input v-model="update_id" name="id" type="text" />
    <label for="name">new username:</label>
    <input v-model="update_input" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

  <h4>Get all - id, name</h4>
  <ul v-if="userState.users">
    <li v-for="item in userState.users" :key="item.id">
      Id: {{ item.id }}, Username: {{ item.username }}
      <button
        @click="
          deleteUser(item.id, url + '/' + item.id.toString()).then(id => {
            userState.delete(id);
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
      getMatchById(urlMatch + '?id=' + id_input, match).then(m => {
        match = m;
        id_input = '';
      })
    "
    method="GET"
  >
    <label for="name">Id:</label>
    <input v-model="id_input" name="id" type="text" />
    <input type="submit" value="Submit" />
  </form>
  <p>{{ match.data }}</p>

  <h4>Create Match</h4>
  <form
    @submit.prevent.trim.lazy="
      createMatch(
        urlMatch,
        p1_input,
        p2_input,
        Number(s1_input),
        Number(s2_input),
        dataMatches
      ).then(() => {
        p1_input = '';
        (p2_input = ''), (s1_input = ''), (s2_input = '');
      })
    "
    method="POST"
  >
    <label for="name">Player1:</label>
    <input v-model="p1_input" name="name" type="text" />
    <label for="name">Player2:</label>
    <input v-model="p2_input" name="name" type="text" />
    <label for="name">Score1:</label>
    <input v-model="s1_input" name="name" type="text" />
    <label for="name">Score2:</label>
    <input v-model="s2_input" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

  <h4>Update Match</h4>
  <form
    @submit.prevent.trim.lazy="
      updateMatch(
        update_id_match,
        update_p1,
        update_p2,
        update_s1,
        update_s2,
        urlMatch + '/' + update_id_match,
        dataMatches
      ).then(() => {
        update_id_match = '';
        update_p1 = '';
        update_p2 = '';
        update_s1 = '';
        update_s2 = '';
      })
    "
    method="PATCH"
  >
    <label for="id">id:</label>
    <input v-model="update_id_match" name="id" type="text" />
    <label for="name">Player1:</label>
    <input v-model="update_p1" name="name" type="text" />
    <label for="name">Player2:</label>
    <input v-model="update_p2" name="name" type="text" />
    <label for="name">Score1:</label>
    <input v-model="update_s1" name="name" type="text" />
    <label for="name">Score2:</label>
    <input v-model="update_s2" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

  <h4>Get all - id, playerOne, playerTwo, winner, score</h4>
  <ul v-if="dataMatches">
    <li v-for="item in dataMatches" :key="item.id">
      Id: {{ item.id }}, Player1: {{ item.playerOne }}, Player2:
      {{ item.playerTwo }}, Winner: {{ item.winner }}, Score: {{ item.score }}
      <button
        @click="
          deleteMatch(item.id, urlMatch + '/' + item.id.toString()).then(id =>
            filteredDataMatch('' + id)
          )
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
