<script setup lang="ts">
import { ref } from 'vue';

import { storeToRefs } from 'pinia';

import { useUserStore } from '@/stores/user';
import { useChannelStore } from '@/stores/channel';

import ModalChat from "./ModalChat.vue";
import UserCard from '../UserCard.vue';

const userStore = useUserStore();
const { userClick } = storeToRefs(userStore);

const channelStore = useChannelStore();
const { channel } = storeToRefs(channelStore);


const modalOpenBtn = ref<boolean>(false)

const emit = defineEmits(['removeBan', 'removeMute'])
const removeBan = () => {
    emit('removeBan');
}
const removeMute = () => {
    emit('removeMute');
}

</script>

<template>
  <button
    @click="modalOpenBtn = true"
    class="btn-block set-btn-ban-mute selector"
  >
    Bans - Mutes
  </button>

  <ModalChat v-if="modalOpenBtn" @close="modalOpenBtn = false">
    <template v-slot:header>
      <h2 class="pt-4">
        <u>Bans users :</u>
      </h2>
      <div v-if="channel && channel.bans.length > 0">
        <div class="scrollspy-example2 card-choose-users">
          <div
            class="separator-list"
            v-for="ban in channel.bans"
            :key="ban.user.id"
          >
            <div class="d-flex ms-auto my-2 " style="align-items: center" >
              <UserCard class="ms-2" :user="ban.user" :dashboard="true" :profile="false"/>
              <div class="ms-auto">
                <button
                  @click="
                    userClick = ban.user;
                    removeBan();
                  "
                  type="button"
                  class="mod-btn mod-btn-cyan btn-sm"
                >
                  Remove ban
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p style="color: red;">No member of this channel is banned</p>
      </div>

      <h2 class="pt-4">
        <u>Mutes users :</u>
      </h2>
      <div v-if="channel && channel.mutes.length > 0">
        <div class="scrollspy-example2 card-choose-users">
          <div
            class="separator-list"
            v-for="mute in channel.mutes"
            :key="mute.user.id"
          >
            <div class="d-flex ms-auto my-2 " style="align-items: center" >
              <UserCard class="ms-2" :user="mute.user" :dashboard="true" :profile="false"/>
              <div class="">
                <button
                  @click="
                    userClick = mute.user;
                    removeMute();
                  "
                  type="button"
                  class="mod-btn mod-btn-cyan btn-sm"
                >
                  Remove mute
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p style="color: red;">No member of this channel is muted</p>
      </div>
    </template>
  </ModalChat>

</template>

<style scoped>

.set-btn-ban-mute {
  background-color: transparent;
  color: #c4c4c4;
  box-shadow: 0px 0px 10px 2px var(--clr-neon);
  text-decoration: none;


  position: relative;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: 90%;
  border-radius: 10px;
  border: none;
  transition: 0.4s;
  text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3), 0 0 0.45em currentColor;
  min-width: 80%;

}
.set-btn-ban-mute:hover {
  box-shadow: 0px 0px 10px var(--clr-neon), 0px 0px 15px 5px var(--clr-neon);
  background-color: var(--clr-neon);
  color: #000;
}


</style>
