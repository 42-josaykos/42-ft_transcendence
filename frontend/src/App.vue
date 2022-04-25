<script setup lang="ts">
import Navbar from "./components/Navbar.vue";
import StatusSystem from "./components/StatusSystem.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useStatusStore } from "@/stores/status";
import { onMounted, ref } from "vue";
import { Get } from "./services/requests";
import ChatSocket from "./components/ChatSocket.vue";

const userStore = useUserStore();
const { loggedUser, isAuthenticated } = storeToRefs(userStore);

// Verify if user is already logged
onMounted(() => {
  Get("/auth/status").then((res) => {
    if (res.status == 403) {
      console.log("[App] isAuthenticated: ", false);
      isAuthenticated.value = false;
    } else {
      console.log("[App] isAuthenticated: ", true);
      isAuthenticated.value = true;
      loggedUser.value = res.data;
      console.log("[App] loggedUser: ", res.data);
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
    <div style="z-index: 0;">
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
    <div class="full-height full-width" style="z-index: 1; background: radial-gradient(ellipse at top, #1b2735 0%, #080e21 70%);">
      <Navbar :isAuthenticated="isAuthenticated" :loggedUser="loggedUser" />
      <div v-if="isAuthenticated">
        <StatusSystem />
        <ChatSocket />
      </div>
      <div class="routerView"><router-view /></div>
    </div>
</template>

<style>

:root {
  --sidebar-bg-color: #0c2039;
  --sidebar-icon-color: #1d508f;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  /* font-family: 'Vibure', cursive; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #c4c4c4;
}

.header {
  display: flex;
  flex-direction: column;
}

.full-height {
  min-height: 100vh;
}
</style>
