<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { notify } from "@kyvg/vue3-notification";
// import Modale from "../Modale.vue";
import UserCard from "../UserCard.vue";
import { useGameStore } from "@/stores/game";

// Stores
const userStore = useUserStore();
const { loggedUser } = storeToRefs(userStore);

const gameStore = useGameStore();
const { gameSocket, usersInGame, inGame } = storeToRefs(gameStore);

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
  if (inGame.value)
    notify({
    type: 'error',
    title: "Game",
    text: "You don't spectate, you are already in game",
  });
  else
    gameSocket.value?.emit("addSpectator", gameID);
};

const acceptInviteToGame = (inviteUser: any) => {
  gameSocket.value?.emit("acceptInviteToGame", inviteUser, loggedUser.value);
};

const checkifStartGame = (userInvite: any) => {
  if (userStore.valueInArray(loggedUser.value?.id, usersInGame.value))
    notify({
    type: 'error',
    title: "Game",
    text: "You are already in game",
  });
  else if (!userStore.valueInArray(userInvite.id, usersInGame.value)) {
    modaleAllInvitesGame.value = false;
    acceptInviteToGame(userInvite);
  }
}
</script>

<template>
  <div class="infoGame mb-5" style="overflow-y:hidden">
    <div class="cont">
      <div class="d-flex" style="justify-content: center">
        <div
          class="neon-typo pt-4"
          style="font-size: xx-large; font-weight: bold"
        >
          Live Games
        </div>
        <button
          @click="modaleAllInvitesGame = true"
          type="button"
          class="hovertext hovertextC invit_pod"
          data-hover="See all invitations to play"
        >
          <div class="invit_info">
            Game invites - {{ gameInvites.length }}
          </div>
        </button>
      </div>
      <hr />
      <br />
      <div class="scrollspy-example3">
        <table style="width: 90%; table-layout: fixed; margin-left: 5%">
          <tr v-for="game in liveGames" :key="game.id">
            <th class="watch_player">{{ game.playerOne.username }}</th>
            <td class="neon-typo versus">VS</td>
            <th class="watch_player">{{ game.playerTwo.username }}</th>
            <td>
              <a @click="spectate(game.id)" class="hovertext hovertextL" data-hover="See the game"
                ><i class="fa-solid fa-eye fa-xl action_icon"></i
              ></a>
            </td>
          </tr>
        </table>
      </div>
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
          <table>
            <tr class="separator-list"
              v-for="invite in gameInvites"
              :key="invite.sender.user.id">
              <td>
                <UserCard class="ms-2" :user="invite.sender.user" :dashboard="true" :profile="false"/>
              </td>
              <td>
                <div>
                  <span class="title-option">Paddle size : <span class="value-option">{{invite.gameOptions.paddleSize}}</span></span> <br/>
                  <span class="title-option">Ball speed : <span class="value-option">{{invite.gameOptions.ballSpeed}}</span></span>
                </div>
              </td>
              <td>
                <div class="ms-auto">
                  <button
                    @click="checkifStartGame(invite.sender.user)
                    "
                    type="button"
                    class="mod-btn mod-btn-cyan btn-sm"
                  >
                    {{userStore.valueInArray(invite.sender.user.id, usersInGame) ? 'Already in game' : 'Play'}}
                  </button>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div v-else>
        <p style="color: red">No invitation to play</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollspy-example3 {
  position: relative;
  max-height: 260px;
  min-height: 260px;
  margin-top: 0.5rem;
  overflow: auto;
  scrollbar-width: none;
}

.scrollspy-example3::-webkit-scrollbar {
  display: none;
}

.scrollspy-example3::-webkit-scrollbar-track {
  background: transparent;
}

.scrollspy-example3::-webkit-scrollbar-thumb {
  background-color: transparent;
}
.title-option {
  color: white;
  font-weight: bold;
}
.value-option {
  color: #24b400;
}

.invit_pod{
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #dfaf2c;
  border: #dfaf2c 5px solid;
  box-shadow: 0px 0px 10px 2px #daba64;
  margin-left: 2rem;
  margin-top: 2rem;
  max-height: 40px;
  border-radius: 0.25rem;
  transition: 0.4s;
  text-align: center;
}

.invit_pod:hover{
  box-shadow: 0px 0px 10px #daba64, 0px 0px 15px 5px #daba64;
}

@-moz-document url-prefix() {
  .invit_pod {
    padding-top: 5px;
    padding-left: 1px;
  }
}
.invit_info{
  color: white;
  font-weight: bold;
  transition: 0.4s;

}

.infoGame {
  display: grid;

  background-color: rgba(0, 0, 0, 0.4);
  padding-bottom: 4vh;
  min-height: 400px;
  max-height: 400px;
  overflow-y: scroll;
  overflow-x: hidden;
  border-radius: 30px;
  box-shadow: 0px 0px 10px 2px white, inset 0px 0px 4px 2px white;
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

.scrollBar_invisible {
  scrollbar-width: none;
}

.scrollBar_invisible::-webkit-scrollbar {
  display: none;
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
  text-align:inherit;
  color: #ffffff;
  text-shadow: 0px 4px 15px white, 0px 0px 10px white;
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
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: -webkit-fill-available;
  width: -moz-available;
  text-align: start;
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

.hovertextL:before {
  left: -120px;
}

.vertical {
  width:3px;
  height:100%;
  /* position:absolute; */
  background-color:#cb0a40;
  margin:0;
  padding:0;
  left:260px;
}
</style>