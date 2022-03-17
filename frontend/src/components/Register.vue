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
const password1 = ref('');
const password2 = ref('');

function register() {
  if (password1.value == password2.value) {
    Post('/users', {
      username: username.value,
      password: password1.value
    }).then(res => {
      if (res.status == 201) {
        userStore.createUser(res.data);
        Post('/auth/login/local', {
          username: username.value,
          password: password1.value
        }).then(res => {
          if (res.status == 201) {
            console.log(res.data);
            isAuthenticated.value = true;
            loggedUser.value = res.data;
            router.push('/');
          }
        });
      }
    });
  } else {
    console.log("Password doesn't matched");
  }
}
</script>

<template>
  <div class="auth-form border border-primary">
    <h2 v-if="!isAuthenticated">Create a new account</h2>
    <h2 v-else>Logout</h2>

    <div v-if="!isAuthenticated">
      <form @submit.prevent.trim.lazy="register" class="form-signup">
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
        <label for="inputPassword1" class="sr-only">Password</label>
        <input
          type="password"
          id="inputPassword1"
          class="form-control"
          placeholder="Password"
          v-model="password1"
          required
        />
        <label for="inputPassword2" class="sr-only">Confirm Password</label>
        <input
          type="password"
          id="inputPassword2"
          class="form-control"
          placeholder="Confirm password"
          v-model="password2"
          required
        />
        <button class="btn btn-lg btn-primary btn-block my-2" type="submit">
          Register
        </button>
        <div>Already registered ?</div>
        <router-link to="/login">Login</router-link>
      </form>
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
