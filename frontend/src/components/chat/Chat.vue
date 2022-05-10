<script setup lang="ts">
import { onBeforeMount, onUnmounted, ref } from 'vue';

import { storeToRefs } from 'pinia';

import { useUserStore } from '@/stores/user';
import { useChannelStore } from '@/stores/channel';

import { Get } from '@/services/requests';

import ChatMenu from './ChatMenu.vue';
import ChatUsers from './ChatUsers.vue';
import ChatMessages from './ChatMessages.vue';
import ModalChat from './ModalChat.vue';
import UsersFriends from '../UsersFriends.vue';
import Navbar from '../Navbar.vue';

const userStore = useUserStore();
const { isAuthenticated, loggedUser, socketChat, usersBlocked, usersFriends } =
  storeToRefs(userStore);

const channelStore = useChannelStore();
const { allChannels, newOwner, channelType } = storeToRefs(channelStore);

const modalError = ref<boolean>(false);
const modalFriends = ref<boolean>(false);
const msgError = ref<string>('');

onBeforeMount(async () => {
  Get(`/channels/search?&members&invites&bans&mutes`).then(res => {
    if (res.status == 200) {
      allChannels.value = res.data;
      if (loggedUser.value != undefined) {
        channelStore.updateInvite(loggedUser.value?.id);
        Get(
          `/users/search?id=${loggedUser.value?.id}&banChannels&muteChannels&blockedUsers&friends`
        ).then(res => {
          if (res.status == 200) {
            channelStore.updateBanMute(res.data);
            usersBlocked.value = res.data[0].blockedUsers;
            usersFriends.value = res.data[0].friends;
          }
        });
      }
    }
  });
  newOwner.value = undefined;
  channelType.value = 0;
});

onUnmounted(() => {
  socketChat.value?.off('newMessage');
  socketChat.value?.off('newChannel');
  socketChat.value?.off('deleteChannel');
  socketChat.value?.off('joinChannel');
  socketChat.value?.off('updateChannel');
  socketChat.value?.off('inviteChannel');
});

const removeAlert = () => {
  modalError.value = false;
  msgError.value = '';
};

const addAlert = (message: string) => {
  msgError.value = message;
  modalError.value = true;
  setTimeout(removeAlert, 5000);
};

if (socketChat.value != undefined) {
  socketChat.value.on('error', data => {
    addAlert(data.message);
  });
}
</script>

<template>
  <Navbar :isAuthenticated="isAuthenticated" :loggedUser="loggedUser" />
  <div class="container">
    <div class="row-chat">
      <div class="col-md-3 col-chat">
        <div class="scrollspy-example my-5 px-2 py-2" style="min-height: 80vh">
          <ChatMenu />
        </div>
      </div>
      <div class="col-md-5 col-chat ms-auto">
        <div class="" style="min-height: 90vh; width: 100%">
          <ChatMessages />
        </div>
      </div>

      <div class="col-md-3 col-chat ms-auto">
        <div class="horizontal-line-bottom">
          <div class="wrapper-btn-friends">
            <button
              @click="modalFriends = true"
              type="button"
              class="rounded btn-channel"
              style="color: var(--clr-neon) !important"
            >
              <i class="fa-solid fa-users fa-2x"></i>
            </button>
          </div>
        </div>
        <div class="scrollspy-example mb-5 px-2 py-2" style="min-height: 80vh">
          <ChatUsers />
        </div>
      </div>
    </div>
  </div>

  <ModalChat v-if="modalError == true" @close="modalError = false">
    <template v-slot:header>
      <h2 class="pt-4">
        <u>ERROR</u>
      </h2>
    </template>
    <template v-slot:body>
      <div>
        {{ msgError }}
      </div>
    </template>
  </ModalChat>

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
</template>

<style>
.chatMenu {
  flex: 2;
  text-align: center;
  margin-top: 10px;
}

.form {
  background: rgba(0, 0, 0, 0.15);
  padding: 0.25rem;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  box-sizing: border-box;
}

.input {
  border: none;
  padding: 0 1rem;
  flex-grow: 1;
  border-radius: 2rem;
  margin: 0.25rem;
}

.msg {
  list-style-type: none;
  border-radius: 2rem;
  margin-left: 10px;
  margin-right: 5px;
}

:root {
  --clr-neon: hsl(317 100% 54%);
  --clr-bg: hsl(323 21% 16%);
}

.padding-chat {
  padding: 1% !important;
  padding-top: 5% !important;
  padding-bottom: 5% !important;
}
.col-chat {
  min-height: 90vh;
  width: -webkit-fill-available;
  justify-content: center;
  text-decoration: none;
  border: white 3px solid;
  background-color: transparent;
  border-radius: 0.25em;
  text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3), 0 0 0.45em currentColor;
  box-shadow: inset 0 0 0.5em 0 white, 0 0 0.5em 0 white;
  transition: all 0.5s;
  border-radius: 50px !important;
}

.row-chat {
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 0;
  display: flex;
  flex-wrap: wrap;
}

.scrollspy-example {
  position: relative;
  height: 100px;
  margin-top: 0.5rem;
  overflow: auto;

  overflow-y: scroll;
  scrollbar-color: rgb(32, 31, 31) transparent;
  scrollbar-width: thin !important;
}

.scrollspy-example::-webkit-scrollbar {
  width: 8px;
}

.scrollspy-example::-webkit-scrollbar-track {
  background: transparent;
}

.scrollspy-example::-webkit-scrollbar-thumb {
  background-color: rgb(32, 31, 31);
  border-radius: 20px;
}

.scrollspy-example:hover {
  scrollbar-color: rgb(32, 31, 31) transparent;
  scrollbar-width: thin !important;
}

.horizontal-line-bottom {
  border-bottom: white 1.5px solid;
  display: block;
  height: 60px;
  text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3), 0 0 0.45em currentColor;
}

.horizontal-line-top {
  border-top: white 1.5px solid;
  display: block;
  max-height: 100px;
  text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3), 0 0 0.45em currentColor;

  background: rgba(0, 0, 0, 0.15);
  padding: 0.25rem;

  bottom: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;
}

.horizontal-line-center {
  margin: auto;
  border-top: white 1.5px solid;
  display: block;
  text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3), 0 0 0.45em currentColor;
  background: rgba(0, 0, 0, 0.15);
  padding: 0.25rem;
  bottom: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;
}

.chat-message-left,
.chat-message-right {
  display: flex;
}

.chat-message-left {
  margin-right: auto;
  border: #1a52ed 3px solid;
}

.chat-message-right {
  flex-direction: row-reverse;
  margin-left: auto;
  border: #3ded29 3px solid;
}

.chat-message-delete {
  margin: auto;
  border: #db810c 3px solid;
}

.timer {
  margin: auto;
  border: #ba0f1b 3px solid;
}

.text-msg-left .font-weight-bold {
  color: #1a52ed;
  text-align: start;
}
.text-msg-left {
  color: white;
  padding: 10px;
}

.text-msg-right .font-weight-bold {
  color: #3ded29;
  text-align: end;
}
.text-msg-right {
  color: white;
  padding: 10px;
}

.wrapper-btn-friends {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
}

@media (min-width: 950px) {
  .my-col-sm-3 {
    flex: 0 0 auto !important;
    width: 16.66666667% !important;
  }
}
@media (min-width: 950px) {
  .my-col-sm-5 {
    flex: 0 0 auto !important;
    width: 58.33333333%;
  }
}
</style>
