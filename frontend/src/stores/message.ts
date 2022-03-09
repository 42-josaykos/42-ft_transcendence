import { defineStore } from "pinia";
import { ref } from "vue";
import type { Message } from '@/models/message.model';

export const useMessageStore = defineStore('message', () => {
    const messages = ref<Message[]>([]);

    const createMessage = (newMessage: Message) => {
        messages.value.push(newMessage);
    }

    /*const filterMessage = (channel: string) => {
        const newArrayMessages = ref<Message[]>([]);
        messages.value.forEach(element => {
            if (element.channel === channel)
                newArrayMessages.push(element)
        });
        return newArrayMessages;
    }*/

    return {
        messages,
        createMessage
        //filterMessage
    }
})