<script setup lang="ts">
import { isMeteor } from '../App.vue';
import { setting_open } from './Modale.vue';
import Toggle from '@vueform/toggle';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { Post } from '@/services/requests';
import { ref } from 'vue';
import Authenticate2fa from './Authenticate2fa.vue';
import axios from 'axios';

const userStore = useUserStore();
const { isTwoFactorAuth } = storeToRefs(userStore);
const authenticate2FaForm = ref(false);
const qrcode = ref();

function getBase64(file: any) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function toggleTwoFactorAuthentication() {
  if (isTwoFactorAuth.value === true) {
    isTwoFactorAuth.value = false;
    axios({
      method: 'post',
      url: '/auth/generate-2fa',
      responseType: 'blob'
    }).then(res => {
      console.log(res.data);
      getBase64(res.data).then((data: any) => {
        qrcode.value = data;
        console.log(data);
      });
    });
  } else {
    authenticate2FaForm.value = true;
    // isTwoFactorAuth.value = true;
  }
}
</script>

<template>
  <div class="btn-close-modale btn" @click="setting_open = false">
    <i class="fa-solid fa-xmark fa-2x"></i>
  </div>
  <h2 style="margin: 0px 40px 20px"><b>Settings</b></h2>
  <span class="element-set">
    Meteor:
    <Toggle
      v-model="isMeteor"
      on-label="On"
      off-label="Off"
      class="toggle-style"
    />
  </span>
  <span class="element-set">
    Two-Factor Authentication (2FA):
    <Toggle
      @change="toggleTwoFactorAuthentication"
      v-model="isTwoFactorAuth"
      on-label="On"
      off-label="Off"
      class="toggle-style"
    />
  </span>
  <img :src="qrcode" alt="" />
  <Authenticate2fa v-if="authenticate2FaForm" />
</template>

<style src="@vueform/toggle/themes/default.css"></style>
<style>
.toggle-style {
  --toggle-bg-on: var(--sidebar-icon-color);
  --toggle-border-on: var(--sidebar-icon-color);
  --toggle-ring-width: 0;
}

.element-set {
  margin-bottom: 10px;
  font-size: large;
}
</style>
