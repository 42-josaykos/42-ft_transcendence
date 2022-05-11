<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

// Stores
const userStore = useUserStore();
const { loggedUser, gameSocket } = storeToRefs(userStore);

const router = useRouter();

gameSocket.value?.on("startGame", (data: any) => {
  console.log("[QueueSystem] A new match is starting");
  router.push("/matchmaking");
});

const enterQueue = () => {
  gameSocket.value?.emit("queue", loggedUser.value);
};
</script>

<template>
  <div>
    <button @click="enterQueue">Search a new match!</button>
  </div>
</template>

<style></style>
