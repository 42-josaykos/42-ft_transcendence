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

function loginLocal() {
  Post('/auth/login/local', {
    username: username.value,
    password: password.value
  }).then(res => {
    if (res.status == 201) {
      console.log(res.data);
      isAuthenticated.value = true;
      loggedUser.value = res.data;
      router.push('/');
    } else if (res.status == 303) {
      isTwoFactorAuth.value = true;
      login_open.value = false;
      router.push('/twofactorauth');
    }
  });
}
</script>

<template>
  <h2><u>Login to Space Pong</u></h2>
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
    <button class="mod-btn mod-btn-yellow" type="submit" style="margin: 20px">
      Log in
    </button>
    <div>Don't have an account ?</div>
    <div>
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
  </form>
  <div>
    <button
      class="mod-btn mod-btn-blue"
      style="margin: 10px"
      onclick="window.location.href='/auth/login'"
    >
      <img src="../assets/42_Logo.svg" style="color: black; width: 30px" /> Log
      in with 42</button
    ><br />
    <button
      class="mod-btn mod-btn-cyan"
      style="margin: 10px"
      onclick="window.location.href='/auth/login/github'"
    >
      <i class="fa-brands fa-github" style="color: black"></i> Log in with
      Github
    </button>
  </div>
</template>

<style scoped>
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
</style>
