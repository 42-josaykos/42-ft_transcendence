<script setup lang="ts">
// import { setting_open } from './Modale.vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import Setting from './Setting.vue';
import Stats from './profile/Stats.vue';
import Match_History from './profile/MatchHistory.vue';

const userStore = useUserStore();
const { loggedUser, setting_open, userClick, isMyProfile } =
  storeToRefs(userStore);

const stat_open = ref(true);
const mh_open = ref(false);
const set_open = ref(false);

const emits = defineEmits(['updateUserProfil']);
</script>

<template>
  <h2>
    <b><u>Profil</u></b>
  </h2>
  <div
    class="btn-close-modale btn me-3 mt-2"
    @click="
      setting_open = false;
      userClick = undefined;
    "
  >
    <i class="fa-solid fa-xmark fa-2x"></i>
  </div>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-4 me-2">
        <div class="sticky-md-top" style="top: 17%">
          <!-- Avatar -->
          <img
            class="circular--square icon_navbar"
            style="width: 120px; height: 120px; object-fit: cover"
            v-bind:src="userClick?.avatar"
            alt="Avatar"
          />
          <!-- UserName -->
          <div class="userName neon-typo">
            <b>{{ userClick ? userClick.username : loggedUser?.username }}</b>
          </div>
          <!-- Logout Button -->
          <div v-if="isMyProfile" class="d-flex justify-content-center">
            <button
              class="mod-btn mod-btn-red d-md-inline-block d-none"
              onclick="window.location.href='/auth/logout'"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <hr class="d-md-none" />
      <div class="col-md-7 p-0">
        <div class="container p-0">
          <div class="row">
            <div class="col-sm-4 d-flex justify-content-center my-2">
              <button
                @click="
                  (stat_open = true), (mh_open = false), (set_open = false)
                "
                class="btn-block set-btn set-btn-yellow selector"
              >
                Stats
              </button>
            </div>
            <div class="col-sm-4 d-flex justify-content-center my-2">
              <button
                @click="
                  (stat_open = false), (mh_open = true), (set_open = false)
                "
                class="btn-block set-btn set-btn-yellow selector"
              >
                Historical
              </button>
            </div>
            <div
              v-if="isMyProfile"
              class="col-sm-4 d-flex justify-content-center my-2"
            >
              <button
                @click="
                  (stat_open = false), (mh_open = false), (set_open = true)
                "
                class="btn-block set-btn set-btn-yellow selector"
              >
                Settings
              </button>
            </div>
          </div>
        </div>
        <hr />
        <div v-if="stat_open">
          <!-- <Stats /> -->
        </div>
        <div v-if="mh_open">
          <Match_History />
        </div>
        <div v-if="set_open">
          <Setting @updateUserProfil="emits('updateUserProfil')" />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import '@vueform/toggle/themes/default.css';

.set-btn {
  position: relative;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 90%;
  border-radius: 10px;
  border: none;
  transition: 0.4s;
  width: 130%;
  /* margin: 5px 35px 5px; */
}

.set-btn-yellow {
  background-color: #fffdbf;
  color: #a8a300;
  box-shadow: 0px 0px 10px 2px #fff700;
}
.set-btn-yellow:hover {
  box-shadow: 0px 0px 10px #fff961, 0px 0px 15px 5px #fff961;
}

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
