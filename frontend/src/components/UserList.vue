<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { ref } from "vue";

// Stores
const userStore = useUserStore();
const { gameSocket } = storeToRefs(userStore);

const router = useRouter();
</script>

<template>
  <style scoped></style>
</template>
