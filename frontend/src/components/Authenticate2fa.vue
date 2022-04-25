<script setup lang="ts">
import { Post } from '@/services/requests';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
const userStore = useUserStore();
const { isAuthenticated, loggedUser, isTwoFactorAuth } = storeToRefs(userStore);
const router = useRouter();

const code = ref<string>('');
function submitTwoFactorAuthCode(e: any) {
  if (code.value === '') {
    alert('Error: Code field is empty');
  }
  Post('/auth/authenticate-2fa', { twoFactorAuthenticationCode: code.value })
    .then(res => {
      console.log(res);
      if (res.status === 201) {
        console.log(res.data);
        isAuthenticated.value = true;
        loggedUser.value = res.data;
        router.push('/');
      }
    })
    .catch(error => {
      alert('Error: Invalid code');
    });
}
</script>

<template>
  <h1>Two-Factor Authentication</h1>
  <form @submit.prevent.trim.lazy="submitTwoFactorAuthCode">
    <div>
      <label for="code">Please enter two-factor authentication code:</label>
      <input type="text" v-model="code" name="code" id="code" />
    </div>
    <button type="submit">Submit</button>
  </form>
</template>
