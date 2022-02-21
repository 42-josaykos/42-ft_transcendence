<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue';

// List of all users
const data: any = ref(null);

// Single user
const user: any = ref({});

// Track forms input data
const search_input = ref<string>('');
const create_input = ref<string>('');

// Request url to API
const url = '/users';

// Get all users
async function getAllUsers() {
  axios
    .get(url)
    .then((res) => (data.value = res?.data))
    .catch((e) => e.response.data);
}

// Get user by login
async function getUserByUsername() {
  try {
    user.value = await axios.get(url + '?username=' + search_input.value);
  } catch (e: any) {
    user.value = { data: e.response.data.message };
  }
  search_input.value = '';
}

// Create user
async function createUser() {
  const new_user = { username: create_input.value };
  axios
    .post(url, new_user)
    .then(() => {
      getAllUsers();
    })
    .catch((e) => e.response.data);
  create_input.value = '';
}

// Update user data by Id
// Call this function in createUser() if login already exists
async function updateUser(id: string, updated_data: any) {
  axios
    .patch(url + id, updated_data)
    .then(() => {
      getAllUsers();
    })
    .catch((e) => e.response.data);
  create_input.value = '';
}

// Delete user
async function deleteUser(e: any) {
  axios
    .delete(url + '/' + e.target.parentElement.id)
    .then(() => {
      getAllUsers();
    })
    .catch((e) => e.response.data);
  create_input.value = '';
}

onMounted(() => {
  getAllUsers();
});
</script>

<template>
  <h2>Debug</h2>
  <div>Tests GET requests to backend API</div>

  <h4>Get by name</h4>
  <form @submit.prevent.trim.lazy="getUserByUsername" method="GET">
    <label for="name">Username:</label>
    <input v-model="search_input" name="username" type="text" />
    <input type="submit" value="Submit" />
  </form>
  <p>{{ user.data }}</p>

  <h4>Create User</h4>
  <form @submit.prevent.trim.lazy="createUser" method="POST">
    <label for="name">Username:</label>
    <input v-model="create_input" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

  <h4>Get all - id, name</h4>
  <ul v-if="data" v-for="item in data">
    <li :id="item.id">
      {{ item.username }}
      <button>update</button>
      <button @click="deleteUser">delete</button>
    </li>
  </ul>
  <p v-else>Not Found</p>
</template>
