<script setup lang="ts">

import { storeToRefs } from "pinia";

import { useUserStore } from "@/stores/user";
import { useMessageStore } from "@/stores/message";
import { useChannelStore } from "@/stores/channel";
import { useInputStore } from "@/stores/input";
import { computed } from "@vue/reactivity";

const userStore = useUserStore();
const { loggedUser, socketChat } = storeToRefs(userStore);

const messageStore = useMessageStore();
const { messages, textMsg } = storeToRefs(messageStore);

const inputStore = useInputStore();

const channelStore = useChannelStore();
const {
  channel,
  timerIntervalBan,
  timerIntervalMute
} = storeToRefs(channelStore);

const sendNewMessage = (channelId: Number | undefined) => {
  if (channelId != undefined) {
    if (textMsg.value.trim() != "") {
      const newMessage = {
        author: loggedUser.value?.id,
        channel: { id: channelId },
        data: textMsg.value,
      };
      socketChat.value?.emit("newMessage", newMessage, loggedUser.value);
    }
  }
  textMsg.value = "";
};

const timerBan = computed(() => {
  const index = timerIntervalBan.value.findIndex((el: any) => el.channelId == channel.value?.id)
  if (index != -1) {
    return `You are muted from this channel for ${ timerIntervalBan.value[index].timeLeft } time`
  }
})

const timerMute = computed(() => {
  const index = timerIntervalMute.value.findIndex((el: any) => el.channelId == channel.value?.id)
  if (index != -1) {
    return `You are muted from this channel for ${ timerIntervalMute.value[index].timeLeft } time`
  }
})

</script>


<template>
  <div class="horizontal-line-bottom">
    <h1 class=" text-truncate px-4" style="line-height: 1.5 !important">
      {{ channelStore.searchName(channel) }}
    </h1>
  </div>
  <div
    id="scroll-bar"
    class="scrollspy-example"
    style="height: 80vh; width: 100%; overflow-y: scroll"
    tabindex="0"
  >
    <div v-if="channel != undefined">
      <div v-if="channelStore.isBan(channel, loggedUser?.id) == false">
        <div v-if="messages">
          <div
            style="display: flex"
            v-for="item in messages"
            :key="item.id"
          >
          <span v-if="!userStore.isBlocked(item.author)" style="display: contents;">
            <div v-if="channelStore.isBan(channel, item.author.id) == true" style="display: contents;">
              <div class="msg chat-message-delete mb-4">
                <div class="flex-shrink-1 rounded ml-3 text-msg-left">
                  <div style="text-align: center">*** Message delete ***</div>
                </div>
              </div>
            </div>
            <div v-else-if="item.author.id != loggedUser?.id">
              <div class="msg chat-message-left mb-4">
                <div
                  style="
                    margin: auto;
                    padding-left: 10px;
                    padding-right: 10px;
                  "
                >
                  <img
                    v-bind:src="item.author.avatar"
                    alt="Avatar"
                    class="rounded-circle mr-1"
                    width="40"
                    height="40"
                  />
                </div>
                <div class="flex-shrink-1 rounded ml-3 text-msg-left">
                  <div class="font-weight-bold mb-1">
                    {{ item.author.username }}
                  </div>
                  <div style="text-align: start">{{ item.data }}</div>
                  <!-- <p class="text-break">{{item.data}}</p> -->
                </div>
              </div>
            </div>
            <div v-else style="display: contents">
              <div class="msg chat-message-right mb-4">
                <div
                  style="
                    margin: auto;
                    padding-left: 10px;
                    padding-right: 10px;
                  "
                >
                  <img
                    v-bind:src="item.author.avatar"
                    alt="Avatar"
                    class="rounded-circle mr-1"
                    width="40"
                    height="40"
                  />
                </div>
                <div class="flex-shrink-1 rounded mr-3 text-msg-right">
                  <div class="font-weight-bold mb-1">
                    {{ item.author.username }}
                  </div>
                  <div style="text-align: start">{{ item.data }}</div>
                  <!-- <p class="text-break">{{item.data}}</p> -->
                </div>
              </div>
            </div>
              <!-- <p class="text-break">{{item.data}}</p> -->

          </span>
          </div>
        </div>
        <div v-if="channelStore.isMute(channel, loggedUser?.id) == true" style="display: contents;">
          <div class="msg timer mx-3 mb-3">
            <div class="flex-shrink-1 rounded ml-3 text-msg-left">
                <div style="text-align: center">{{ timerMute }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else style="display: contents;">
        <div class="msg timer mx-3 mt-3">
          <div class="flex-shrink-1 rounded ml-3 text-msg-left">
              <div style="text-align: center">{{ timerBan }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="horizontal-line-top">
    <form
      @submit.prevent.trim.lazy="sendNewMessage(channel?.id)"
      method="POST"
      class="form"
    >
      <input v-model="textMsg" type="text" class="input ms-3" />
      <button
        type="submit"
        class="rounded btn-channel wrapper-icon-leave ms-auto"
      >
        <i class="fa-solid fa-paper-plane"></i>
      </button>

    </form>
  </div>
</template>


<style>

</style>