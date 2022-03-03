import { defineStore } from "pinia";
import { ref } from "vue";
import type { Channel } from '@/models/channel.model';

export const useChannelStore = defineStore('channel', () => {
    const channels = ref<Channel[]>([]);

    const createChannel = (newChannel: Channel) => {
        channels.value.push(newChannel);
    }

    return {
        channels,
        createChannel
    };
});