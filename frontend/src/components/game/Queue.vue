<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { ref } from "vue";
import type { User } from "@/models/user.model";
import TimerStartGame from "./TimerStartGame.vue";

// Stores
const userStore = useUserStore();
const { loggedUser, gameSocket, playersDuo } = storeToRefs(userStore);

const router = useRouter();
const matchFound = ref<boolean>(false);

gameSocket.value?.on("startGame", (players: User[]) => {
  console.log("[QueueSystem] A new match is starting");
  matchFound.value = true;
  setTimeout(() => {
    matchFound.value = false;
    playersDuo.value = players;
    router.push("/matchmaking");
  }, 5000);
});

const emit = defineEmits(["queueWaiting"]);
const queueWaiting = () => {
  emit("queueWaiting");
};

const inQueue = ref<boolean>(false);
const enterQueue = () => {
  queueWaiting();
  if (inQueue.value) gameSocket.value?.emit("leaveQueue", loggedUser.value);
  else gameSocket.value?.emit("queue", loggedUser.value);
  inQueue.value = !inQueue.value;
};
</script>

<template>
  <button
    @click="enterQueue"
    class="btn-block set-btn set-btn-nav btn-nav selector"
  >
    {{ !inQueue ? "Find a game" : "Leave queue" }}
  </button>

  <div class="bloc_modale" v-if="matchFound">
    <div class="overlay" @click=""></div>
    <div class="modale card">
      <TimerStartGame />
    </div>
  </div>
</template>

<style scoped>
.set-btn-nav {
  background-color: white;
  color: #66645f;
  box-shadow: 0px 0px 10px 2px white;
  font-weight: bold;
  text-decoration: none;
}
.set-btn-nav:hover {
  box-shadow: 0px 0px 10px white, 0px 0px 15px 5px white;
}
.btn-nav {
  margin-top: 45px;
  margin-right: auto;
  margin-left: auto;
}

@media screen and (min-width: 576px) and (max-width: 992px) {
  .set-btn-nav {
    max-width: 150px;
    min-width: 120px;
    font-size: medium;
  }
}
@media screen and (max-width: 576px) {
  .set-btn-nav {
    max-width: 100px;
    min-width: 86px;
    font-size: medium;
  }
}
@media screen and (min-width: 992px) {
  .set-btn-nav {
    min-width: 180px;
    font-size: large;
  }
}
</style>
