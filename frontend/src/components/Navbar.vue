<script setup lang="ts">
import Modale from './Modale.vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';

const { setting_open, userClick } = storeToRefs(useUserStore());

defineProps<{
  isAuthenticated: boolean;
  loggedUser: any;
}>();
</script>


<template>
  <div class="container pt-2">
		<div v-if="loggedUser" class="row d-flex pb-4" style="align-items: center; justify-content: space-between;">

      <div class="col-sm-3 d-flex" style="width: auto;">
        <div class="cercle-user-card">
          <img v-bind:src=loggedUser.avatar alt="Avatar" class="card-img" style="width: 150px; height: 150px;">
        </div>
        <div class="infos"  style="margin-left: 15px;">
          <div class="info" >
            <h3>{{loggedUser.username}}</h3>
            <button @click="userClick = loggedUser; setting_open = !setting_open" class="btn-block set-btn set-btn-nav selector" style="font-size: x-large;"> Profile </button>
          </div>
        </div>
      </div>
      <div class="col-sm-9 d-flex btn-navbar" style="width: auto; justify-content: space-around;">

        <router-link to="/" class="col-sm-3 d-flex justify-content-center my-2 mx-2" style="text-decoration: none; color: inherit">
          <button @click="" class="btn-block set-btn set-btn-nav selector" style="margin-top: 45px; width: 240px !important; margin-right: auto; margin-left: auto;font-size: x-large;"> Home </button>
        </router-link>

        <router-link to="/game" class="col-sm-3 d-flex justify-content-center my-2 mx-2" style="text-decoration: none; color: inherit">
          <button @click="" class="btn-block set-btn set-btn-nav selector" style="margin-top: 45px; width: 240px !important; margin-right: auto; margin-left: auto;font-size: x-large;"> Play </button>
        </router-link>

        <router-link to="/chat" class="col-sm-3 d-flex justify-content-center my-2 mx-2" style="text-decoration: none; color: inherit">
          <button @click="" class="btn-block set-btn set-btn-nav selector" style="margin-top: 45px; width: 240px !important; margin-right: auto; margin-left: auto;font-size: x-large;"> Chat </button>
        </router-link>

      </div>
    </div>
  </div>
  <Modale :isAuthenticated="isAuthenticated" :loggedUser="loggedUser" />

</template>

<style scoped>
li .row  {
  transition: 0.4s;
}
li .row:hover {
  transform: scale(1.3);
  color: #fffed4;
  filter: drop-shadow(0px 0px 5px #fff961);
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

@media (max-width: 576px) {
  .set-btn-nav {
    max-width: 130px !important;
  };
  /* .btn-navbar {
    width: 100vw !important;
  } */
}

@media (max-width: 576px) {
  .btn-navbar {
    width: 100vw !important;
  }
}
@media (max-width: 1200px) {
  .btn-navbar {
    width: 100vw !important;
  }
}
/* 
@media (min-width: 768px) {
  .set-btn-nav {
    width: 200px !important;
  }
} */

</style>
