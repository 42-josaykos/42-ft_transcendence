<script setup lang="ts">
import UserCard from "./UserCard.vue";
import ModalChat from "./ModalChat.vue";

import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useChannelStore } from "@/stores/channel";
import type { User } from "@/models/user.model";
import type { Channel } from "@/models/channel.model";

const userStore = useUserStore();
const { usersOnline, loggedUser, socketChat } = storeToRefs(userStore);

const channelStore = useChannelStore();

const { allChannels, channel, usersMembers } = storeToRefs(channelStore);

const userClick = ref<User>();
const userClickBool = ref<boolean>(false);
const modalShowProfil = ref<boolean>(false);
const modalSendMessage = ref<boolean>(false);
const modalAddAdmin = ref<boolean>(false);
const modalRemoveAdmin = ref<boolean>(false);
const modalBan = ref<boolean>(false);
const modalMute = ref<boolean>(false);
const stringSendMessage = ref<string>("");

const isOnline = (userID: Number): boolean => {
  if (usersOnline.value.findIndex((el: Number) => el == userID) == -1) {
    return false;
  }
  return true;
};

// Créer un nouveau channel entre 2 users si n'existe pas encore et permet d'envoyer des messages privés
const sendDirectMessage = async () => {
  const name1 = `${userClick.value?.id} ${loggedUser.value?.id}`;
  const name2 = `${loggedUser.value?.id} ${userClick.value?.id}`;
  const channelItem = allChannels.value.find(
    (el: Channel) => el.name === name1 || el.name === name2
  );
  if (channelItem == undefined) {
    const newChannel = {
      name: `${userClick.value?.id} ${loggedUser.value?.id}`,
      isPrivate: true,
      password: null,
      owner: { id: loggedUser.value?.id },
      admins: [{ id: loggedUser.value?.id }, { id: userClick.value?.id }],
      members: [{ id: loggedUser.value?.id }, { id: userClick.value?.id }],
      isDirectChannel: true,
      isProtected: false,
    };
    socketChat.value?.emit(
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
    socketChat.value?.emit(
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
            BLOQUER => retirer de la liste d'ami??
          </button>
          <div
            v-if="channelStore.isAdmin(channel, loggedUser?.id) && !channelStore.isOwner(channel, userClick.id)"
            style="display: grid"
          >
            <button
              @click="modalMute = true"
              type="button"
              class="btn-user-click my-2"
            >
              MUTE
            </button>
            <button
              @click="modalBan = true"
              type="button"
              class="btn-user-click my-2"
            >
              BAN
            </button>
            <!-- voir pour les bans et mutes -->
            <button
              v-if="!channelStore.isAdmin(channel, userClick.id)"
              @click="modalAddAdmin = true"
              type="button"
              class="btn-user-click my-2"
            >
              ADD ADMIN
            </button>
            <button v-else
              @click="modalRemoveAdmin = true"
              type="button"
              class="btn-user-click my-2"
            >
              REMOVE ADMIN
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

  <ModalChat
    v-if="modalAddAdmin == true"
    @close="modalAddAdmin = false"
  >
    <template v-slot:header>
      <h2 style="padding-top: 10px">
        <u>Are you sure you want to add {{userClick?.username}} as an administrator of this channel</u>
      </h2>
    </template>
    <template v-slot:footer>
      <button
        @click="
          modalAddAdmin = false;
          socketChat.emit('updateMember', channel?.id, {addAdmins: [{id: userClick.id}]}, null, loggedUser)
        "
        type="button"
        class="mod-btn mod-btn-blue"
      >
        Yes
      </button>
      <button
        @click="modalAddAdmin = false"
        type="button"
        class="mod-btn mod-btn-yellow"
      >
        No
      </button>
    </template>
  </ModalChat>

  <ModalChat
    v-if="modalRemoveAdmin == true"
    @close="modalRemoveAdmin = false"
  >
    <template v-slot:header>
      <h2 style="padding-top: 10px">
        <u>Are you sure you want to remove {{userClick?.username}} as the administrator of this channel</u>
      </h2>
    </template>
    <template v-slot:footer>
      <button
        @click="
          modalRemoveAdmin = false;
          socketChat.emit('updateMember', channel?.id, {removeAdmins: [{id: userClick.id}]}, null, loggedUser)
        "
        type="button"
        class="mod-btn mod-btn-blue"
      >
        Yes
      </button>
      <button
        @click="modalRemoveAdmin = false"
        type="button"
        class="mod-btn mod-btn-yellow"
      >
        No
      </button>
    </template>
  </ModalChat>

  <!-- <ModalChat
    v-if="modalBan == true"
    @close="
      modalBan = false;
    "
  >
    <template v-slot:header>
      <h2 style="padding-top: 10px">
        <u>Mute :</u> {{ userClick?.username }}
      </h2>
    </template>
    <template v-slot:body>

        <div class="scrollspy-example2 card-choose-users">
          <div
            class="separator-list"
            v-for="item in channelLeave.members"
            :key="item.id"
          >
            <div
              v-if="item.id != loggedUser?.id"
              class="d-flex ms-auto"
              style="align-items: center"
            >
              <div class="ps-5">
                <p class="pt-3" style="">{{ item.username }}</p>
              </div>
              <div class="ms-auto">
                <button
                  @click="
                    modalBan = false;
                    // fonction qui update le Mute
                  "
                  type="button"
                  class="mod-btn mod-btn-cyan btn-sm"
                >
                  New Owner
                </button>
              </div>
            </div>
          </div>
        </div>

    </template>
    <template v-slot:footer>
      <button
        @click="
          modalBan = false;
        "
        type="button"
        class="mod-btn mod-btn-yellow"
      >
        Cancel
      </button>
    </template>
  </ModalChat> -->

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
