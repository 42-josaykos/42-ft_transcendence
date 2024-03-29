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
import BtnUserCard from './BtnUserCard.vue';
import GameOptionModal from "./game/options/GameOptionModal.vue";
const {
  setting_open,
  userClick,
  modalFriends,
  usersFriends,
  loggedUser,
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
</script>

<template>
  <div class="container pt-2">
    <div v-if="loggedUser" class="d-flex pb-4 my-navbar">
      <BtnUserCard :user="loggedUser" :profile="true" @open="userClick = loggedUser; setting_open = !setting_open;"/>
      <div style="width: 67vw">
        <span class="neonText display-1 size-title">
          <b>Space Pong</b>
        </span>
      </div>
    </div>
    <div class="title-small-screen">
      <span class="neonText">
          Space Pong
        </span>
    </div>

    <div class="row">
      <div class="d-flex btn-navbar">
        <router-link
          to="/"
          class="d-flex justify-content-center my-2 mx-2 router-nav"
        >
          <button
            class="btn-block set-btn set-btn-nav btn-nav selector"
            v-bind:class="{ 'active_tab' :  componentName === 'Home'}"
          >
            Home
          </button>
        </router-link>

        <router-link
          to="/chat"
          class="d-flex justify-content-center my-2 mx-2 router-nav"
        >
          <button
            class="btn-block set-btn set-btn-nav btn-nav selector"
            v-bind:class="{ 'active_tab' : componentName === 'Chat' }"
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
          <Queue />
        </span>
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

  <GameOptionModal
    v-if="modaleOpenInviteGame"
    @close="modaleOpenInviteGame = false"
  />
</template>

<style scoped>
.display-1{
  font-size: calc(1.625rem + 4.4vw);
}
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
.title-small-screen{
  display: none;
}
.active_tab{
  background-color: rgba(255, 255, 255, 0);
  color: #ffff;
  transform: scale(1.5);
  text-shadow: 0px 4px 15px #5271ff, 0px 0px 10px #5271ff;
  box-shadow: none !important;
  font-weight: bold;
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

  .size-title {
    font-size: calc(1.625rem + 2.5vw);
    white-space: nowrap;
  }
}
@media screen and (max-width: 402px) {
  .size-title {
    display: none;
  }
  .title-small-screen{
    display: block;
    font-size: xx-large;
  }
}
</style>
