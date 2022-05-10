<script setup lang="ts">
import UserCard from "../UserCard.vue";
import ModalChat from "./ModalChat.vue";
import ModalMessage from "./ModalMessage.vue";

import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useChannelStore } from "@/stores/channel";
import { useMessageStore } from "@/stores/message";
import type { User } from "@/models/user.model";
import { computed } from "@vue/reactivity";
import { useRouter } from "vue-router";

const router = useRouter();

const userStore = useUserStore();
const { loggedUser, socketChat, usersOnline, userClick, setting_open } = storeToRefs(userStore);

const channelStore = useChannelStore();

const { channel, usersMembers, arrayTime } = storeToRefs(channelStore);

const messageStore = useMessageStore();
const { stringSendMessage, modalSendMessage } = storeToRefs(messageStore);

// const userClick = ref<User>();
const userClickBool = ref<boolean>(false);
const modalShowProfil = ref<boolean>(false);
const modalAdmin = ref<boolean>(false);
const modalBan = ref<boolean>(false);
const modalMute = ref<boolean>(false);
const modalBlock = ref<boolean>(false);
const modalFriend = ref<boolean>(false);
const inputTime = ref<string>("");

const addBanMute = (boolBan: Boolean) => {
  if (boolBan) {
    if (inputTime.value === arrayTime.value[arrayTime.value.length - 1]) {
      socketChat.value?.emit('updateMember', channel.value?.id, {addBans: [{user: {id: userClick.value?.id}}]}, null, loggedUser)
    }
    else {
      socketChat.value?.emit('updateMember', channel.value?.id, {addBans: [{user: {id: userClick.value?.id}, time: inputTime.value}]}, null, loggedUser)
    }
  }
  else {
    if (inputTime.value === arrayTime.value[arrayTime.value.length - 1]) {
      socketChat.value?.emit('updateMember', channel.value?.id, {addMutes: [{user: {id: userClick.value?.id}}]}, null, loggedUser)
    }
    else {
      socketChat.value?.emit('updateMember', channel.value?.id, {addMutes: [{user: {id: userClick.value?.id}, time: inputTime.value}]}, null, loggedUser)
    }
  }
  inputTime.value = ''
  userClick.value = undefined
}

const removeBanMute = (boolBan: Boolean) => {
  if (boolBan) {
      socketChat.value?.emit('updateMember', channel.value?.id, {removeBans: [{user: {id: userClick.value?.id}}]}, null, loggedUser)
  }
  else {
      socketChat.value?.emit('updateMember', channel.value?.id, {removeMutes: [{user: {id: userClick.value?.id}}]}, null, loggedUser)
  }
  userClick.value = undefined
}

const isOnline = (user: User) => {
  if (usersOnline.value.findIndex((el: Number) => el == user.id) == -1) {
    return false;
  }
  return true;
};

const numberUsersOnline = computed(() => {
  let totalOnline = 0;
  for (const user of usersMembers.value) {
    if (usersOnline.value.findIndex((el) => el === user.id) != -1 && !channelStore.isBan(channel.value, user.id)) {
      totalOnline++;
    }
  }
  return totalOnline.toString()
})

const numberUsersOffline = computed(() => {
  let totalOffline = 0;
  for (const user of usersMembers.value) {
    if (usersOnline.value.findIndex((el) => el === user.id) == -1 && !channelStore.isBan(channel.value, user.id)) {
      totalOffline++;
    }
  }
  return totalOffline.toString()
})

const numberUsersBan = computed(() => {
  let totalBan = 0;
  for (const user of usersMembers.value) {
    if (channelStore.isBan(channel.value, user.id)) {
      totalBan++;
    }
  }
  return totalBan.toString()
})

