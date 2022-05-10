<script setup lang="ts">

import ModalMessage from "./chat/ModalMessage.vue";

import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useMessageStore } from "@/stores/message";
import { useRouter } from "vue-router";

// const router = useRouter();
const userStore = useUserStore();
const { loggedUser, socketChat, usersFriends, userClick, setting_open, modalFriends } = storeToRefs(userStore);

const messageStore = useMessageStore();
const { modalSendMessage } = storeToRefs(messageStore);

</script>

<template>
  <div v-if="usersFriends.length > 0">
    <div class="scrollspy-example2 card-choose-users">
      <div
        class="separator-list"
        v-for="user in usersFriends"
          :key="user.id"
        >
        <div
          class="d-flex"
          style="align-items: center"
        >
          <div class="px-3">
            <p class="pt-3" style="">{{ user.username }}</p>
          </div>
          <div class="ms-auto px-2" style="width: 500px;">
            <button
              @click="modalFriends = false; setting_open = true; userClick = user"
              type="button"
              class="mod-btn-friends mod-btn-green btn-sm"
            >
              Profil
            </button>
            <button
              @click="modalSendMessage = true;"
              type="button"
              class="mod-btn-friends mod-btn-cyan btn-sm"
            >
              Send message
            </button>
            <ModalMessage  v-if="modalSendMessage == true" :userClick="user"/>
            <button
              @click="userClick = user; /*router.push('/game')*/"
              type="button"
              class="mod-btn-friends mod-btn-yellow btn-sm"
            >
              Invite to play
            </button>
            <button
              @click="socketChat?.emit('removeUserFriend', user, {removeFriends: [{id: user.id}]}, loggedUser?.id)"
              type="button"
              class="mod-btn-friends mod-btn-red btn-sm"
            >
              Remove friend
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    No friends
  </div>
</template>

<style>

.mod-btn-friends {
  position: relative;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-size: x-large;
  border-radius: 10px;
  border: none;
  transition: 0.4s;
  margin: 5px 10px 5px;
}

</style>