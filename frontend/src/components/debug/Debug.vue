<script setup lang="ts">
import MatchDebug from "./MatchDebug.vue";
import UserDebug from "./UserDebug.vue";
import ChannelDebug from "./ChannelDebug.vue";
import UploadDebug from "./UploadDebug.vue";
import StatusDebug from "./StatusDebug.vue";

import { storeToRefs } from "pinia";
import { useInputStore } from "@/stores/input";

// Inputs
const inputStore = useInputStore();
const { input } = storeToRefs(inputStore);
</script>

<template>
  <h2 class="debug">Debug</h2>
  <StatusDebug title="Online status system test" />
</template>

<style>
.debug {
  color: red;
}
.title {
  color: blue;
}
</style>
