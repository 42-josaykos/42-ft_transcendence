<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { computed, ref } from 'vue';
import { Post } from '@/services/requests';
import { useRouter } from 'vue-router';
import Register from './Register.vue';

const userStore = useUserStore();
const { isAuthenticated, loggedUser, isTwoFactorAuth, flashMsg } =
  storeToRefs(userStore);
const router = useRouter();

const username = ref('');
const password = ref('');
const loader = ref(false);
const registerForm = ref(false);
const isInvalid = computed(() => {
  if (flashMsg.value) {
    return 'form-control is-invalid';
  } else {
    return 'form-control';
  }
});

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
        router.push('/twofactorauth');
      } else {
        flashMsg.value = 'Wrong username or password';
      }
      loader.value = false;
    })
    .catch((error: any) => {});
  setTimeout(() => {
    flashMsg.value = '';
  }, 5000);
}
</script>

<template>
  <div class="container">
    <h1 class="neonText display-1">Space Pong</h1>
    <div v-if="!loader && !registerForm">
      <div v-if="flashMsg" style="color: red">{{ flashMsg }}</div>
      <form @submit.prevent.trim.lazy="loginLocal" class="form-signin">
        <label for="inputUsername" class="sr-only">Username</label>
        <input
          type="text"
          id="inputUsername"
          :class="isInvalid"
          placeholder="Username"
          v-model="username"
          required
          autofocus
        />
        <label for="inputPassword" class="sr-only">Password</label>
        <input
          type="password"
          id="inputPassword"
          :class="isInvalid"
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
        <a href="#" @click="registerForm = true"> Register </a>
      </div>
    </div>
    <div v-else-if="loader" class="loader"></div>
    <div v-else-if="registerForm">
      <Register />
      <button
        class="mod-btn mod-btn-red"
        style="margin: 10px"
        @click="registerForm = false"
      >
        Back
      </button>
    </div>
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
