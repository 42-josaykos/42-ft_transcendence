<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import StatusSystem from "./components/StatusSystem.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useStatusStore } from "@/stores/status";
import { onMounted, ref } from "vue";
import { Get } from "./services/requests";

// const userStore = useUserStore();
// const { loggedUser, isAuthenticated } = storeToRefs(userStore);

const statusStore = useStatusStore();
const { loggedUser, isAuthenticated, usersOnline } = storeToRefs(statusStore);

// Verify if user is already logged
onMounted(() => {
  Get("/auth/status").then((res) => {
    if (res.status == 403) {
      isAuthenticated.value = false;
    } else {
      isAuthenticated.value = true;
      loggedUser.value = res.data;
    }
  });
});
</script>

<script lang="ts">
export const isMeteor = ref(false);
</script>

<style>
@import url("./assets/meteor.css");
</style>

<template>
  <Navbar :isAuthenticated="isAuthenticated" :loggedUser="loggedUser" />
  <StatusSystem :isAuthenticated="isAuthenticated" :loggedUser="loggedUser" />;
  <div class="routerView">
    <div style="z-index: 0">
      <div class="star"></div>
      <div v-if="isMeteor">
        <div class="meteor-1"></div>
        <div class="meteor-2"></div>
        <div class="meteor-3"></div>
        <div class="meteor-4"></div>
        <div class="meteor-5"></div>
        <div class="meteor-6"></div>
        <div class="meteor-7"></div>
        <div class="meteor-8"></div>
        <div class="meteor-9"></div>
        <div class="meteor-10"></div>
        <div class="meteor-11"></div>
        <div class="meteor-12"></div>
        <div class="meteor-13"></div>
        <div class="meteor-14"></div>
        <div class="meteor-15"></div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<style>
.routerView {
  margin-left: 8vh;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #9e9e9e;
}

.header {
  display: flex;
  flex-direction: column;
}

.full-height {
  min-height: 100vh;
}
</style>
