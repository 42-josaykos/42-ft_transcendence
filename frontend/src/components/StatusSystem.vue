<script setup lang="ts">
// Props
const props = defineProps<{
  title: string;
}>();

import { io } from "socket.io-client";

const socket = io("ws://localhost:4000", {
  withCredentials: true,
});

socket.emit("message", "Does it work?");
socket.on("message", function (data: any) {
  console.log(data);
});
// socket.on("message", (data: any) => console.log(data));
</script>

<template>
  <h3 class="title">{{ title }}</h3>
</template>
