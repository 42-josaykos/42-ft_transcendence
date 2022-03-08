import { defineStore } from "pinia";
import { ref } from "vue";
import type { Channel } from '@/models/channel.model';
import type { Message} from '@/models/message.model';

export const useChannelStore = defineStore('channel', () => {
    const channels = ref<Channel[]>([]);

    const createChannel = (newChannel: Channel) => {
        channels.value.push(newChannel);
    }

    const addMessage = (newMessage: Message) => {

        channels.value.at(newMessage.channel)?.messages.push(newMessage);
    }

    return {
        channels,
        createChannel,
        addMessage,
    };
});