<script setup lang="ts">
import { onMounted, ref } from 'vue';
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
import { storeToRefs } from 'pinia';
import type { User } from '@/models/user.model';

// Request url to API
const url = 'http://localhost:3000/users';
const urlMatch = 'http://localhost:3000/matches';

// List of all users
const userStore = useUserStore();
const { users } = storeToRefs(userStore);

// Single user
const user = ref<User | null>(null);

// List of all Matches
const dataMatches: any = ref(null);

// Single user
const match: any = ref({});

// Track forms inputs
const inputs = ref({
  search: '',
  create: '',
  update_name: '',
  update_id: '',
  id_input: '',
  p1_input: '',
  p2_input: '',
  s1_input: '',
  s2_input: '',
  update_id_match: '',
  update_p1: '',
  update_p2: '',
  update_s1: '',
  update_s2: ''
});

function filteredDataMatch(id: string) {
  dataMatches.value = dataMatches.value.filter((t: any) => t.id !== id);
  return dataMatches.value;
}

onMounted(() => {
  getAllUsers(url).then(res => (users.value = res.data));
  getAllMatches(urlMatch, dataMatches);
});
</script>

<template>
  <h2 class="debug">Debug</h2>
  <h3 class="title">Tests GET requests to backend API => USER</h3>

  <h4>Get by name</h4>
  <form
    @submit.prevent.trim.lazy="
      getUserByUsername(url + '?username=' + inputs.search).then(u => {
        user = u.data[0];
        inputs.search = '';
      })
    "
    method="GET"
  >
    <label for="name">Username:</label>
    <input v-model="inputs.search" name="username" type="text" />
    <input type="submit" value="Submit" />
  </form>
  <p>{{ user }}</p>

  <h4>Create User</h4>
  <form
    @submit.prevent.trim.lazy="
      createUser(url, inputs.create).then(newUser => {
        userStore.createUser(newUser);
        inputs.create = '';
      })
    "
    method="POST"
  >
    <label for="name">Username:</label>
    <input v-model="inputs.create" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

  <h4>Update User</h4>
  <form
    @submit.prevent.trim.lazy="
      updateUser(url + '/' + inputs.update_id, {
        username: inputs.update_name
      }).then(res => {
        if (res.status != 404) {
          userStore.updateUser(+inputs.update_id, {
            username: inputs.update_name
          });
        }
        inputs.update_name = '';
        inputs.update_id = '';
      })
    "
    method="PATCH"
  >
    <label for="id">id:</label>
    <input v-model="inputs.update_id" name="id" type="text" />
    <label for="name">new username:</label>
    <input v-model="inputs.update_name" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

  <h4>Get all - id, name</h4>
  <ul v-if="users">
    <li v-for="item in users" :key="item.id">
      Id: {{ item.id }}, Username: {{ item.username }}
      <button
        @click="
          deleteUser(url + '/' + item.id.toString()).then(ret => {
            if (ret) {
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
      getMatchById(urlMatch + '?id=' + inputs.id_input, match).then(m => {
        match = m;
        inputs.id_input = '';
      })
    "
    method="GET"
  >
    <label for="name">Id:</label>
    <input v-model="inputs.id_input" name="id" type="text" />
    <input type="submit" value="Submit" />
  </form>
  <p>{{ match.data }}</p>

  <h4>Create Match</h4>
  <form
    @submit.prevent.trim.lazy="
      createMatch(
        urlMatch,
        inputs.p1_input,
        inputs.p2_input,
        Number(inputs.s1_input),
        Number(inputs.s2_input),
        dataMatches
      ).then(() => {
        inputs.p1_input = '';
        (inputs.p2_input = ''), (inputs.s1_input = ''), (inputs.s2_input = '');
      })
    "
    method="POST"
  >
    <label for="name">Player1:</label>
    <input v-model="inputs.p1_input" name="name" type="text" />
    <label for="name">Player2:</label>
    <input v-model="inputs.p2_input" name="name" type="text" />
    <label for="name">Score1:</label>
    <input v-model="inputs.s1_input" name="name" type="text" />
    <label for="name">Score2:</label>
    <input v-model="inputs.s2_input" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

  <h4>Update Match</h4>
  <form
    @submit.prevent.trim.lazy="
      updateMatch(
        inputs.update_id_match,
        inputs.update_p1,
        inputs.update_p2,
        inputs.update_s1,
        inputs.update_s2,
        urlMatch + '/' + inputs.update_id_match,
        dataMatches
      ).then(() => {
        inputs.update_id_match = '';
        inputs.update_p1 = '';
        inputs.update_p2 = '';
        inputs.update_s1 = '';
        inputs.update_s2 = '';
      })
    "
    method="PATCH"
  >
    <label for="id">id:</label>
    <input v-model="inputs.update_id_match" name="id" type="text" />
    <label for="name">Player1:</label>
    <input v-model="inputs.update_p1" name="name" type="text" />
    <label for="name">Player2:</label>
    <input v-model="inputs.update_p2" name="name" type="text" />
    <label for="name">Score1:</label>
    <input v-model="inputs.update_s1" name="name" type="text" />
    <label for="name">Score2:</label>
    <input v-model="inputs.update_s2" name="name" type="text" />
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
