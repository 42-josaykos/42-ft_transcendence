<script setup lang="ts">
import { ref } from 'vue';
import Profil from './Profil.vue';
import Login from './Login.vue';
import Register from './Register.vue';
import { useMessageStore } from '@/stores/message';
import { useChannelStore } from '@/stores/channel';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { Get } from '@/services/requests';

defineProps<{
  isAuthenticated: boolean;
  loggedUser: any;
}>();

const { messages } = storeToRefs(useMessageStore());
const { channel, usersMembers } = storeToRefs(useChannelStore());
const { setting_open, userClick, loggedUser, isMyProfile } = storeToRefs(
  useUserStore()
);

async function getUserData() {
  if (isMyProfile) {
    userClick.value = loggedUser.value;
  }
  if (channel.value) {
    Get(
      '/channels/search?id=' +
        channel.value.id.toString() +
        '&messages&owner&admins&members&mutes&bans'
    ).then(res => {
      channel.value = res.data[0];
      messages.value = res.data[0].messages;
      usersMembers.value = res.data[0].members;
    });
  }
}
</script>

<script lang="ts">
export const login_open = ref(false);
export const register_open = ref(false);
</script>

<template>
  <div class="bloc_modale" v-if="setting_open">
    <div class="overlay" @click="setting_open = !setting_open"></div>
    <div
      class="modale card scrollspy-profil"
      style="min-width: 40vw; max-width: 75%; overflow: scroll"
    >
      <Profil @updateUserProfil="getUserData" />
    </div>
  </div>
  <div class="bloc_modale" v-if="register_open && !isAuthenticated">
    <div class="overlay" @click="register_open = !register_open"></div>
    <div class="modale card">
      <Register />
    </div>
  </div>
  <div class="bloc_modale" v-if="login_open && !isAuthenticated">
    <div class="overlay" @click="login_open = !login_open"></div>
    <div class="modale card">
      <Login />
    </div>
  </div>
</template>

<style>
@import url('../assets/modal.css');

.scrollspy-profil {
  position: relative;
  margin-top: 0.5rem;
  overflow: auto;

  overflow-y: scroll;
  scrollbar-color: rgb(32, 31, 31) transparent;
  scrollbar-width: thin !important;
}

.scrollspy-profil::-webkit-scrollbar {
  width: 8px;
}

.scrollspy-profil::-webkit-scrollbar-track {
  background: transparent;
}

.scrollspy-profil::-webkit-scrollbar-thumb {
  background-color: rgb(32, 31, 31);
  border-radius: 20px;
}

.scrollspy-profil:hover {
  scrollbar-color: rgb(32, 31, 31) transparent;
  scrollbar-width: thin !important;
}
</style>
