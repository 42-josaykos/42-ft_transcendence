<script setup lang="ts">
import { io } from "socket.io-client";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useGameStore } from "@/stores/game";
import type { User } from "@/models/user.model";

const userStore = useUserStore();
const { loggedUser, gameSocket, isAuthenticated } = storeToRefs(userStore);

const gameStore = useGameStore();
const { usersInQueue, usersInGame, inQueue, inGame } = storeToRefs(gameStore);

console.log("test inQueue: ", inQueue.value);

if (isAuthenticated.value) {
  gameSocket.value = io("ws://localhost:6060/game", {
    withCredentials: true,
  });

  // After socket connection, the server needs the logged user id
  gameSocket.value.on("requestGameUserInfo", function (data: any) {
    gameSocket.value?.emit("gameConnection", loggedUser.value);
  });

  gameSocket.value.on("logout", () => {
    console.log("Logout");
    window.location.href = "/auth/logout";
  });

  gameSocket.value.on("disconnect", (reason) => {
    console.log("Game socket disconnection reason: ", reason);
  });

  // // Game socket event
  // gameSocket.value.on("inQueueUsers", (inQueueUsers: User[]) => {
  //   if (!inQueueUsers) return;

  //   usersInQueue.value = inQueueUsers;
  //   if (
  //     inQueueUsers.findIndex((user) => user.id === loggedUser.value?.id) !== -1
  //   ) {
  //     enterQueue();
  //     inQueue.value = true;
  //   } else {
  //     leaveQueue();
  //     inQueue.value = false;
  //   }
  // });

  // gameSocket.value.on("inGameUsers", (inGameUsers: User[]) => {
  //   if (!inGameUsers) return;

  //   usersInGame.value = inGameUsers;
  //   if (
  //     inGameUsers.findIndex((user) => user.id === loggedUser.value?.id) !== -1
  //   )
  //     inGame.value = true;
  //   else inGame.value = false;
  // });
}
</script>

<template></template>
