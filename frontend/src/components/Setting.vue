<script setup lang="ts">
import { isMeteor } from '../App.vue';
// import { setting_open } from './Modale.vue';
import Toggle from '@vueform/toggle';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { Get, Patch, Post } from '@/services/requests';
import ax from '@/services/interceptors';
import type { User } from '@/models/user.model';

const userStore = useUserStore();
const { isTwoFactorAuth, isAuthenticated, loggedUser } = storeToRefs(userStore);
if (loggedUser.value && loggedUser.value.isTwoFactorAuthenticationEnabled) {
  isTwoFactorAuth.value = true;
} else {
  isTwoFactorAuth.value = false;
}
const qrcode = ref(null);
const twoFactorInput = ref('');
const usernameInput = ref('');
const turnOffForm = ref(false);
const error = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const emit = defineEmits<{
  (e: 'updateUserProfil'): void;
}>();

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
    turnOffForm.value = true;
  }
}

// Update username
function updateUsername() {
  if (usernameInput.value) {
    Patch(`/users/${loggedUser.value?.id}`, {
      username: usernameInput.value
    }).then(res => {
      if (res.status === 200) {
        if (loggedUser.value) {
          let updatedUser: User = { ...loggedUser.value };
          updatedUser.username = res.data.username;
          loggedUser.value = updatedUser;
          usernameInput.value = '';
          emit('updateUserProfil');
        }
      } else {
        error.value = true;
        setTimeout(() => {
          error.value = false;
        }, 5000);
      }
    });
  }
}

async function updateAvatar(event: any) {
  if (fileInput.value !== null) {
    const file = fileInput.value.files?.item(0);
    if (file) {
      let formData = new FormData();
      formData.append('avatarUpload', file);
      let response;
      try {
        response = await ax.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (response.status === 201) {
          Patch(`/users/${loggedUser.value?.id}`, {
            avatar: response.data.path
          }).then(res => {
            if (res.status === 200) {
              if (loggedUser.value) {
                loggedUser.value.avatar = res.data.avatar;
                fileInput.value = null;
                emit('updateUserProfil');
              }
            }
          });
        }
      } catch (er: any) {
        alert(er.response.data.message);
      }
    }
  }
}

async function logoutUser() {
  Get('/auth/logout').then(res => {
    loggedUser.value = null;
    isAuthenticated.value = false;
  });
}
</script>

