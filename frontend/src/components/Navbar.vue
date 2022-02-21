<script setup lang="ts">
import GamePadIcon from './icons/GamePadIcon.vue';
import HomeItem from './HomeItem.vue';
import HomeIcon from './icons/HomeIcon.vue';
import BugIcon from './icons/BugIcon.vue';
import LoginIcon from './icons/LoginIcon.vue';
</script>

<template>
  <nav id="navbar">
    <router-link to="/">
      <HomeItem>
        <template #icon>
          <HomeIcon />
        </template>
        <template #heading>Home</template>
      </HomeItem>
    </router-link>

    <router-link to="/game">
      <HomeItem>
        <template #icon>
          <GamePadIcon />
        </template>
        <template #heading>Game</template>
      </HomeItem>
    </router-link>

    <router-link to="/debug">
      <HomeItem>
        <template #icon>
          <BugIcon />
        </template>
        <template #heading>Debug</template>
      </HomeItem>
    </router-link>

    <router-link to="/login">
      <HomeItem>
        <template #icon>
          <LoginIcon />
        </template>
        <template #heading>Login</template>
      </HomeItem>
    </router-link>
  </nav>
</template>

<style>
#navbar {
  display: flex;
  align-items: center;
}
</style>
