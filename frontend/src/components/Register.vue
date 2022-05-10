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

const seePassword = (stringId: string) => {
  let pass = document.getElementById(stringId);
  if (pass?.getAttribute('type') === 'password') {
      pass?.setAttribute('type', 'text')
  }
  else {
    pass?.setAttribute('type', 'password')
  }
}
</script>

<template>
  <div>
    <h2><u>Create a new account</u></h2>

    <div>
      <form @submit.prevent.trim.lazy="register" class="form-signup">

        <div class="form-signin pt-3">
          <div class="input-group mb-3 mx-auto">
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
          </div>
          <div class="input-group mb-3 mx-auto">
            <label for="inputPassword1" class="sr-only">Password</label>
            <span @click="seePassword('inputPassword1')" class="input-group-text" id="basic-addon1"><i class="fa-regular fa-eye"></i></span>
            <input
              type="password"
              id="inputPassword1"
              class="form-control"
              placeholder="Password"
              v-model="password1"
              required
            />
          </div>
          <div class="input-group mb-3 mx-auto">
            <label for="inputPassword2" class="sr-only">Confirm Password</label>
            <span @click="seePassword('inputPassword2')" class="input-group-text" id="basic-addon1"><i class="fa-regular fa-eye"></i></span>
            <input
              type="password"
              id="inputPassword2"
              class="form-control"
              placeholder="Confirm password"
              v-model="password2"
              required
            />
          </div>
        </div>

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
}

input::placeholder {
  text-align: center;
}

input.form-control:focus {
  outline: none;
  box-shadow: none;
  border: 1px solid #ced4da;
}

span.input-group-text, input#inputUsername {
  border-top-left-radius: 0.25rem !important;
  border-bottom-left-radius: 0.25rem !important;
}
span.input-group-text:hover {
  cursor: pointer;
}

</style>
