import { defineStore } from "pinia";
import { ref } from "vue";
import type { Channel } from '@/models/channel.model';
import type { Message} from '@/models/message.model';

export const useChannelStore = defineStore('channel', () => {
    const channels = ref<Channel[]>([]);

    const createChannel = (newChannel: Channel) => {
        channels.value.push(newChannel);
    }

    const addMessage = (id: number, newMessage: Message) => {
        console.log("2 - channel.id => ", id)
        //channels.value.at(id)?.messages.push(newMessage);
         channels.value[id - 1].messages.push(newMessage);
         console.log("channels[id] => ", channels.value[id - 1])
    }

    const getChannelByID = (id: number): Channel => {
        return channels.value[id];
    }

    return {
        channels,
        createChannel,
        addMessage,
        getChannelByID
    };
});