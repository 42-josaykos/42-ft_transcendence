<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';
import { Post } from '@/services/requests';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const { isAuthenticated, loggedUser } = storeToRefs(userStore);
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
    }
  });
}
</script>

<template>
  <div class="auth-form border border-primary">
    <h2 v-if="!isAuthenticated">Login</h2>
    <h2 v-else>Logout</h2>

    <div v-if="!isAuthenticated">
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
        <button class="btn btn-lg btn-primary btn-block my-2" type="submit">
          Login
        </button>
        <div>Don't have an account ?</div>
        <router-link to="/register">Register</router-link>
      </form>
      <hr />
      <div>
        <a class="btn btn-primary" href="/auth/login"> Login with 42 </a>
      </div>
      <div>
        <a class="btn btn-info my-2" href="/auth/login/github">
          Login with Github
        </a>
      </div>
    </div>
    <div v-else>
      <a class="btn btn-danger" href="/auth/logout">Logout</a>
    </div>
  </div>
</template>

<style>
.auth-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px auto;
  padding: 10px;
  max-width: 50%;
}
</style>
