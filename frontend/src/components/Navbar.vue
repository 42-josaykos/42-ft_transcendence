<script setup lang="ts">
import GamePadIcon from './icons/GamePadIcon.vue';
import HomeItem from './HomeItem.vue';
import HomeIcon from './icons/HomeIcon.vue';
import BugIcon from './icons/BugIcon.vue';
import LoginIcon from './icons/LoginIcon.vue';
import ChatIcon from './icons/ChatIcon.vue';
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light my-nav">
    <div class="container-fluid">
      <button class="nav-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/">
              <HomeItem>
                <template #icon>
                  <HomeIcon />
                </template>
                <template #heading>Home</template>
              </HomeItem>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/game">
              <HomeItem>
                <template #icon>
                  <GamePadIcon />
                </template>
                <template #heading>Game</template>
              </HomeItem>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/chat">
              <HomeItem>
                <template #icon>
                  <ChatIcon />
                </template>
                <template #heading>Chat</template>
              </HomeItem>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/debug">
              <HomeItem>
                <template #icon>
                  <BugIcon />
                </template>
                <template #heading>Debug</template>
              </HomeItem>
            </router-link>
          </li>
        </ul>
        <router-link to="/login">
          <HomeItem>
            <template #icon>
              <LoginIcon />
            </template>
            <template #heading>Login</template>
          </HomeItem>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style>
.my-nav {
  display: flex;
  align-items: center;
  background-color: rgb(143, 136, 136)
}

.nav-toggler {
    padding: 0.25rem 0.75rem;
    font-size: 1.25rem;
    line-height: 1;
    background-color: rgba(209, 209, 208, 0.542);;
    border: 1px solid transparent;
    border-radius: 0.25rem;
    transition: box-shadow .15s ease-in-out;
}

@media (min-width: 992px) {
  .navbar-expand-lg .nav-toggler {
      display: none;
  }
}
</style>