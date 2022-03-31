<script setup lang="ts">
// Props
const props = defineProps<{
  isAuthenticated: boolean;
  loggedUser: any;
}>();

import { io } from "socket.io-client";
import { Get } from "@/services/requests";

// console.log(props.isAuthenticated);

Get("/auth/status").then((response) => {
  console.log(response);
  if (response.status === 200) {
    const socket = io("ws://localhost:4000", {
      withCredentials: true,
    });

    // After socker connection, the server needs the logged user id
    socket.on("requestUserInfo", function (data: any) {
      socket.emit("connection", props.loggedUser);
    });

    // Listening for updates on the user list
    socket.on("update", (data: number[]) => console.log(data));
  }
});
</script>

<template></template>
