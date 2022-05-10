<script setup lang="ts">
import axios from "axios";
import { onMounted, ref } from "vue";

const data: any = ref(null);
const url = "/api/404";

onMounted(() => {
  axios
    .get(url)
    .then((res) => (data.value = res?.data))
    .catch((error) => {
    });
});
</script>

<template>
  <h2>404 | PageNotFound</h2>
</template>
