<script setup lang="ts">
import { io } from "socket.io-client";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
// import { useStatusStore } from "@/stores/status";
import { Get } from "@/services/requests";

const userStore = useUserStore();
const { loggedUser, usersOnline, isAuthenticated } = storeToRefs(userStore);

if (isAuthenticated.value) {
  const gameSocket = io("ws://localhost:6060/game", {
    withCredentials: true,
  });

  // After socker connection, the server needs the logged user id
  gameSocket.on("requestGameUserInfo", function (data: any) {
    gameSocket.emit("connection", loggedUser.value);
  });

  // Listening for updates on the user list
  gameSocket.on("update", (data: number[]) => {
    usersOnline.value = data;
    console.log("[StatusStore] usersOnline: ", usersOnline.value);
  });
}
</script>

<template></template>
