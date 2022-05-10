<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';
import { Post } from '@/services/requests';
import { useRouter } from 'vue-router';
import { login_open, register_open } from './Modale.vue';

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
            isAuthenticated.value = true;
            loggedUser.value = res.data;
            router.push('/');
          }
        });
      }
    });
  } else {
    alert("Password doesn't matched");
  }
}
</script>

<template>
  <div>
    <h2><u>Create a new account</u></h2>

    <div>
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
        <button
          class="mod-btn mod-btn-yellow"
          type="submit"
          style="margin: 20px"
        >
          Register and Login
        </button>
        <br />
      </form>
    </div>
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
