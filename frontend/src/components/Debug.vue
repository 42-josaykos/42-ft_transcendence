<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'

const data: any = ref(null)
const url = "/api/users"

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
  <ul v-for="item in data">
    <li>{{ item.id }}</li>
    <li>{{ item.name }}</li>
  </ul>
</template>