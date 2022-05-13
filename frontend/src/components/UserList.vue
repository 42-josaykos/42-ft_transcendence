<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { Get } from "@/services/requests";
import type { User } from "@/models/user.model";

// Stores
const userStore = useUserStore();
const { gameSocket, socketChat } = storeToRefs(userStore);

const router = useRouter();

// Get all users at page startup
const users = ref<User[]>([]);
socketChat.value?.emit("getAllUsers");
socketChat.value?.on("receiveAllUsers", (userList) => (users.value = userList));
</script>

<template></template>

<style scoped></style>
