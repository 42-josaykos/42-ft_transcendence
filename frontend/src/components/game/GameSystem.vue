<script setup lang="ts">
import { io } from "socket.io-client";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import type { User } from "@/models/user.model";

const userStore = useUserStore();
const { loggedUser, gameSocket, isAuthenticated } = storeToRefs(userStore);

if (isAuthenticated.value) {
  gameSocket.value = io("ws://localhost:6060/game", {
    withCredentials: true,
  });

  // After socket connection, the server needs the logged user id
  gameSocket.value.on("requestGameUserInfo", function (data: any) {
    gameSocket.value?.emit("gameConnection", loggedUser.value);
  });
}
</script>

<template></template>
