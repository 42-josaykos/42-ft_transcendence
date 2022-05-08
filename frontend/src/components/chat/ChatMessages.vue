<script setup lang="ts">
import { onUpdated } from "vue";

import { storeToRefs } from "pinia";

import { useUserStore } from "@/stores/user";
import { useMessageStore } from "@/stores/message";
import { useChannelStore } from "@/stores/channel";
import { computed } from "@vue/reactivity";

const userStore = useUserStore();
const { loggedUser, socketChat } = storeToRefs(userStore);

const messageStore = useMessageStore();
const { messages, textMsg } = storeToRefs(messageStore);

const channelStore = useChannelStore();
const {
  channel,
  timerIntervalBan,
  timerIntervalMute
} = storeToRefs(channelStore);

onUpdated(() => {
  scrollFunction();
});

const scrollFunction = () => {
  const scroll = document.getElementById("scroll-bar");
  if (scroll != null) {
    scroll.scrollTop = scroll.scrollHeight;
  }
};

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
            style="display: flex; margin-left: 10px; margin-right: 5px;"
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
                    width="50"
                    height="50"
                  />
                </div>
                <div class="flex-shrink-1 rounded ml-3 text-msg-left">
                  <div class="font-weight-bold mb-1">
                    {{ item.author.username }}
                  </div>
                  <div class="text-break" style="text-align: start">{{ item.data }}</div>
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
                    width="50"
                    height="50"
                  />
                </div>
                <div class="flex-shrink-1 rounded mr-3 text-msg-right">
                  <div class="font-weight-bold mb-1">
                    {{ item.author.username }}
                  </div>
                  <div class="text-break" style="text-align: start">{{ item.data }}</div>
                </div>
              </div>
            </div>
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
      <textarea
        @keydown.enter.prevent.stop="sendNewMessage(channel?.id)"
        class="form-control input scroller-msg" id="sendMessage"
        v-model="textMsg"
      >
      </textarea>
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
#sendMessage{
	overflow: auto;
	overflow-x: hidden;
}

#sendMessage::-webkit-scrollbar-track{
	background-color: #F5F5F5;
}

#sendMessage::-webkit-scrollbar{
	width: 6px;
	background-color: #F5F5F5;
}

#sendMessage::-webkit-scrollbar-thumb {
  background-color: #F5F5F5;
  border-radius: 20px;
}

#sendMessage::-webkit-scrollbar-thumb{
	border-radius: 0px;
	background-color: #e58703;
}

#sendMessage {
  border-color: transparent !important;
  box-shadow: none !important;
  border-bottom-left-radius: 10px !important;
  border-top-left-radius: 10px  !important;;
  max-height: 80px !important;
  margin-left: 2rem !important;
  border: transparent
}

.scroller-msg {
  overflow-y: scroll;
  scrollbar-color: #e58703 transparent;
  scrollbar-width: thin !important;
  border-bottom-right-radius: 0px !important;
  border-top-right-radius: 0px  !important;;
}

.scroller-msg:hover {
  overflow-y: scroll;
  scrollbar-color: #e58703 transparent;
  scrollbar-width: thin !important;
  border-bottom-right-radius: 0px !important;
  border-top-right-radius: 0px  !important;;
}

</style>