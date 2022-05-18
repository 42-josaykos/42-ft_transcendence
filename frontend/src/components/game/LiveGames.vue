<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { ref } from "vue";
// import Modale from "../Modale.vue";
import UserCard from "../UserCard.vue";

// Stores
const userStore = useUserStore();
const { gameSocket, loggedUser } = storeToRefs(userStore);

const router = useRouter();

// Live games
const liveGames = ref<any>(null);
const gameInvites = ref<any>([]);
const modaleAllInvitesGame = ref<boolean>(false);

if (gameSocket.value) {
  gameSocket.value.on("liveGames", (games: any) => {
    //   console.log("[LiveGames] Live games: ", games);
    liveGames.value = games;
  });

  gameSocket.value.emit("getInvitesGame", loggedUser.value);
  gameSocket.value.on("updateGameInvites", (invites: any) => {
    // console.log("[updateInviteGame] Invites games: ", invites);
    gameInvites.value = invites;
  });
  gameSocket.value.emit("getOngoingGames");

  gameSocket.value.on("spectateGame", () => {
    router.push("/spectate");
  });
}

// Spectate
const spectate = (gameID: number) => {
  gameSocket.value?.emit("addSpectator", gameID);
};

const acceptInviteToGame = (inviteUser: any) => {
  gameSocket.value?.emit("acceptInviteToGame", inviteUser, loggedUser.value);
};
</script>

<template>
  <div class="infoGame mb-5">
    <div class="cont">
      <div class="d-flex" style="justify-content: center">
        <div
          class="neon-typo pt-4"
          style="font-size: xx-large; font-weight: bold"
        >
          Live Game
        </div>
        <button
          @click="modaleAllInvitesGame = true"
          type="button"
          class="rounded btn-channel wrapper-icon-leave hovertext hovertextC pt-4 btn-badge"
          data-hover="See all invitations to play"
        >
          <span class="position-badge-game translate-middle rounded-pill">
            {{ gameInvites.length }}
          </span>
        </button>
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

  <div class="bloc_modale" v-if="modaleAllInvitesGame">
    <div
      class="overlay"
      @click="modaleAllInvitesGame = !modaleAllInvitesGame"
    ></div>
    <div class="modale card">
      <h2 class="pt-4 pb-4">
        <u>Invitations received :</u>
      </h2>
      <div v-if="gameInvites && gameInvites.length > 0">
        <div class="scrollspy-example2 card-choose-users">
          <div
            class="separator-list"
            v-for="invite in gameInvites"
            :key="invite.user.id"
          >
            <div class="d-flex ms-auto my-2" style="align-items: center">
              <UserCard class="ms-2" :user="invite.user" :dashboard="true" />
              <div class="ms-auto">
                <button
                  @click="
                    modaleAllInvitesGame = false;
                    acceptInviteToGame(invite.user);
                  "
                  type="button"
                  class="mod-btn mod-btn-cyan btn-sm"
                >
                  Play
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p style="color: red">No invitation to play</p>
      </div>
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
  margin-top: 10px;
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
.position-badge-game {
  left: 90% !important;
  top: 50% !important;
  display: initial;
  padding: 0.3em 0.5em;
  font-size: 0.75em;
  font-weight: 700;
  line-height: 1;
  background-color: #dfaf2c;
  text-align: center;
  white-space: nowrap;
  border: #dfaf2c 3px solid;
  box-shadow: 0px 0px 10px #dfaf2c, 0px 0px 15px 5px #dfaf2c;
  color: #ffffff;
  font-size: initial;
  font-weight: bold;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: 5px;
}
.position-badge-game:hover {
  box-shadow: 0px 0px 10px #dfaf2c, 0px 0px 15px 5px #dfaf2c;
}

.btn-badge{
  transition: 0.2s;
}

.btn-badge:hover {
  transform: scale(1.2);
}
</style>