<template>
  <div style="text-align: left">
    <b><u>Cosmetic Setting:</u></b>
  </div>
  <!-- Meteor animation option -->
  <span class="element-set">
    <div class="container">
      <div class="row">
        <div class="col-md-9 p-0 text-md-start" style="font-size: medium">
          Activate Meteor:
        </div>
        <div class="col-md-3">
          <Toggle
            v-model="isMeteor"
            on-label="On"
            off-label="Off"
            class="toggle-style"
          />
        </div>
      </div>
    </div>
  </span>

  <hr />
  <div style="text-align: left">
    <b><u>Profil Settings:</u></b>
  </div>
  <form @submit.prevent="updateAvatar">
    <div class="container">
      <div class="row">
        <div class="col-md-9 p-0 text-md-start" style="font-size: medium">
          Change Avatar:
        </div>
        <div class="col-md-3 p-0">
          <div class="container p-0">
            <div class="row">
              <div class="col-6">
                <input
                  type="file"
                  accept="image/*"
                  id="file"
                  ref="fileInput"
                  class="input-file"
                />

                <label for="file" class="label-file"
                  ><i class="fa-solid fa-upload fa-lg"></i
                ></label>
              </div>
              <div class="col-6">
                <button type="submit" class="submit-btn">
                  <i class="fa-solid fa-circle-check fa-lg"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>

  <br />

  <!-- Update username -->
  <div class="container">
    <div class="row">
      <div class="col-md-9 p-0 text-md-start" style="font-size: medium">
        Change Username:
      </div>
      <div class="col-md-3 p-0">
        <form @submit.prevent.trim.lazy="updateUsername">
          <div class="container p-0">
            <div class="row">
              <div class="col-10 p-0">
                <input
                  v-model="usernameInput"
                  name="username"
                  type="text"
                  style="width: 100%"
                  placeholder="UserName"
                />
              </div>
              <div class="col-2 p-0">
                <button type="submit" class="submit-btn">
                  <i class="fa-solid fa-circle-check fa-lg"></i>
                </button>
              </div>
            </div>
          </div>
          <!-- <label for="username">Username: </label> -->
        </form>
      </div>
    </div>
  </div>

  <hr />
  <div>
    <div style="text-align: left">
      <b><u>Security Settings:</u></b>
    </div>
    <!-- 2FA option -->
    <div class="container">
      <div class="row">
        <div class="col-md-9 p-0 text-md-start" style="font-size: medium">
          Two-Factor Authentication (2FA):
        </div>
        <div class="col-md-3 p-0">
          <Toggle
            @change="toggleTwoFactorAuthentication"
            v-model="isTwoFactorAuth"
            on-label="On"
            off-label="Off"
            class="toggle-style"
          />
        </div>
      </div>
    </div>
    <span class="element-set"> </span>

    <!-- QR code if toggle 2FA on -->
    <div v-if="qrcode">
      <hr />
      <div class="text-md-start p-1" style="font-size: medium">
        Scan QRCode, and validate code to enable 2FA:
      </div>
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <img :src="qrcode" alt="" width="150" />
          </div>
          <div class="col-md-6">
            <div class="d-none d-md-block"><br /></div>
            <br />
            Refresh QRCode:
            <button
              class="submit-btn"
              style="font-size: medium"
              @click="generate2FA"
            >
              <i class="fa-solid fa-arrows-rotate fa-2xl"></i>
            </button>
          </div>
        </div>
      </div>
      <br />

      <form @submit.prevent.trim.lazy="validateCode">
        <div class="container p-0">
          <div class="row">
            <div class="col-10 p-0">
              <input
                v-model="twoFactorInput"
                style="width: 100%"
                type="text"
                placeholder="2FA Code"
              />
            </div>
            <div class="col-2 p-0">
              <button type="submit" class="submit-btn">
                <i class="fa-solid fa-circle-check fa-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>

    <!-- 2FA validation if toggle off -->
    <div v-if="turnOffForm">
      <hr />
      <form @submit.prevent.trim.lazy="validateCode">
        Validate code to disable 2FA:
        <input v-model="twoFactorInput" type="text" />
        <button type="submit" class="submit-btn">
          <i class="fa-solid fa-circle-check fa-lg"></i>
        </button>
      </form>
    </div>
  </div>
  <hr class="d-md-none" />
  <button
    class="mod-btn mod-btn-red d-md-none d-inline-block"
    @click="logoutUser"
  >
    Logout
  </button>
</template>

<style>
@import '@vueform/toggle/themes/default.css';

.submit-btn {
  border: none;
  background: rgba(0, 0, 0, 0);
  color: var(--sidebar-icon-color);
  transition: 0.4s;
}

.submit-btn:hover {
  color: #1c4e8b;
  transform: scale(1.2);
}

.label-file {
  cursor: pointer;
  color: var(--sidebar-icon-color);
  transition: 0.4s;
}
.label-file:hover {
  color: #1c4e8b;
  transform: scale(1.2);
}

.input-file {
  display: none;
}

input {
  text-align: center;
}

.neon-typo {
  color: #ffffff;
  text-shadow: 0px 4px 15px #fff961, 0px 0px 10px #fff961;
}

.userName {
  font-size: x-large;
}

.toggle-style {
  --toggle-bg-on: var(--sidebar-icon-color);
  --toggle-border-on: var(--sidebar-icon-color);
  --toggle-bg-off: rgb(187, 187, 187);
  --toggle-border-off: rgb(187, 187, 187);
  --toggle-ring-width: 0;
}

.element-set {
  margin-bottom: 10px;
  font-size: large;
}

.carde {
  display: flex;
  align-items: center;
  width: 50rem;
  overflow: hidden;
}
</style>
