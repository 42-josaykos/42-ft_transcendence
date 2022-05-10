<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';
import { Post } from '@/services/requests';
import { useRouter } from 'vue-router';
import { login_open, register_open } from './Modale.vue';

const userStore = useUserStore();
const { isAuthenticated, loggedUser, isTwoFactorAuth } = storeToRefs(userStore);
const router = useRouter();

const username = ref('');
const password = ref('');
const loader = ref(false);

function loginLocal() {
  loader.value = true;
  Post('/auth/login/local', {
    username: username.value,
    password: password.value
  })
    .then(res => {
      if (res.status == 201) {
        isAuthenticated.value = true;
        loggedUser.value = res.data;
        router.push('/');
      } else if (res.status == 303) {
        isTwoFactorAuth.value = true;
        login_open.value = false;
        router.push('/twofactorauth');
      }
      loader.value = false;
    })
    .catch((error: any) => {});
}
</script>

<template>
  <div class="container">
    <h1 class="neonText display-1">Space Pong</h1>
    <div v-if="!loader">
      <form @submit.prevent.trim.lazy="loginLocal" class="form-signin">
        <label for="inputUsername" class="sr-only">Username</label>
        <input
          type="text"
          id="inputUsername"
          class="form-control"
          placeholder="Username"
          v-model="username"
          required
          autofocus
        />
        <label for="inputPassword" class="sr-only">Password</label>
        <input
          type="password"
          id="inputPassword"
          class="form-control"
          placeholder="Password"
          v-model="password"
          required
        />
        <button
          class="mod-btn mod-btn-yellow"
          type="submit"
          style="margin: 20px"
        >
          Login
        </button>
      </form>
      <div>
        <button
          class="mod-btn mod-btn-blue"
          style="margin: 10px"
          onclick="window.location.href='/auth/login'"
        >
          <img src="../assets/42_Logo.svg" style="color: black; width: 30px" />
          Student Login</button
        ><br />
        <button
          class="mod-btn mod-btn-cyan"
          style="margin: 10px"
          onclick="window.location.href='/auth/login/github'"
        >
          <i class="fa-brands fa-github" style="color: black"></i> Github Login
        </button>
      </div>
      <div v-if="!isAuthenticated">
      Don't have an account ?
        <a
          href="#"
          @click="
            login_open = false;
            register_open = true;
          "
        >
          Register
        </a>
      </div>
    </div>
    <div v-else class="loader"></div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}


input {
  text-align: center;
  margin: auto;
  max-width: 300px;
}

input::placeholder {
  text-align: center;
}

input.form-control:focus {
  outline: none;
  box-shadow: none;
  border: 1px solid #ced4da;
}

.loader {
  border: 16px solid #f3f3f3; /* Light grey */
  border-top: 16px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 2s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
