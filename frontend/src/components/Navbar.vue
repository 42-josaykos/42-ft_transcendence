<script setup lang="ts">
import Modale from './Modale.vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import ModalChat from "./chat/ModalChat.vue";
import UsersFriends from "./UsersFriends.vue";
import { onMounted } from "vue";
import { Get } from "@/services/requests";

const { setting_open, userClick, modalFriends, usersFriends, loggedUser } = storeToRefs(useUserStore());

defineProps<{
  isAuthenticated: boolean;
}>();

 onMounted(async () => {
  if (loggedUser.value != undefined) {
    await Get(`/users/search?id=${loggedUser.value?.id}&friends`).then((res: any) => {
      if (res.status == 200) {
        usersFriends.value = res.data[0].friends;
      }
    })
  }
});
</script>


<template>
  <div class="container pt-2">
		<div v-if="loggedUser" class="row d-flex pb-4" style="align-items: center; justify-content: space-between;">

      <div class="col-sm-4 d-flex" style="width: auto;">
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
      <div class="col-sm-8 d-flex btn-navbar" style="width: auto; justify-content: space-around;">

        <router-link to="/" class="col-sm-2 d-flex justify-content-center my-2 mx-2" style="text-decoration: none; color: inherit">
          <button @click="" class="btn-block set-btn set-btn-nav selector" style="margin-top: 45px; width: 200px !important; margin-right: auto; margin-left: auto;font-size: x-large;"> Home </button>
        </router-link>

        <router-link to="/game" class="col-sm-2 d-flex justify-content-center my-2 mx-2" style="text-decoration: none; color: inherit">
          <button @click="" class="btn-block set-btn set-btn-nav selector" style="margin-top: 45px; width: 200px !important; margin-right: auto; margin-left: auto;font-size: x-large;"> Play </button>
        </router-link>

        <router-link to="/chat" class="col-sm-2 d-flex justify-content-center my-2 mx-2" style="text-decoration: none; color: inherit">
          <button @click="" class="btn-block set-btn set-btn-nav selector" style="margin-top: 45px; width: 200px !important; margin-right: auto; margin-left: auto;font-size: x-large;"> Chat </button>
        </router-link>

        <span class="col-sm-2 d-flex justify-content-center my-2 mx-2">
          <button @click="modalFriends = true" class="btn-block set-btn set-btn-nav set-btn-nav-friends selector " style="margin-top: 45px; width: 200px !important; margin-right: auto; margin-left: auto;font-size: x-large;"> Friends </button>
        </span>

      </div>
    </div>
  </div>
  <Modale :isAuthenticated="isAuthenticated" :loggedUser="loggedUser" />
  <ModalChat v-if="modalFriends == true" @close="modalFriends = false;">
    <template v-slot:header>
      <h2 class="pt-4">
        <u>Friends list</u>
      </h2>
    </template>
    <template v-slot:body>
      <UsersFriends/>
    </template>
  </ModalChat>

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
    max-width: 86px !important;
  };
}
@media (max-width: 576px) {
  .set-btn-nav-friends {
    max-width: 95px !important;
  };
}
@media (max-width: 576px) {
  .btn-navbar {
    width: 100vw !important;
  }
}
@media (max-width: 1400px) {
  .btn-navbar {
    width: 100vw !important;
  }
}

</style>
