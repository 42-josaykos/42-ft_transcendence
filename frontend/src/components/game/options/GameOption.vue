<script setup lang="ts">
import PowerUps from "./PowerUps.vue";
import { storeToRefs, mapState } from "pinia";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

// Event emits
const emit = defineEmits([
  "close",
  "inviteToGame",
  "decrementPaddleSize",
  "incrementPaddleSize",
  "decrementBallSpeed",
  "incrementBallSpeed",
]);
const close = () => {
  emit("close");
};
const inviteToGame = () => {
  emit("inviteToGame");
};
const decrementPaddleSize = () => {
  emit("decrementPaddleSize");
};
const incrementPaddleSize = () => {
  emit("incrementPaddleSize");
};
const decrementBallSpeed = () => {
  emit("decrementBallSpeed");
};
const incrementBallSpeed = () => {
  emit("incrementBallSpeed");
};
</script>

<template>
  <div class="bloc_modale">
    <div class="overlay"></div>
    <div class="modale card">
      <div @click="close()" type="button" class="btn-close-modale btn">
        <i class="fa-solid fa-xmark fa-2x"></i>
      </div>
      <h2 style="padding-top: 10px">
        <u
          style="
            text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3),
              0 0 0.45em currentColor;
          "
          >Start a game</u
        >
      </h2>
      <powerups
        @decrementPaddleSize="decrementPaddleSize"
        @incrementPaddleSize="incrementPaddleSize"
        @decrementBallSpeed="decrementBallSpeed"
        @incrementBallSpeed="incrementBallSpeed"
      />
      <button
        @click="inviteToGame()"
        type="button"
        class="mod-btn mod-btn-blue"
        style="width: 75%; margin: auto"
      >
        INVITE TO GAME
      </button>
    </div>
  </div>
</template>

<style></style>
