<script setup lang="ts">
import { ref } from 'vue';
import Setting from './Setting.vue';
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
const { loggedUser } = storeToRefs(useUserStore());

function getUserData() {
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
export const setting_open = ref(false);
export const logout_open = ref(false);
export const login_open = ref(false);
export const register_open = ref(false);
</script>

<template>
  <div class="bloc_modale" v-if="setting_open">
    <div class="overlay" @click="setting_open = !setting_open"></div>
    <div class="modale card">
      <Setting @updateUserProfil="getUserData" />
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
  <div class="bloc_modale" v-if="logout_open">
    <div class="overlay" @click="logout_open = !logout_open"></div>
    <div class="modale card">
      <div class="btn-close-modale btn" @click="logout_open = false">
        <i class="fa-solid fa-xmark fa-2x"></i>
      </div>
      <h2>
        Hey
        <b
          ><i>{{ loggedUser.username }}</i></b
        >,<br />Are you sure you want to logout?
      </h2>

      <span>
        <button
          class="mod-btn mod-btn-red"
          onclick="window.location.href='/auth/logout'"
        >
          Logout
        </button>
        <button class="mod-btn mod-btn-yellow" @click="logout_open = false">
          Cancel
        </button>
      </span>
    </div>
  </div>
</template>

<style>
@import url('../assets/modal.css');
.modale.card {
  overflow: hidden;
  max-height: fit-content;
}
</style>
