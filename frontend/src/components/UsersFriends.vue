<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useMessageStore } from "@/stores/message";
import { useRouter } from "vue-router";
import UserActions from "./UserActions.vue";

// const router = useRouter();
const userStore = useUserStore();
const {
  loggedUser,
  socketChat,
  usersFriends,
  userClick,
  setting_open,
  modalFriends,
} = storeToRefs(userStore);

const messageStore = useMessageStore();
const { modalSendMessage } = storeToRefs(messageStore);
</script>

<template>
  <div v-if="usersFriends.length > 0">
    <div class="scrollspy-example2 card-choose-users">
      <div class="separator-list" v-for="user in usersFriends" :key="user.id">
        <UserActions :user="user" />
      </div>
    </div>
  </div>
  <div v-else>No friends</div>
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
