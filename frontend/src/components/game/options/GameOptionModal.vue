<script setup lang="ts">
import GameOption from "./GameOption.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

// Stores
const userStore = useUserStore();
const { gameSocket, loggedUser, userClick, modaleOpenInviteGame } =
  storeToRefs(userStore);

// Game options
const paddleSize = 2;
const ballSpeed = 3;

const inviteToGame = () => {
  gameSocket.value?.emit("addInvite", {
    playerOne: loggedUser.value,
    playerTwo: userClick.value,
    options: {
      paddleSize: paddleSize,
      ballSpeed: ballSpeed,
    },
  });
  close();
};

const close = () => {
  userClick.value = undefined;
  modaleOpenInviteGame.value = false;
};
</script>

<template>
  <GameOption
    @close="close"
    @inviteToGame="inviteToGame"
    @decrementPaddleSize="--paddleSize"
    @incrementPaddleSize="++paddleSize"
    @decrementBallSpeed="--ballSpeed"
    @incrementBallSpeed="++ballSpeed"
  />
</template>

<style></style>
