<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { ref, computed } from "vue";
import { Post } from "@/services/requests";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const { isAuthenticated, loggedUser, flashMsg } = storeToRefs(userStore);
const router = useRouter();

const username = ref("");
const password1 = ref("");
const password2 = ref("");
const isInvalid = computed(() => {
  if (flashMsg.value) {
    return "form-control is-invalid";
  } else {
    return "form-control";
  }
});

function register() {
  if (username.value.length > 15) {
    flashMsg.value = "Username must be less than 15 characters";
  } else if (password1.value == password2.value) {
    Post(`http://${HOST}:${API_PORT}/users`, {
      username: username.value,
      password: password1.value,
    }).then((res) => {
      if (res.status == 201) {
        userStore.createUser(res.data);
        Post("/auth/login/local", {
          username: res.data.username,
          password: password1.value,
        }).then((res) => {
          if (res.status == 201) {
            isAuthenticated.value = true;
            loggedUser.value = res.data;
            router.push("/");
          }
        });
      }
    });
  } else {
    flashMsg.value = "Password doesn't match";
  }
  setTimeout(() => {
    flashMsg.value = "";
  }, 5000);
}

const seePassword = (stringId: string) => {
  let pass = document.getElementById(stringId);
  if (pass?.getAttribute("type") === "password") {
    pass?.setAttribute("type", "text");
  } else {
    pass?.setAttribute("type", "password");
  }
};
</script>

<template>
  <div>
    <h2><u>Create a new account</u></h2>
    <div v-if="flashMsg" style="color: red">{{ flashMsg }}</div>

    <div>
      <form @submit.prevent.trim.lazy="register" class="form-signup">
        <div class="form-signin pt-3">
          <label for="inputUsername" class="sr-only">Username</label>
          <input
            type="text"
            id="inputUsername"
            placeholder="Username"
            :class="isInvalid"
            v-model="username"
            required
            autofocus
          />
          <label for="inputPassword1" class="sr-only">Password</label>
          <div class="d-flex register mt-3">
            <span
              @click="seePassword('inputPassword1')"
              class="input-group-text"
              id="basic-addon1"
              ><i class="fa-regular fa-eye"></i
            ></span>
            <input
              :class="isInvalid + ' input-pass'"
              type="password"
              id="inputPassword1"
              placeholder="Password"
              v-model="password1"
              required
            />
          </div>
          <label for="inputPassword2" class="sr-only">Confirm Password</label>
          <div class="d-flex register mt-3 mb-3">
            <span
              @click="seePassword('inputPassword2')"
              class="input-group-text"
              id="basic-addon1"
              ><i class="fa-regular fa-eye"></i
            ></span>
            <input
              :class="isInvalid + ' input-pass'"
              type="password"
              id="inputPassword2"
              placeholder="Confirm password"
              v-model="password2"
              required
            />
          </div>
          <button
            class="mod-btn mod-btn-yellow"
            type="submit"
            style="margin: 20px"
          >
            Register and Login
          </button>
          <br />
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
input#inputUsername {
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
span.input-group-text:hover {
  cursor: pointer;
}

.register {
  text-align: center;
  margin-right: auto !important;
  margin-left: auto !important;
  max-width: 300px;
}
span.input-group-text {
  border-top-right-radius: 0rem !important;
  border-bottom-right-radius: 0rem !important;
}

input.input-pass {
  border-top-left-radius: 0rem !important;
  border-bottom-left-radius: 0rem !important;
  padding-right: 55px;
}
</style>
