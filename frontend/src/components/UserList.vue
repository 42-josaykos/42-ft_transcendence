<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { Get } from "@/services/requests";
import type { User } from "@/models/user.model";
import { useMessageStore } from "@/stores/message";
import UserCard from "./UserCard.vue";
import { computed } from "@vue/reactivity";
import BtnUserList from "./BtnUserList.vue";

// Stores
const userStore = useUserStore();
const {
  socketChat,
  setting_open,
  userClick,
  loggedUser,
  usersFriends,
  modaleOpenInviteGame,
  usersOnline,
  usersList,
} = storeToRefs(userStore);

const messageStore = useMessageStore();
const { modalSendMessage } = storeToRefs(messageStore);

const router = useRouter();

if (socketChat.value) {
  // Get all users at page startup
  socketChat.value.emit("getUsersByFilter", {});
  socketChat.value.emit("getUserFriends", loggedUser.value);
}

// User list online without logged user
const userListOnline = computed(() => {
  return usersList.value
    .filter(
      (value) => usersOnline.value.findIndex((id) => id == value.id) != -1
    )
    .sort((a, b) =>
      a.username.toLowerCase() > b.username.toLowerCase() ? 1 : -1
    );
});

// User list without logged user
const userListOffline = computed(() => {
  return usersList.value
    .filter(
      (value) => usersOnline.value.findIndex((id) => id == value.id) == -1
    )
    .sort((a, b) =>
      a.username.toLowerCase() > b.username.toLowerCase() ? 1 : -1
    );
});

</script>

<template>
  <div class="infoGame" style="overflow-y:hidden">
    <div class="cont">
      <div
        class="neon-typo pt-4"
        style="font-size: xx-large; font-weight: bold"
      >
        Players List
      </div>
      <hr style="margin-bottom: 20px;"/>
      <div class="scrollspy-example3">
        <BtnUserList v-if="userListOnline.length > 0" :usersList="userListOnline" :isOffLine="false"/>
        <BtnUserList v-if="userListOffline.length > 0" :usersList="userListOffline" :isOffLine="true"/>
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

p {
  margin-left: auto;
  margin-right: auto;
  width: 6em;
}

.neon-typo {
  color: #ffffff;
  text-shadow: 0px 4px 15px white, 0px 0px 10px white;
}

th {
  white-space: nowrap;
  width: 40%;
}

th {
  padding: 5px;
}

.cont {
  grid-area: 1 / 1;
}

.cont {
  z-index: 1;
}
</style>
