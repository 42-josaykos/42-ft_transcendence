<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { ref } from "vue";

const time = ref<number>(4);
let intervalId: any;

const decrement = () => {
  if (time.value < 0) {
    clearInterval(intervalId);
  } else {
    time.value--;
  }
};
intervalId = setInterval(decrement, 1000);
</script>

<template>
  <div>
    <h1>GAME FOUND</h1>
    
    <span v-if="time > 0" class="timerStartGame">
      <h4>Game starts in :</h4>
      {{ time }}
    </span>
    <span v-else class="timerStartGame">STARTING</span>
  </div>
</template>

<style scoped>
.timerStartGame {
  font-size: 100px;
  font-weight: bold;
}
h1 {
  font-weight: bold;
  text-shadow: 0px 4px 15px #0000ff, 0px 0px 10px #0000ff;
  color: #5656f0;
  font-size: 100px;
}
</style>
