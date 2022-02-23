<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getAllUsers, getUserByUsername, createUser, updateUser, deleteUser } from '../requests/userRequests'

// Request url to API
const url = '/users';

// List of all users
const data: any = ref(null);

// Single user
const user: any = ref({});

// Track forms input data
const search_input = ref<string>('');
const create_input = ref<string>('');
const update_input = ref<string>('');
const update_id = ref<any>(null);

onMounted(() => {
  getAllUsers(url);
});
</script>

<template>
  <h2>Debug</h2>
  <h3>Tests GET requests to backend API => USER</h3>

  <h4>Get by name</h4>
  <form @submit.prevent.trim.lazy="getUserByUsername(url + '?username=' + search_input.value)" method="GET">
    <label for="name">Username:</label>
    <input v-model="search_input" name="username" type="text" />
    <input type="submit" value="Submit" />
  </form>
  <p>{{ user.data }}</p>

  <h4>Create User</h4>
  <form @submit.prevent.trim.lazy="createUser(url)" method="POST">
    <label for="name">Username:</label>
    <input v-model="create_input" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

  <h4>Update User</h4>
  <form
    @submit.prevent.trim.lazy="updateUser(update_id, update_input, url)"
    method="PATCH"
  >
    <label for="id">id:</label>
    <input v-model="update_id" name="id" type="text" />
    <label for="name">new username:</label>
    <input v-model="update_input" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

  <h4>Get all - id, name</h4>
  <ul v-if="data">
    <li v-for="(item, index) in data" :key="item.id">
      Id: {{ item.id }}, Username: {{ item.username }}
      <button @click="deleteUser(item.id, url)">delete</button>
    </li>
  </ul>
  <p v-else>Not Found</p>
</template>

<style>
 h2 {
   color: red
 }
  h3 {
   color: blue
 }
</style>