<script setup lang="ts">

import UserCard from './UserCard.vue'
import ModalChat from './ModalChat.vue'

import { ref } from 'vue';
import { storeToRefs} from 'pinia';
import { useUserStore } from '@/stores/user';
import { useChannelStore } from '@/stores/channel';
import type { User } from '@/models/user.model';

const userStore = useUserStore()
const {usersOnline, isAuthenticated, loggedUser, users} = storeToRefs(userStore)

const channelStore = useChannelStore();

const { allChannels,
  channel,
  usersMembers,
} = storeToRefs(channelStore);

const userClick = ref<User>()
const userClickBool = ref<boolean>(false)
const modalShowProfil = ref<boolean>(false)

const isOnline = (userID: Number):boolean => {
  if (usersOnline.value.findIndex((el: Number) => el == userID) == -1) {
    return false
  }
  return true
}

const test = (user: User) => {
  console.log("USER => ", user)
}

</script>


<template>

  <div v-if="channel != undefined">
    <div v-if="usersMembers" class="ps-2">
      <div class="list-group" v-for="user in usersMembers" :key="user.id">
        <UserCard :user="user" :isOnline="isOnline(user.id)" @open="userClickBool = true; userClick = user"/>
      </div>
    </div>
  </div>

  <ModalChat v-if="userClickBool" @close="userClickBool = false">
    <template v-slot:header>
      <h2 style="padding-top: 10px;">{{userClick?.username}}</h2>
    </template>
    <template v-slot:body>
      <div style="display: grid;">
        <button @click="modalShowProfil = true" type="button" class="btn-user-click my-2">
          Profil
        </button>
        <div v-if="loggedUser?.id != userClick?.id"  style="display: grid;">
          <button type="button" class="btn-user-click my-2">
            SEND MESSAGE
          </button>
          <button type="button" class="btn-user-click my-2">
            ADD FRIEND => si pas encore ami
          </button>
          <button type="button" class="btn-user-click my-2">
            BLOQUER => retir de la liste d'ami??
          </button>
          <div v-if="channelStore.isAdmin(channel, loggedUser?.id)"  style="display: grid;">
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
      <button @click="userClickBool  = false" type="button" class="mod-btn mod-btn-yellow  my-2">Return</button>
    </template>
  </ModalChat>

</template>

<style>
.btn-user-click{
  background-color: transparent;
  color: #6c757d;
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

