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
      if (res.status === 201) {
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
  <div class="bloc_modale">
    <div class="overlay" @click="router.push('/')"></div>
    <div class="modale card">
      <h1><u>Two-Factor<br>Authentication</u></h1>
      <form @submit.prevent.trim.lazy="submitTwoFactorAuthCode">
        <div>
          <input type="text" v-model="code" name="code" id="code" placeholder="Please enter 2FA code:" style="margin-top: 10px; width: 100%; text-align: center;"/>
        </div>
        <button class="mod-btn mod-btn-yellow" type="submit" style="margin: 20px; margin-bottom: 0;"> Submit </button>
      </form>
    </div>
  </div>
</template>

<style scoped>

.info
{

}

</style>
