<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { ref } from "vue";
import type { User } from "@/models/user.model";
import TimerStartGame from "./TimerStartGame.vue";
import TimerStartGameInvite from "./TimerStartGameInvite.vue";

// Stores
const userStore = useUserStore();
const { loggedUser, usersInGame, usersInQueue, gameSocket, playersDuo } =
  storeToRefs(userStore);

const router = useRouter();
const matchFound = ref<boolean>(false);
const matchInvite = ref<boolean>(false);
const players = ref<any>(null);

const inQueue = ref<boolean>(false);
const inGame = ref<boolean>(false);

if (gameSocket.value) {
  // Start games
  gameSocket.value.on("startGame", (players: User[]) => {
    console.log("[QueueSystem] A new match is starting");
    matchFound.value = true;
    setTimeout(() => {
      matchFound.value = false;
      playersDuo.value = players;
      router.push("/matchmaking");
    }, 5000);
  });

  gameSocket.value.on("startGameInvite", (data: any) => {
    console.log("[InviteSystem] A new match is starting");
    players.value = data;
    matchInvite.value = true;
    setTimeout(() => {
      matchInvite.value = false;
      players.value = null;
      router.push("/matchmaking");
    }, 10000);
  });

  // Determine if already in queue, and update in queue users
  gameSocket.value.on("inQueueUsers", (inQueueUsers: User[]) => {
    usersInQueue.value = inQueueUsers;
    if (
      inQueueUsers.findIndex((user) => user.id === loggedUser.value?.id) !== -1
    ) {
      enterQueue();
      inQueue.value = true;
    } else {
      leaveQueue();
      inQueue.value = false;
    }
  });
  gameSocket.value.emit("inQueueUsers");

  // Determine if in game, and update in queue users
  gameSocket.value.on("inGameUsers", (inGameUsers: User[]) => {
    usersInGame.value = inGameUsers;
    if (
      inGameUsers.findIndex((user) => user.id === loggedUser.value?.id) !== -1
    )
      inGame.value = true;
    else inGame.value = false;
  });
  gameSocket.value.emit("inGameUsers");
}

const buttonAction = () => {
  // Enter / leave queue
  if (!inGame.value) {
    if (inQueue.value) {
      leaveQueue();
      gameSocket.value?.emit("leaveQueue", loggedUser.value);
    } else {
      gameSocket.value?.emit("queue", loggedUser.value);
      enterQueue();
    }
    inQueue.value = !inQueue.value;
  }
  // Go back to the game
  else router.push("/matchmaking");
};

const emit = defineEmits(["enterQueue", "leaveQueue"]);
const enterQueue = () => {
  emit("enterQueue");
};
const leaveQueue = () => {
  emit("leaveQueue");
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
