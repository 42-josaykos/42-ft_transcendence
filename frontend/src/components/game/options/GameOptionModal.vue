<script setup lang="ts">
import GameOption from "./GameOption.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

// Stores
const userStore = useUserStore();
const { gameSocket, loggedUser, userClick, modaleOpenInviteGame } =
  storeToRefs(userStore);

// Game options
const paddleSize = ref<number>(2);
const ballSpeed = ref<number>(3);

// Oops
const getter = (variable: any) => {
  return variable;
};

const decrementPaddleSize = () => {
  paddleSize.value = getter(paddleSize.value) - 1;
};
const incrementPaddleSize = () => {
  paddleSize.value = getter(paddleSize.value) + 1;
};
const decrementBallSpeed = () => {
  ballSpeed.value = getter(ballSpeed.value) - 1;
};
const incrementBallSpeed = () => {
  ballSpeed.value = getter(ballSpeed.value) + 1;
};

const inviteToGame = () => {
  gameSocket.value?.emit("addInvite", {
    playerOne: loggedUser.value,
    playerTwo: userClick.value,
    options: {
      paddleSize: paddleSize.value,
      ballSpeed: ballSpeed.value,
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
    @decrementPaddleSize="decrementPaddleSize"
    @incrementPaddleSize="incrementPaddleSize"
    @decrementBallSpeed="decrementBallSpeed"
    @incrementBallSpeed="incrementBallSpeed"
  />
</template>

<style></style>
