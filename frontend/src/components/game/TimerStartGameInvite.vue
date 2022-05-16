<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { ref } from "vue";

const props = defineProps({
  playerOne: Object,
  playerTwo: Object,
});

const time = ref<number>(9);
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
    <div style="justify-content: ;center">
        <h3>{{props.playerOne?.username}}</h3>
        <span class="versus"> VS </span>
        <h3>{{props.playerTwo?.username}}</h3>
    </div>
    <span v-if="time > 0" class="timerStartGame">
      <h4>Game that starts in :</h4>
      <span class="time">{{ time }}</span>
    </span>
    <span v-else class="timerStartGame time">STARTING</span>
  </div>
</template>

<style scoped>
.timerStartGame {
  font-size: 80px;
  font-weight: bold;
}
.time {
  color: #ea2842;
  text-shadow: 0px 4px 15px #bb0a1b, 0px 0px 10px #bb0a1b;
}
h1 {
  font-weight: bold;
  text-shadow: 0px 4px 15px #0000ff, 0px 0px 10px #0000ff;
  color: #5656f0;
  font-size: 80px;
}
h3 {
  font-weight: bold;
  text-shadow: 0px 4px 15px #ec2eb3, 0px 0px 10px #ec2eb3;
  color: #f17acd;
  font-size: 60px;
}
.versus {
  font-weight: bold;
  color: #dfaf2c;
  font-size: 80px;
  text-shadow: none !important;
}
</style>