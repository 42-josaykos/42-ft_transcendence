import { defineStore } from "pinia";
import { ref } from "vue";
import type { Channel } from '@/models/channel.model';
//import type { Message } from '@/models/message.model';
import type { Input } from './input';
import type { User } from "@/models/user.model";

export const useChannelStore = defineStore('channel', () => {
    const allChannels = ref<Channel[]>([]);
    const channels = ref<Channel[]>([]);
    const channel = ref<Channel>();
    const channelsJoin = ref<boolean>();

    const createChannel = (newChannel: Channel) => {
      allChannels.value.push(newChannel);
    }

    const joinChannel = (newChannel: Channel) => {
      newChannel.isMember = true;
      channels.value.push(newChannel);
    }

    const leaveChannel = (newChannel: Channel) => {
      const index = channels.value.findIndex((el: Channel) => el.id === newChannel.id);
      channels.value.splice(index, 1);
    }

    const updateMember = () => {
      for (const chan of allChannels.value) {
        const index =  channels.value.findIndex((el: Channel) => el.id === chan.id);
        if (index != -1) {
          chan.isMember = true;
        }
        else {
          chan.isMember = false;
        }
      }
    }

    /*const addMessage = (id: number, newMessage: Message) => {
      let index = channels.value.findIndex((el: Channel) => el.id === id);
      if (index != -1) {
         channels.value[index].messages.push(newMessage);
      }
      index = allChannels.value.findIndex((el: Channel) => el.id === id);
      if (index != -1) {
         allChannels.value[index].messages.push(newMessage);
      }
    }*/ 

    const getChannelByID = (id: number): Channel => {
      const index = channels.value.findIndex(
        (el: Channel) => el.id === id
      );
        return channels.value[index];
    }

    const deleteChannel = (id: number) => {
        const index = channels.value.findIndex((el: Channel) => el.id === id);
        channels.value.splice(index, 1);
        allChannels.value.splice(index, 1);
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

    /*const getMemberChannelByID = (channel_item: Channel, userId: number): boolean => {

      const { members } = channel_item;
      for (const member of members) {
        if (member.id === userId) {
          return true;
        }
      }
      return false
    }*/

    const isAdmin = (channel_item: Channel, userID: number ) => {
      const admins  = channel_item.admins;
      const index = admins.findIndex((el: User) => el.id === userID);
      if (index == -1) {
        return false;
      }
      return true;
    }

    const isOwner = (channel_item: Channel, userID: number) => {

      const owner = channel_item.owner;
      if (owner.id === userID){
        return true;
        }
      return false
    }

    const isBan = (channel_item: Channel, userID: number) => {

      const bans = channel_item.bans;
      const index = bans.findIndex((el: User) => el.id === userID);
      if (index == -1) {
        return false;
      }
      return true;
    }

    const isMute = (channel_item: Channel, userID: number) => {

      const mutes = channel_item.mutes;
      const index = mutes.findIndex((el: User) => el.id === userID);
      if (index == -1) {
        return false;
      }
      return true;
    }

    /*const findNewOwner = () => {

    }*/

    return {
        allChannels,
        channels,
        channel,
        channelsJoin,
        createChannel,
        joinChannel,
        leaveChannel,
        updateMember,
       // addMessage,
        getChannelByID,
        deleteChannel,
        updateChannel,
        getChannelUpdates,
       // getMemberChannelByID,
        isAdmin,
        isOwner,
        isBan,
        isMute
        //findNewOwner
    };
});