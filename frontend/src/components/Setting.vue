<script setup lang="ts">
import { isMeteor } from '../App.vue';
import { setting_open } from './Modale.vue';
import Toggle from '@vueform/toggle';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { Post } from '@/services/requests';
import ax from '@/services/interceptors';

const userStore = useUserStore();
const { isTwoFactorAuth, isAuthenticated, loggedUser } = storeToRefs(userStore);
if (loggedUser.value && loggedUser.value.isTwoFactorAuthenticationEnabled) {
  isTwoFactorAuth.value = true;
} else {
  isTwoFactorAuth.value = false;
}
const qrcode = ref(null);
const twoFactorInput = ref('');
const turnOffForm = ref(false);

// Convert QR code image file stream from response to base64 string
function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// Generate 2FA QR code
function generate2FA() {
  ax({
    method: 'post',
    url: '/auth/generate-2fa',
    responseType: 'blob'
  }).then(res => {
    getBase64(res.data).then((data: any) => {
      qrcode.value = data;
    });
  });
}

// 2FA code validation handler
function validateCode() {
  Post('/auth/turn-2fa-on', {
    twoFactorAuthenticationCode: twoFactorInput.value
  }).then(res => {
    console.log(res);
    if (res.status === 201) {
      if (
        !isTwoFactorAuth.value &&
        loggedUser.value &&
        !loggedUser.value.isTwoFactorAuthenticationEnabled
      ) {
        loggedUser.value.isTwoFactorAuthenticationEnabled = true;
        isTwoFactorAuth.value = true;
      } else if (
        isTwoFactorAuth &&
        loggedUser.value &&
        loggedUser.value.isTwoFactorAuthenticationEnabled
      ) {
        loggedUser.value.isTwoFactorAuthenticationEnabled = false;
        isTwoFactorAuth.value = false;
      }
      qrcode.value = null;
      turnOffForm.value = false;
    } else {
      alert('Invalid 2FA code');
    }
    twoFactorInput.value = '';
  });
}

// 2FA option handler
function toggleTwoFactorAuthentication() {
  if (isTwoFactorAuth.value === true) {
    isTwoFactorAuth.value = false;
    generate2FA();
  } else {
    isTwoFactorAuth.value = true;
    console.log('2FA is false');
    turnOffForm.value = true;
  }
}
</script>

<template>
  <div class="btn-close-modale btn" @click="setting_open = false">
    <i class="fa-solid fa-xmark fa-2x"></i>
  </div>

  <!-- Avatar -->
  <img :src="loggedUser ? loggedUser.avatar : ''" alt="" width="150" />

  <!-- Menu title: settings or username  -->
  <h2 v-if="!loggedUser" style="margin: 0px 40px 20px"><b>Settings</b></h2>
  <h2 v-else style="margin: 0px 40px 20px">
    <b>{{ loggedUser.username }}</b>
  </h2>

  <!-- Meteor animation option -->
  <span class="element-set">
    Meteor:
    <Toggle
      v-model="isMeteor"
      on-label="On"
      off-label="Off"
      class="toggle-style"
    />
  </span>

  <!-- Update username -->

  <!-- 2FA option -->
  <span v-if="isAuthenticated" class="element-set">
    Two-Factor Authentication (2FA):
    <Toggle
      @change="toggleTwoFactorAuthentication"
      v-model="isTwoFactorAuth"
      on-label="On"
      off-label="Off"
      class="toggle-style"
    />
  </span>

  <!-- QR code if toggle 2FA on -->
  <div v-if="qrcode">
    <hr />
    <img :src="qrcode" alt="" width="150" />
    <button @click="generate2FA">Generate</button>
    <form @submit.prevent.trim.lazy="validateCode">
      Validate code to enable 2FA:
      <input v-model="twoFactorInput" type="text" />
      <button type="submit">Submit</button>
    </form>
  </div>

  <!-- 2FA validation if toggle off -->
  <div v-if="turnOffForm">
    <hr />
    <form @submit.prevent.trim.lazy="validateCode">
      Validate code to disable 2FA:
      <input v-model="twoFactorInput" type="text" />
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<style>
@import '@vueform/toggle/themes/default.css';

.toggle-style {
  --toggle-bg-on: var(--sidebar-icon-color);
  --toggle-border-on: var(--sidebar-icon-color);
  --toggle-ring-width: 0;
}

.element-set {
  margin-bottom: 10px;
  font-size: large;
}

.card {
  display: flex;
  align-items: center;
  width: 50rem;
  overflow: hidden;
}
</style>
