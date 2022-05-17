<script setup lang="ts">
import Modale from "./Modale.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import ModalChat from "./chat/ModalChat.vue";
import UsersFriends from "./UsersFriends.vue";
import { onMounted, ref } from "vue";
import { Get } from "@/services/requests";
import ModalMessage from "./chat/ModalMessage.vue";
import { useMessageStore } from "@/stores/message";
import Queue from "./game/Queue.vue";
import ModaleInviteGame from './game/ModaleInviteGame.vue';
import BtnUserCard from './BtnUserCard.vue';

const {
  setting_open,
  userClick,
  modalFriends,
  usersFriends,
  loggedUser,
  gameSocket,
  modaleOpenInviteGame,
} = storeToRefs(useUserStore());
const { modalSendMessage } = storeToRefs(useMessageStore());

defineProps<{
  componentName: string;
}>();

onMounted(async () => {
  if (loggedUser.value != undefined) {
    await Get(`/users/search?id=${loggedUser.value?.id}&friends`).then(
      (res: any) => {
        if (res.status == 200) {
          usersFriends.value = res.data[0].friends;
        }
      }
    );
  }
});

const waiting = ref<boolean>(false);
</script>

<template>
  <div class="container pt-2">
    <div v-if="loggedUser" class="d-flex pb-4 my-navbar">
      <BtnUserCard :user="loggedUser" :profile="true" @open="userClick = loggedUser; setting_open = !setting_open;"/>
      <div>
        <span class="neonText display-1 size-title" >
          <b>Space Pong</b>
        </span>
      </div>
    </div>

    <div class="row">
      <div class="d-flex btn-navbar">
        <router-link
          to="/"
          class="d-flex justify-content-center my-2 mx-2 router-nav"
        >
          <button
            @click=""
            class="btn-block set-btn set-btn-nav btn-nav selector"
          >
            Home
          </button>
        </router-link>

        <router-link
          to="/chat"
          class="d-flex justify-content-center my-2 mx-2 router-nav"
        >
          <button
            @click=""
            class="btn-block set-btn set-btn-nav btn-nav selector"
          >
            Chat
          </button>
        </router-link>

        <span class="d-flex justify-content-center my-2 mx-2">
          <button
            @click="modalFriends = true"
            class="btn-block set-btn set-btn-nav btn-nav set-btn-nav-friends selector"
          >
            Friends
          </button>
        </span>

        <span
          v-if="componentName === 'Home' || componentName === 'Chat'"
          class="d-flex justify-content-center my-2 mx-2"
        >
          <Queue @queueWaiting="waiting = !waiting" />
        </span>
      </div>
      <div style="text-align: end; color: hsl(317 100% 54%)" v-if="waiting">
        <span>Waiting for a game ...</span>
      </div>
    </div>
  </div>

  <Modale />

  <ModalChat v-if="modalFriends == true" @close="modalFriends = false">
    <template v-slot:header>
      <h2 class="pt-4">
        <u>Friends list</u>
      </h2>
    </template>
    <template v-slot:body>
      <UsersFriends />
    </template>
  </ModalChat>

  <ModalMessage v-if="modalSendMessage == true" />

  <ModaleInviteGame v-if="modaleOpenInviteGame" @close="modaleOpenInviteGame = false"/>
</template>

<style scoped>
li .row {
  transition: 0.4s;
}
li .row:hover {
  transform: scale(1.3);
  color: #fffed4;
  filter: drop-shadow(0px 0px 5px #fff961);
}
.btn-profile {
  padding-left: 0px !important;
  padding-right: 0px !important;
}
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
.btn-navbar {
  justify-content: space-around;
}
.my-navbar {
  align-items: center;
  justify-content: space-between;
}
.router-nav {
  text-decoration: none;
  color: inherit;
}
.avatar-img {
  width: 8vw;
  height: 8vw;
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
  .avatar-img {
    width: 12vw;
    height: 12vw;
  }

}
</style>
