<script setup lang="ts">
import { io } from "socket.io-client";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
// import { useStatusStore } from "@/stores/status";
import { Get } from "@/services/requests";

// const statusStore = useStatusStore();
// const { loggedUser, isAuthenticated, usersOnline } = storeToRefs(statusStore);

const userStore = useUserStore();
const { loggedUser, usersOnline, isAuthenticated } = storeToRefs(userStore);

console.log("[StatusStore] isAuthenticated: ", isAuthenticated.value);

if (isAuthenticated.value) {
  console.log("[StatusStore] loggedUser: ", loggedUser.value);
  const socket = io("ws://localhost:3615/status", {
    withCredentials: true,
  });

  // After socker connection, the server needs the logged user id
  socket.on("requestUserInfo", function (data: any) {
    console.log("Sending info: ", loggedUser.value);
    socket.emit("connection", loggedUser.value);
  });

  // Listening for updates on the user list
  socket.on("update", (data: number[]) => {
    usersOnline.value = data;
    console.log("[StatusStore] usersOnline: ", usersOnline.value);
  });
}
</script>

<template></template>
