<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { ref } from "vue";

// Stores
const userStore = useUserStore();
const { gameSocket } = storeToRefs(userStore);

const router = useRouter();

// Live games
const liveGames = ref<any>(null);
gameSocket.value?.on("liveGames", (games: any) => {
  //   console.log("[LiveGames] Live games: ", games);
  liveGames.value = games;
});

// Spectate
const spectate = (gameID: number) => {
  gameSocket.value?.emit("addSpectator", gameID);
};

gameSocket.value?.on("spectateGame", () => {
  router.push("/spectate");
});
</script>

<template>
  <div class="infoGame mb-5">
    <!-- <div class="req neon-typo" v-if="!isAuthenticated">
                Log in to access
              </div> -->
    <div class="cont">
      <div
        class="neon-typo pt-4"
        style="font-size: xx-large; font-weight: bold"
      >
        Live Game
      </div>
      <hr />
      <br />
      <table style="width: 90%; table-layout: fixed; margin-left: 5%">
        <tr v-for="game in liveGames" :key="game.id">
          <th class="watch_player">{{ game.playerOne.username }}</th>
          <td class="neon-typo versus">VS</td>
          <th class="watch_player">{{ game.playerTwo.username }}</th>
          <td>
            <a href="#" @click="spectate(game.id)"
              ><i class="fa-solid fa-eye fa-xl action_icon"></i
            ></a>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style scoped>
.infoGame {
  display: grid;

  background-color: rgba(0, 0, 0, 0.4);
  padding-bottom: 4vh;
  min-height: 400px;
  max-height: 400px;
  overflow-y: scroll;
  border-radius: 30px;
  box-shadow: 0px 0px 10px 2px white, inset 0px 0px 4px 2px white;
}

.cont {
  grid-area: 1 / 1;
}

.cont {
  z-index: 1;
}

p {
  margin-left: auto;
  margin-right: auto;
  width: 6em;
}

.neon-typo {
  color: #ffffff;
  text-shadow: 0px 4px 15px white, 0px 0px 10px white;
}

.infoGame {
  overflow: hidden;
}

.infoGame hr {
  display: block;
  position: relative;
  height: 2px;
  box-shadow: 0px 0px 10px white, 0px 0px 15px 5px white;
  opacity: 1;
  width: 90%;
  color: #fffed9;
  margin: auto;
  margin-top: 2vh;
}

th {
  white-space: nowrap;
  width: 40%;
}

.versus {
  font-size: large;
  font-weight: bold;
}
.watch_player {
  font-size: large;
  overflow-x: hidden;
}

.action_icon {
  color: var(--sidebar-icon-color);
}

.action_icon:hover {
  transform: scale(1.5);
  transition: 0.4s;
  cursor: pointer;
}

th {
  padding: 5px;
}
</style>
