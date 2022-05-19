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
  gameSocket.value = io(
    `ws://${process.env.BACKEND_HOST}:${process.env.GAME_PORT}/game`,
    {
      withCredentials: true,
    }
  );

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

    // If players aren't already in game
    if (
      userStore.valueInArray(startEvent.players[0].id, usersInGame.value) ||
      userStore.valueInArray(startEvent.players[1].id, usersInGame.value)
    )
      return;

    const startTime = 5000;
    players.value = startEvent.players;
    if (startEvent.mode === "matchmaking") matchFound.value = true;
    else if (startEvent.mode === "invite") matchInvite.value = true;

    setTimeout(() => {
      console.log("players =>  ", players.value);
      if (startEvent.mode === "matchmaking") matchFound.value = false;
      else if (startEvent.mode === "invite") matchInvite.value = false;
      players.value = [];
      router.push("/game");
    }, startTime);
  });
}
</script>

<template></template>
