import { defineStore } from "pinia";
import { ref } from "vue";
import type { Channel } from '@/models/channel.model';
import type { Message} from '@/models/message.model';
import type { Input } from './input';

export const useChannelStore = defineStore('channel', () => {
    const channels = ref<Channel[]>([]);
    const channel = ref<Channel>();

    const createChannel = (newChannel: Channel) => {
        channels.value.push(newChannel);
    }

    const addMessage = (id: number, newMessage: Message) => {
         channels.value[id - 1].messages.push(newMessage);
    } 

    const getChannelByID = (id: number): Channel => {
      const index = channels.value.findIndex(
        (el: Channel) => el.id === id
      );
        return channels.value[index];
    }

    const deleteChannel = (id: number) => {
        const index = channels.value.findIndex((el: Channel) => el.id === id);
        channels.value.splice(index, 1);
    }

    const getChannelUpdates = (input: Input): Channel | null => {
        const index = channels.value.findIndex(
          (el: Channel) => el.id === +input.channel_id
        );
        console.log('not updated channel:', channels.value[index]);
        if (index == -1) {
          return null;
        }
        let updates: Channel | any = { ...channels.value[index] };
        if (input.update_channel_name) {
          updates.name = input.update_channel_name;
        }
        console.log('updated channel:', updates);
    
        return updates;
      };

    const updateChannel = (id: number, updatedData: Channel) => {
        const index = channels.value.findIndex((el: Channel) => el.id === id);
        channels.value.splice(index, 1, { ...channels.value[index], ...updatedData });
    }

    return {
        channels,
        channel,
        createChannel,
        addMessage,
        getChannelByID,
        deleteChannel,
        updateChannel,
        getChannelUpdates
    };
});