const addAdmin = () => {
  if (channelStore.isBan(channel.value, userClick.value?.id) && channelStore.isMute(channel.value, userClick.value?.id)) {
    socketChat.value?.emit('updateMember',
      channel.value?.id,
      {addAdmins: [{id: userClick.value?.id}], removeBans: [{user: {id: userClick.value?.id}}], removeMutes: [{user: {id: userClick.value?.id}}]},
      null,
      loggedUser.value
    )
  }
  else if (channelStore.isBan(channel.value, userClick.value?.id) && !channelStore.isMute(channel.value, userClick.value?.id)) {
    socketChat.value?.emit('updateMember',
      channel.value?.id,
      {addAdmins: [{id: userClick.value?.id}], removeBans: [{user: {id: userClick.value?.id}}]},
      null,
      loggedUser.value
    )
  }
  else if (!channelStore.isBan(channel.value, userClick.value?.id) && channelStore.isMute(channel.value, userClick.value?.id)) {
    socketChat.value?.emit('updateMember',
      channel.value?.id,
      {addAdmins: [{id: userClick.value?.id}], removeMutes: [{user: {id: userClick.value?.id}}]},
      null,
      loggedUser.value
    )
  }
  else {
    socketChat.value?.emit('updateMember',
      channel.value?.id,
      {addAdmins: [{id: userClick.value?.id}]},
      null,
      loggedUser.value
    )
  }
  userClick.value = undefined
}

</script>

