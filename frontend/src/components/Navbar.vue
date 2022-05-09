<script setup lang="ts">
import Modale from './Modale.vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';

const { setting_open } = storeToRefs(useUserStore());

defineProps<{
  isAuthenticated: boolean;
  loggedUser: any;
}>();
</script>


<template>
  <div class="container pt-2">
		<div v-if="loggedUser" class="row d-flex pb-4" style="align-items: center;">

      <div class="col-sm-3 d-flex container" style="width: auto;">
        <div class="cercle-user-card">
          <img v-bind:src=loggedUser.avatar alt="Avatar" class="card-img" style="width: 150px; height: 150px;">
        </div>
        <div class="infos"  style="margin-left: 15px;">
          <div class="info" >
            <h3>{{loggedUser.username}}</h3>
            <button @click="setting_open = !setting_open" class="btn-block set-btn set-btn-nav selector" style="font-size: x-large;"> Profile </button>
          </div>
        </div>
      </div>
      <div class="col-sm-9 d-flex container" style="width: auto; justify-content: center;">

        <router-link to="/" class="col-sm-3 d-flex justify-content-center my-2 mx-2" style="text-decoration: none; color: inherit">
          <button @click="" class="btn-block set-btn set-btn-nav selector" style="margin-top: 45px; width: 200px; margin-right: auto; margin-left: auto;font-size: x-large;"> Home </button>
        </router-link>

        <router-link to="/game" class="col-sm-3 d-flex justify-content-center my-2 mx-2" style="text-decoration: none; color: inherit">
          <button @click="" class="btn-block set-btn set-btn-nav selector" style="margin-top: 45px; width: 200px; margin-right: auto; margin-left: auto;font-size: x-large;"> Play </button>
        </router-link>

        <router-link to="/chat" class="col-sm-3 d-flex justify-content-center my-2 mx-2" style="text-decoration: none; color: inherit">
          <button @click="" class="btn-block set-btn set-btn-nav selector" style="margin-top: 45px; width: 200px; margin-right: auto; margin-left: auto;font-size: x-large;"> Chat </button>
        </router-link>

      </div>
    </div>
  </div>
  <Modale :isAuthenticated="isAuthenticated" :loggedUser="loggedUser" />

</template>

<style scoped>
.navbar_concat {
  position: fixed;
  top: 5px;
  left: 5px;
  display: flex;
  z-index: 9999;
}
.btn_navbar {
  position: fixed;
  border: 0;
  border-radius: 25%;
  background-color: var(--sidebar-icon-color);
  min-height: 40px;
  min-width: 40px;
}

li .row .icon_navbar {
  transition: 0.4s;
}
li .row:hover .icon_navbar {
  transform: scale(1.3);
  color: #fffed4;
  filter: drop-shadow(0px 0px 5px #fff961);
}

.animation {
  animation-duration: 0.1s;
  animation-fill-mode: both;
}
@keyframes slideDownIn {
  0% {
    transform: translateY(-20px);
    opacity: 0%;
  }
  100% {
    transform: translateY(40px);
    opacity: 100%;
  }
  0% {
    transform: translateY(-20px);
  }
}
.slideDownIn {
  animation-name: slideDownIn;
}

.dropdown-menu {
  background: radial-gradient(ellipse at top, #1b2735 0%, #080e21 95%);
  box-shadow: 0px 0px 10px 2px white, inset 0px 0px 4px 2px white;
  border: none;
  border-radius: 20px;
  overflow-y: auto;
  color: var(--sidebar-icon-color);
}

.text_navbar {
  font-family: 'Vibure', cursive;
  color: white;
}

.navbar_concat ul li {
  cursor: pointer;
}

.set-btn-nav {
  background-color: white;
  color: #66645f;
  box-shadow: 0px 0px 10px 2px white;
  font-weight: bold;
  text-decoration: none;
}
.set-btn-nav:hover {
  box-shadow: 0px 0px 10px white, 0px 0px 15px 5px white;
}
</style>
