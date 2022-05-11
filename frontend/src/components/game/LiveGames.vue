<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { ref } from "vue";

// Stores
const userStore = useUserStore();
const { loggedUser, gameSocket } = storeToRefs(userStore);

const liveGames = ref<any>(null);
gameSocket.value?.on("liveGames", (games: any) => {
  console.log("[LiveGames] Live games: ", games);
  liveGames.value = games;
});
</script>

<template>
  <div>{{ liveGames }}</div>
</template>

<style></style>