<template>
  <div v-if="channel != undefined">
    <div v-if="usersMembers" class="ps-2">
      <span class="d-flex mb-3">
        <span class="horizontal-line-center"></span>
          Online - {{numberUsersOnline}}
        <span class="horizontal-line-center"></span>
      </span>
      <span v-for="user in usersMembers" :key="user.id">
        <div v-if="isOnline(user) && !channelStore.isBan(channel, user.id)" class="list-group">
          <UserCard
            :user="user"
            @open="
              userClickBool = true;
              userClick = user;
            "
          />
        </div>
      </span>
      <span class="d-flex my-3">
        <span class="horizontal-line-center"></span>
          Offline - {{numberUsersOffline}}
        <span class="horizontal-line-center"></span>
      </span>
      <span v-for="user in usersMembers" :key="user.id">
        <div v-if="!isOnline(user) && !channelStore.isBan(channel, user.id)" class="list-group">
          <UserCard
            :user="user"
            @open="
              userClickBool = true;
              userClick = user;
            "
          />
        </div>
      </span>
      <span class="d-flex my-3">
        <span class="horizontal-line-center"></span>
          Ban - {{numberUsersBan}}
        <span class="horizontal-line-center"></span>
      </span>
      <span v-for="user in usersMembers" :key="user.id">
        <div v-if="channelStore.isBan(channel, user.id)" class="list-group">
          <UserCard
            :user="user"
            @open="
              userClickBool = true;
              userClick = user;
            "
          />
        </div>
      </span>
    </div>
  </div>

  <ModalChat v-if="userClickBool" @close="userClickBool = false; userClick = undefined">
    <template v-slot:header>
      <h2 class="pt-4">{{ userClick?.username }}</h2>
    </template>
    <template v-slot:body>
      <div style="display: grid">
        <button
          @click="setting_open = true; userClickBool = false;"
          type="button"
          class="btn-user-click my-2"
        >
          PROFIL
        </button>
        <div v-if="loggedUser?.id != userClick?.id" style="display: grid">
          <button
            @click="modalSendMessage = true; userClickBool = false"
            type="button"
            class="btn-user-click my-2"
          >
            SEND MESSAGE
          </button>
            <button
              @click="userClickBool = false; router.push('/game')"
              type="button"
              class="btn-user-click my-2"
            >
              INVITE TO PLAY
            </button>
          <button
            @click="modalFriend = true; userClickBool = false"
            type="button" class="btn-user-click my-2">
            {{userStore.isFriend(userClick) ? 'REMOVE FRIEND' : 'ADD FRIEND'}}
          </button>
          <button
            @click="modalBlock = true; userClickBool = false"
            type="button" class="btn-user-click my-2">
            {{userStore.isBlocked(userClick) ? 'UNBLOCK' : 'BLOCK'}}
          </button>
          <div
            v-if="channelStore.isAdmin(channel, loggedUser?.id) && !channelStore.isAdmin(channel, userClick?.id)"
            style="display: grid"
          >
            <button
              @click="modalMute = true; userClickBool = false"
              type="button"
              class="btn-user-click my-2"
            >
              MUTE
            </button>
            <button
              @click="modalBan = true; userClickBool = false"
              type="button"
              class="btn-user-click my-2"
            >
              BAN
            </button>
          </div>
          <div
            v-if="channelStore.isOwner(channel, loggedUser?.id) && !channel?.isDirectChannel"
            style="display: grid"
          >
            <button
              @click="modalAdmin = true; userClickBool = false"
              type="button"
              class="btn-user-click my-2"
            >
              {{ channelStore.isAdmin(channel, userClick?.id) ? 'REMOVE ADMIN' : 'ADD ADMIN'}}
            </button>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <button
        @click="userClickBool = false; userClick = undefined"
        type="button"
        class="mod-btn mod-btn-yellow my-2"
      >
        Return
      </button>
    </template>
  </ModalChat>

  <ModalChat v-if="modalShowProfil" @close="modalShowProfil = false; userClick = undefined">
    <template v-slot:header>
      <h2 class="pt-4">{{ userClick?.username }}</h2>
    </template>
    <template v-slot:body> PAGE PROFIL </template>
    <template v-slot:footer>
      <button
        @click="modalShowProfil = false; userClick = undefined"
        type="button"
        class="mod-btn mod-btn-yellow"
      >
        Cancel
      </button>
    </template>
  </ModalChat>

  <ModalMessage  v-if="modalSendMessage == true" :userClick="userClick"/>

  <ModalChat
    v-if="modalBlock == true"
    @close="modalBlock = false; userClick = undefined"
  >
    <template v-slot:header>
      <h2 class="pt-4">
      <span v-if="userStore.isBlocked(userClick)">
        <u>Are you sure you want to unblock {{userClick?.username}} ?</u>
      </span>
      <span v-else>
        <u>Are you sure you want to block {{userClick?.username}} ?</u>
      </span>
      </h2>
    </template>
    <template v-slot:footer>
      <button
        @click="if (userStore.isBlocked(userClick)) {
          socketChat?.emit('removeUserBlocked', userClick, {removeBlockedUsers: [{id: userClick?.id}]}, loggedUser?.id)
        } else {
          socketChat?.emit('addUserBlocked', userClick, {addBlockedUsers: [{id: userClick?.id}]}, loggedUser?.id)
        }
        modalBlock = false; userClick = undefined
        "
        type="button"
        class="mod-btn mod-btn-blue"
      >
        Yes
      </button>
      <button
        @click="modalBlock = false; userClick = undefined"
        type="button"
        class="mod-btn mod-btn-yellow"
      >
        No
      </button>
    </template>
  </ModalChat>

  <ModalChat
    v-if="modalFriend == true"
    @close="modalFriend = false; userClick = undefined"
  >
    <template v-slot:header>
      <h2 class="pt-4">
      <span v-if="userStore.isFriend(userClick)">
        <u>Are you sure you want to remove {{userClick?.username}} from your friends ?</u>
      </span>
      <span v-else>
        <u>Are you sure you want to add {{userClick?.username}} as a friend ?</u>
      </span>
      </h2>
    </template>
    <template v-slot:footer>
      <button
        @click="if (userStore.isFriend(userClick)) {
          socketChat?.emit('removeUserFriend', userClick, {removeFriends: [{id: userClick?.id}]}, loggedUser?.id)
        } else {
          socketChat?.emit('addUserFriend', userClick, {addFriends: [{id: userClick?.id}]}, loggedUser?.id)
        }
        modalFriend = false; userClick = undefined
        "
        type="button"
        class="mod-btn mod-btn-blue"
      >
        Yes
      </button>
      <button
        @click="modalFriend = false; userClick = undefined"
        type="button"
        class="mod-btn mod-btn-yellow"
      >
        No
      </button>
    </template>
  </ModalChat>

  <ModalChat
    v-if="modalAdmin == true"
    @close="modalAdmin = false; userClick = undefined"
  >
    <template v-slot:header>
      <h2 class="pt-4">
      <span v-if="channelStore.isAdmin(channel, userClick?.id)">
        <u>Are you sure you want to remove {{userClick?.username}} as the administrator of this channel ?</u>
      </span>
      <span v-else>
        <u>Are you sure you want to add {{userClick?.username}} as an administrator of this channel ?</u>
      </span>
      </h2>
    </template>
    <template v-slot:footer>
      <button
        @click="if (channelStore.isAdmin(channel, userClick?.id)) {   
          socketChat?.emit('updateMember', channel?.id, {removeAdmins: [{id: userClick?.id}]}, null, loggedUser)
        } else {
          addAdmin()
        }
        modalAdmin = false;
        "
        type="button"
        class="mod-btn mod-btn-blue"
      >
        Yes
      </button>
      <button
        @click="modalAdmin = false; userClick = undefined"
        type="button"
        class="mod-btn mod-btn-yellow"
      >
        No
      </button>
    </template>
  </ModalChat>

  <ModalChat
    v-if="modalBan == true"
    @close="
      modalBan = false; userClick = undefined
    "
  >
    <template v-slot:header>
      <h2 class="pt-4">
        <u>Ban :</u> {{ userClick?.username }}
      </h2>
    </template>
    <template v-slot:body>
      <div v-if="!channelStore.isBan(channel, userClick?.id)" class="scrollspy-example2 card-choose-users">
        <div
          class="separator-list"
          v-for="time in arrayTime"
        >
          <div class="m-auto">
            <button
              @click="
                modalBan = false;
                inputTime = time;
                addBanMute(true)
              "
              type="button"
              class="mod-btn mod-btn-cyan btn-sm"
            >
              {{ time }}
            </button>
          </div>
        </div>
      </div>
      <div v-else>
        <button
          @click="
            modalBan = false;
            removeBanMute(true)
          "
          type="button"
          class="mod-btn mod-btn-cyan btn-sm"
        >
          Remove ban
        </button>
      </div>
    </template>
    <template v-slot:footer>
      <button
        @click="
          modalBan = false; userClick = undefined;
        "
        type="button"
        class="mod-btn mod-btn-yellow"
      >
        Cancel
      </button>
    </template>
  </ModalChat>

  <ModalChat
    v-if="modalMute == true"
    @close="
      modalMute = false; userClick = undefined
    "
  >
    <template v-slot:header>
      <h2 class="pt-4">
        <u>Mute :</u> {{ userClick?.username }}
      </h2>
    </template>
    <template v-slot:body>
      <div v-if="!channelStore.isMute(channel, userClick?.id)" class="scrollspy-example2 card-choose-users">
        <div
          class="separator-list"
          v-for="time in arrayTime"
        >
          <div class="m-auto">
            <button
              @click="
                modalMute= false;
                inputTime = time;
                addBanMute(false)
              "
              type="button"
              class="mod-btn mod-btn-cyan btn-sm"
            >
              {{ time }}
            </button>
          </div>
        </div>
      </div>
      <div v-else>
        <button
          @click="
            modalMute = false;
            removeBanMute(false)
          "
          type="button"
          class="mod-btn mod-btn-cyan btn-sm"
        >
          Remove mute
        </button>
      </div>
    </template>
    <template v-slot:footer>
      <button
        @click="
          modalMute = false; userClick = undefined
        "
        type="button"
        class="mod-btn mod-btn-yellow"
      >
        Cancel
      </button>
    </template>
  </ModalChat>

</template>

<style>
.btn-user-click {
  background-color: transparent;
  color: #c4c4c4;
  box-shadow: 0px 0px 10px 2px #0000ff;
  position: relative;
  border-radius: 10px;
  border: none;
  transition: 0.4s;
  margin: 5px 15px 5px;
}

.btn-user-click:hover {
  transform: scale(1.1);
  box-shadow: 0px 0px 10px #0000ff, 0px 0px 15px 5px #0000ff;
}
</style>
