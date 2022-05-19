<script setup lang="ts">
import { io } from "socket.io-client";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useGameStore } from "@/stores/game";
import type { User } from "@/models/user.model";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const { loggedUser, isAuthenticated } = storeToRefs(userStore);

const gameStore = useGameStore();
const {
  gameSocket,
  usersInQueue,
  usersInGame,
  inQueue,
  inGame,
  players,
  matchFound,
  matchInvite,
} = storeToRefs(gameStore);

const router = useRouter();

if (isAuthenticated.value) {
  gameSocket.value = io("ws://localhost:6060/game", {
    withCredentials: true,
  });

  // After socket connection, the server needs the logged user id
  gameSocket.value.on("requestGameUserInfo", function (data: any) {
    gameSocket.value?.emit("gameConnection", loggedUser.value);
  });

  // Disconnect events
  // gameSocket.value.on("logout", () => {
  //   console.log("[GameSystem] Logout");
  //   window.location.href = "/auth/logout";
  // });

  // gameSocket.value.on("disconnect", (reason) => {
  //   console.log("Game socket disconnection reason: ", reason);
  // });

  // Game socket events
  gameSocket.value.on("inQueueUsers", (inQueueUsers: User[]) => {
    if (!inQueueUsers) return;

    usersInQueue.value = inQueueUsers;
    if (
      inQueueUsers.findIndex((user) => user.id === loggedUser.value?.id) !== -1
    )
      inQueue.value = true;
    else inQueue.value = false;
  });

  gameSocket.value.on("inGameUsers", (inGameUsers: User[]) => {
    if (!inGameUsers) return;

    usersInGame.value = inGameUsers;
    if (
      inGameUsers.findIndex((user) => user.id === loggedUser.value?.id) !== -1
    )
      inGame.value = true;
    else inGame.value = false;
  });

  gameSocket.value.on("startGame", (startEvent: any) => {
    // console.log("[QueueSystem] A new match is starting");

    let startTime;
    players.value = startEvent.players;
    if (startEvent.mode === "matchmaking") {
      matchFound.value = true;
      startTime = 5000;
    } else if (startEvent.mode === "invite") {
      matchInvite.value = true;
      startTime = 10000;
    }

    setTimeout(() => {
      if (startEvent.mode === "matchmaking") matchFound.value = false;
      else if (startEvent.mode === "invite") matchInvite.value = false;
      players.value = [];
      router.push("/game");
    }, startTime);
  });
}
</script>

<template></template>
