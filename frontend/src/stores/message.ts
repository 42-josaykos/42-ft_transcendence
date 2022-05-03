import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Message } from '@/models/message.model';

export const useMessageStore = defineStore('message', () => {
  const messages = ref<Message[]>([]);

  const textMsg = ref<string>('');
  const textDirectMsg = ref<string>('');

  const createMessage = (newMessage: Message) => {
    if (messages.value != undefined) {
      messages.value.push(newMessage);
    }
  };

    const sortMessages = (dataMsg: Message[]) => {
        dataMsg.sort((a, b) => (a.id > b.id) ? 1 : -1)
        messages.value = dataMsg;
      }

    return {
        messages,
        textMsg,
        textDirectMsg,
        createMessage,
        sortMessages
    }
})
