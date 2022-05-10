<script setup lang="ts">
import ModalChat from "./ModalChat.vue"
import { storeToRefs } from "pinia";
import { useMessageStore } from "@/stores/message";
import { useChannelStore } from "@/stores/channel";
import type { User } from "@/models/user.model";

const messageStore = useMessageStore();
const { stringSendMessage, modalSendMessage } = storeToRefs(messageStore);

const channelStore = useChannelStore();

	defineProps < {
		userClick: User | undefined;
	} > ();

</script>


<template>

  <ModalChat
    v-if="userClick != undefined && modalSendMessage"
    @close="
      modalSendMessage = false;
      stringSendMessage = '';
    "
  >
    <template v-slot:header>
      <h2 class="pt-4">{{ userClick?.username }}</h2>
    </template>

    <template v-slot:body>
      <textarea
        class="form-control scroller-msg" id="sendMessage"
        style="margin-left: 0px !important; width: 500px;"
        v-model="stringSendMessage"
      >
      </textarea>
      <label for="message" class="sr-only">Messgae</label>
    </template>

    <template v-slot:footer>
      <button
        @click="if (stringSendMessage.trim() != '') {
          modalSendMessage = false;
          channelStore.sendDirectChannel(userClick);
        }
        "
        type="button"
        class="mod-btn mod-btn-blue"
      >
        Send Message
      </button>
      <button
        @click="
          modalSendMessage = false;
          stringSendMessage = '';
        "
        type="button"
        class="mod-btn mod-btn-yellow"
      >
        Cancel
      </button>
    </template>
  </ModalChat>

</template>

<style>

[type=button], [type=reset], [type=submit], button {
-webkit-appearance: none !important;
}

</style>
