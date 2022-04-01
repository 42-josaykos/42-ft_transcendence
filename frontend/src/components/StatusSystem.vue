<script setup lang="ts">
// Props
const props = defineProps<{
  isAuthenticated: boolean;
  loggedUser: any;
}>();

import { io } from "socket.io-client";
import { storeToRefs } from "pinia";
// import { useUserStore } from "@/stores/user";
import { useStatusStore } from "@/stores/status";
import { Get } from "@/services/requests";

const statusStore = useStatusStore();
const { usersOnline } = storeToRefs(statusStore);

// const statusStore = useStatusStore();
// const userStore = useUserStore();
// const { loggedUser, usersOnline, isAuthenticated } = storeToRefs(userStore);

// console.log("Logged User: ", loggedUser);
// console.log("usersOnline: ", usersOnline);
// console.log("isAuthenticated: ", isAuthenticated);

console.log("Props isAuthenticated: ", props.isAuthenticated);

Get("/auth/status").then((response) => {
  // if (isAuthenticated) {
  console.log("Response: ", response);
  if (response.status === 200) {
    const socket = io("ws://localhost:4000", {
      withCredentials: true,
    });

    // After socker connection, the server needs the logged user id
    socket.on("requestUserInfo", function (data: any) {
      console.log("Sending info: ", props.loggedUser);
      socket.emit("connection", props.loggedUser);
    });

    // Listening for updates on the user list
    socket.on("update", (data: number[]) => {
      usersOnline.value = data;
      console.log("Status store (usersOnline): ", usersOnline.value);
    });
  }
});
</script>

<template></template>
