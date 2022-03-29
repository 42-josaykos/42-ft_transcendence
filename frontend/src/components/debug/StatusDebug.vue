<script setup lang="ts">
// Props
const props = defineProps<{
  title: string;
}>();

import { io } from "socket.io-client";

const socket = io("http://localhost:4000", {
  withCredentials: true,
});

socket.on("message", (data: any) => {});
</script>

<template>
  <h3 class="title">{{ title }}</h3>
</template>
