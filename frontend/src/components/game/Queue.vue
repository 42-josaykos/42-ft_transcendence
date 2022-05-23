<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import TimerStartGame from "./TimerStartGame.vue";
import TimerStartGameInvite from "./TimerStartGameInvite.vue";
import { useGameStore } from "@/stores/game";

// Stores
const userStore = useUserStore();
const { loggedUser } = storeToRefs(userStore);

const gameStore = useGameStore();
const { gameSocket, inQueue, inGame, matchFound, matchInvite, players } =
  storeToRefs(gameStore);

const router = useRouter();

// Determine if already in queue, and update in queue users
gameSocket.value?.emit("inQueueUsers");

// Determine if in game, and update in queue users
gameSocket.value?.emit("inGameUsers");

const buttonAction = () => {
  // Enter / leave queue
  if (!inGame.value) {
    if (inQueue.value) gameSocket.value?.emit("leaveQueue", loggedUser.value);
    else gameSocket.value?.emit("queue", loggedUser.value);
    inQueue.value = !inQueue.value;
  }
  // Go back to the game
  else router.push("/game");
};
</script>

<template>
  <button
    @click="buttonAction"
    class="btn-block set-btn set-btn-nav btn-nav selector"
  >
    {{ !inGame ? (!inQueue ? "Find a game" : "Leave queue") : "Back to Game" }}
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
      <TimerStartGameInvite :playerOne="players[0]" :playerTwo="players[1]" />
    </div>
  </div>
</template>

<style scoped>
.set-btn-nav {
  background-color: transparent;
  color: white;
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
  padding: 0.25rem 0.5rem;
  font-size: .875rem;
  border-radius: 0.2rem;
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
