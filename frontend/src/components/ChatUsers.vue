<script setup lang="ts">
import UserCard from "./UserCard.vue";
import ModalChat from "./ModalChat.vue";

import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useChannelStore } from "@/stores/channel";
import type { User } from "@/models/user.model";

const userStore = useUserStore();
const { usersOnline, loggedUser } = storeToRefs(userStore);

const channelStore = useChannelStore();

const { allChannels, channel, usersMembers } = storeToRefs(channelStore);

const userClick = ref<User>();
const userClickBool = ref<boolean>(false);
const modalShowProfil = ref<boolean>(false);
const modalSendMessage = ref<boolean>(false);
const stringSendMessage = ref<string>("");

const props = defineProps({
  socketChat: Object,
});

const isOnline = (userID: Number): boolean => {
  if (usersOnline.value.findIndex((el: Number) => el == userID) == -1) {
    return false;
  }
  return true;
};

// Créer un nouveau channel entre 2 users si n'existe pas encore et permet d'envoyer des messages privés
const sendDirectMessage = async () => {
  // const name1 = `${userDirectMessage.value?.username} ${loggedUser.value?.username}`;
  // const name2 = `${loggedUser.value?.username} ${userDirectMessage.value?.username}`;
  // const channelItem = allChannels.value.find((el: Channel) => el.name === name1 || el.name === name2);
  // if (channelItem == undefined) {
  //   const newChannel = {
  //     name: `${userDirectMessage.value?.username} ${loggedUser.value?.username}`,
  //     isPrivate: true,
  //     password: null,
  //     owner: { id: loggedUser.value?.id },
  //     admins: [{ id: loggedUser.value?.id }, {id: userDirectMessage.value?.id}],
  //     members: [{ id: loggedUser.value?.id }, {id: userDirectMessage.value?.id}],
  //     isDirectChannel: true,
  //     isProtected: false
  //   };
  //   socketChat.emit('newChannel', newChannel, {author: loggedUser.value?.id, channel: {id: null}, data: textDirectMsg.value}, loggedUser.value)
  // }
  // else {
  //   socketChat.emit('newMessage', {author: loggedUser.value?.id, channel: {id: channelItem?.id}, data: textDirectMsg.value}, loggedUser.value)
  //   textDirectMsg.value = '';
  // }

  const name1 = `${userClick.value.id} ${loggedUser.value?.id}`;
  const name2 = `${loggedUser.value?.id} ${userClick.value.id}`;
  console.log("name1 => ", name1);
  console.log("name2 => ", name2);
  const channelItem = allChannels.value.find(
    (el: Channel) => el.name === name1 || el.name === name2
  );
  console.log("channelItem => ", channelItem);
  if (channelItem == undefined) {
    const newChannel = {
      name: `${userClick.value.id} ${loggedUser.value?.id}`,
      isPrivate: true,
      password: null,
      owner: { id: loggedUser.value?.id },
      admins: [{ id: loggedUser.value?.id }, { id: userClick.value.id }],
      members: [{ id: loggedUser.value?.id }, { id: userClick.value.id }],
      isDirectChannel: true,
      isProtected: false,
    };
    console.log("newChannel => ", newChannel);
    props.socketChat.emit(
      "newChannel",
      newChannel,
      {
        author: loggedUser.value?.id,
        channel: { id: null },
        data: stringSendMessage.value,
      },
      loggedUser.value
    );
  } else {
    props.socketChat.emit(
      "newMessage",
      {
        author: loggedUser.value?.id,
        channel: { id: channelItem?.id },
        data: stringSendMessage.value,
      },
      loggedUser.value
    );
    stringSendMessage.value = "";
  }
};

const test = (user: User) => {
  console.log("USER => ", user);
};
</script>

<template>
  <div v-if="channel != undefined">
    <div v-if="usersMembers" class="ps-2">
      <div class="list-group" v-for="user in usersMembers" :key="user.id">
        <UserCard
          :user="user"
          :isOnline="isOnline(user.id)"
          @open="
            userClickBool = true;
            userClick = user;
          "
        />
      </div>
    </div>
  </div>

  <ModalChat v-if="userClickBool" @close="userClickBool = false">
    <template v-slot:header>
      <h2 style="padding-top: 10px">{{ userClick?.username }}</h2>
    </template>
    <template v-slot:body>
      <div style="display: grid">
        <button
          @click="modalShowProfil = true"
          type="button"
          class="btn-user-click my-2"
        >
          Profil
        </button>
        <div v-if="loggedUser?.id != userClick?.id" style="display: grid">
          <button
            @click="modalSendMessage = true"
            type="button"
            class="btn-user-click my-2"
          >
            Send message
          </button>
          <button type="button" class="btn-user-click my-2">
            ADD FRIEND => si pas encore ami
          </button>
          <button type="button" class="btn-user-click my-2">
            BLOQUER => retir de la liste d'ami??
          </button>
          <div
            v-if="channelStore.isAdmin(channel, loggedUser?.id)"
            style="display: grid"
          >
            <button type="button" class="btn-user-click my-2">
              MUET => si admin
            </button>
            <button type="button" class="btn-user-click my-2">
              BAN => si admin
            </button>
            <button type="button" class="btn-user-click my-2">
              ADD ADMIN => si admin
            </button>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <button
        @click="userClickBool = false"
        type="button"
        class="mod-btn mod-btn-yellow my-2"
      >
        Return
      </button>
    </template>
  </ModalChat>

  <ModalChat v-if="modalShowProfil" @close="modalShowProfil = false">
    <template v-slot:header>
      <h2 style="padding-top: 10px">{{ userClick?.username }}</h2>
    </template>
    <template v-slot:body> PAGE PROFIL </template>
    <template v-slot:footer>
      <button
        @click="modalShowProfil = false"
        type="button"
        class="mod-btn mod-btn-yellow"
      >
        Cancel
      </button>
    </template>
  </ModalChat>

  <ModalChat
    v-if="modalSendMessage"
    @close="
      modalSendMessage = false;
      stringSendMessage = '';
    "
  >
    <template v-slot:header>
      <h2 style="padding-top: 10px">{{ userClick?.username }}</h2>
    </template>

    <template v-slot:body>
      <textarea
        class="form-control"
        placeholder="Message"
        id="message"
        v-model="stringSendMessage"
      ></textarea>
      <label for="message" class="sr-only">Messgae</label>
    </template>

    <template v-slot:footer>
      <button
        @click="
          modalSendMessage = false;
          sendDirectMessage();
        "
        type="button"
        class="mod-btn mod-btn-blue"
      >
        Send Message
      </button>

      <button
        @click="
          modalSendMessage = false;
          stringSendMessage = '';
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
