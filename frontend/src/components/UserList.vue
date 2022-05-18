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
  gameSocket,
  socketChat,
  setting_open,
  userClick,
  loggedUser,
  usersFriends,
  modaleOpenInviteGame,
  usersOnline,
} = storeToRefs(userStore);

const messageStore = useMessageStore();
const { modalSendMessage } = storeToRefs(messageStore);

const router = useRouter();

const users = ref<User[]>([]);

if (socketChat.value) {
  // Get all users at page startup
  socketChat.value.emit("getUsersByFilter", {});
  socketChat.value.on(
    "receiveFilteredUsers",
    (userList) => (users.value = userList)
  );

  // Get user friends
  socketChat.value.on("receiveFriends", (friendsList: User[]) => {
    usersFriends.value = friendsList;
  });
  socketChat.value.emit("getUserFriends", loggedUser.value);
}

// User list online without logged user
const userListOnline = computed(() => {
  return users.value.filter((value) => 
    usersOnline.value.findIndex((id) => id == value.id) != -1
  ).sort((a, b) => (a.username.toLowerCase() > b.username.toLowerCase()) ? 1 : -1)
});

// User list without logged user
const userListOffline = computed(() => {
  return users.value.filter((value) => 
    usersOnline.value.findIndex((id) => id == value.id) == -1
  ).sort((a, b) => (a.username.toLowerCase() > b.username.toLowerCase()) ? 1 : -1)
});
</script>

<template>
  <div class="infoGame scrollBar_invisible">
    <div class="cont">
      <div
        class="neon-typo pt-4"
        style="font-size: xx-large; font-weight: bold"
      >
        Players List
      </div>
      <hr />
      <br />
      <BtnUserList v-if="userListOnline.length > 0" :usersList="userListOnline" :isOffLine="false"/>
      <hr class="seperator-user-online-offline" v-if="userListOnline.length > 0 && userListOffline.length > 0"/>
      <BtnUserList v-if="userListOffline.length > 0" :usersList="userListOffline" :isOffLine="true"/>
    </div>
  </div>
</template>

<style scoped>

.scrollBar_invisible {
  scrollbar-width: none;
}

.scrollBar_invisible::-webkit-scrollbar {
  display: none;
}

.hovertext {
  position: relative;
  border-bottom: 1px dotted black;
}

.hovertext:before {
  content: attr(data-hover);
  visibility: hidden;
  opacity: 0;
  width: 140px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 5px 0;
  transition: opacity 1s ease-in-out;

  position: absolute;
  z-index: 1;
  left: 0;
  top: 110%;
}

.hovertext:hover:before {
  opacity: 1;
  visibility: visible;
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

th {
  white-space: nowrap;
  width: 40%;
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

.seperator-user-online-offline{
  margin-bottom: 10px !important;
  width: 150px !important;
}
</style>
