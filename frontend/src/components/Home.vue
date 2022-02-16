<script setup lang="ts">
import GamePadIcon from './icons/GamePadIcon.vue'
import HomeItem from './HomeItem.vue'
import HomeIcon from './icons/HomeIcon.vue'
import BugIcon from './icons/BugIcon.vue'

</script>

<template>
  <div class="wrapper">
    <img src="../assets/42_Logo.svg" alt="42-logo" width="100" />
    <HomeItem>
      <template #icon>
        <HomeIcon />
      </template>
      <template #heading>Home</template>
    </HomeItem>

    <HomeItem>
      <template #icon>
        <GamePadIcon />
      </template>
      <template #heading>Game</template>
    </HomeItem>

    <HomeItem>
      <template #icon>
        <BugIcon />
      </template>
      <template #heading>Debug</template>
    </HomeItem>
  </div>
</template>

<style>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>