<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useMessageStore } from "@/stores/message";
import { useRouter } from "vue-router";
import type { User } from "@/models/user.model";
import UserCard from "./UserCard.vue";

// Props
const props = defineProps<{
  user: any;
}>();

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
  <div class="d-flex" style="align-items: center">
    <div class="px-3">
      <UserCard :user="props.user" :dashboard="true" :profile="false"/>
    </div>
    <div class="ms-auto px-2" style="width: 500px">
      <button
        @click="
          modalFriends = false;
          setting_open = true;
          userClick = props.user;
        "
        type="button"
        class="mod-btn-friends mod-btn-green btn-sm"
      >
        Profil
      </button>
      <button
        @click="
          modalFriends = false;
          modalSendMessage = true;
          userClick = props.user;
        "
        type="button"
        class="mod-btn-friends mod-btn-cyan btn-sm"
      >
        Send message
      </button>
      <button
        @click="
          modalFriends = false;
          userClick = props.user; /*router.push('/game')*/
        "
        type="button"
        class="mod-btn-friends mod-btn-yellow btn-sm"
      >
        Invite to play
      </button>
      <button
        @click="
          socketChat?.emit(
            'removeUserFriend',
            props.user,
            { removeFriends: [{ id: props.user.id }] },
            loggedUser?.id
          )
        "
        type="button"
        class="mod-btn-friends mod-btn-red btn-sm"
      >
        Remove friend
      </button>
    </div>
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
