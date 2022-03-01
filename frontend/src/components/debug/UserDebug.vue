<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Get, Post, Delete, Patch } from '@/services/requests';

import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useInputStore } from '@/stores/input';
import type { User } from '@/models/user.model';

// Request url to API
const baseUrl = 'http://localhost:3000/users';

// Single element
const user = ref<User | null>(null);

// Stores
const userStore = useUserStore();
const { users } = storeToRefs(userStore);
const inputStore = useInputStore();
const { input } = storeToRefs(inputStore);

// CRUD functions
const getUser = () => {
  Get(baseUrl + '?username=' + input.value.search).then(res => {
    if (res.status == 200) {
      user.value = res.data[0];
    }
    inputStore.$reset();
  });
};

const createUser = () => {
  Post(baseUrl, { username: input.value.create }).then(res => {
    if (res.status == 201) {
      userStore.createUser(res.data);
    }
    inputStore.$reset();
  });
};

const updateUser = () => {
  Patch(baseUrl + '/' + input.value.user_id, {
    username: input.value.update_username
  }).then(res => {
    if (res.status == 200) {
      userStore.updateUser(res.data.id, res.data);
    }
    inputStore.$reset();
  });
};

const deleteUser = (id: number) => {
  Delete(baseUrl + '/' + id.toString()).then(res => {
    if (res.status == 200) {
      userStore.deleteUser(id);
    }
  });
};

onMounted(() => {
  Get(baseUrl).then(res => (users.value = res.data));
});
</script>

<template>
  <h3 class="title">Tests GET requests to backend API => USER</h3>

  <h4>Get by name</h4>
  <form @submit.prevent.trim.lazy="getUser" method="GET">
    <label for="name">Username:</label>
    <input v-model="input.search" name="username" type="text" />
    <input type="submit" value="Submit" />
  </form>
  <p>{{ user }}</p>

  <h4>Create User</h4>
  <form @submit.prevent.trim.lazy="createUser" method="POST">
    <label for="name">Username:</label>
    <input v-model="input.create" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

  <h4>Update User</h4>
  <form @submit.prevent.trim.lazy="updateUser" method="PATCH">
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
      <button @click="deleteUser(item.id)">delete</button>
    </li>
  </ul>
  <p v-else>Not Found</p>
</template>
