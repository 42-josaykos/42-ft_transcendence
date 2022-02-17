<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'

const data: any = ref(null)
const login: any = ref("")
const user: any = ref({})

const url = "/api/users/"

// Get user by login
async function getUserByLogin() {
  try {
    user.value = await axios.get(url + login.value)
  } catch (error) {
    console.log(error);
    user.value = {}
  }
  login.value = ""
}

onMounted(() => {
  axios.get(url).then(res =>
    data.value = res?.data
  ).catch(error => {
    console.log(error);
  })
})

</script>

<template>
  <h2>Debug</h2>
  <div>Tests GET requests to backend API</div>

  <h4>Get by name</h4>
  <form @submit.prevent.trim.lazy="getUserByLogin" method="GET">
    <label for="name"></label>
    <input v-model="login" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

  <p>{{ user.login }}</p>

  <h4>Get all - id, name</h4>
  <ul v-for="item in data">
    <li>{{ item.id }}</li>
    <li>{{ item.name }}</li>
  </ul>
</template>