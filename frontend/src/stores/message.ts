import { defineStore } from "pinia";
import { ref } from "vue";
import type { Message } from '@/models/message.model';

export const useMessageStore = defineStore('message', () => {
    const messages = ref<Message[]>([]);

    const createMessage = (newMessage: Message) => {
        messages.value.push(newMessage);
    }

    return {
        messages,
        createMessage
    }
})