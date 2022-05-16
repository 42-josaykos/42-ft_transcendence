<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { ref } from "vue";
import TimerStartGame from "./TimerStartGame.vue";
import TimerStartGameInvite from "./TimerStartGameInvite.vue";

// Stores
const userStore = useUserStore();
const { loggedUser, gameSocket } = storeToRefs(userStore);

const router = useRouter();
const matchFound = ref<boolean>(false);
const matchInvite = ref<boolean>(false);
const players = ref<any>(null);

gameSocket.value?.on("startGame", (data: any) => {
  console.log("[QueueSystem] A new match is starting");
  matchFound.value = true;
  setTimeout(() => {
    matchFound.value = false;
    router.push("/matchmaking");
  }, 5000);
});

gameSocket.value?.on("startGameInvite", (data: any) => {
  console.log("[InviteSystem] A new match is starting");
  players.value = data;
  matchInvite.value = true;
  setTimeout(() => {
    matchInvite.value = false;
    players.value = null;
    router.push("/matchmaking");
  }, 10000);
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

  <div class="bloc_modale" v-if="matchInvite">
    <div class="overlay" @click=""></div>
    <div class="modale card">
      <TimerStartGameInvite :playerOne="players[0]" :playerTwo="players[1]"/>
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
  margin-bottom: 45px;
  margin-right: auto;
  margin-left: auto;
  width: 115px;
}
@media screen and (max-width: 540px) {
  .btn-nav {
    margin-bottom: 45px;
    margin-right: auto;
    margin-left: auto;

    width: 55px;
    padding-left: 0px !important;
    padding-right: 0px !important;
  }
}
</style>
