import { defineStore } from "pinia";
import { ref } from "vue";
import type { Channel } from '@/models/channel.model';
import type { User } from "@/models/user.model";
import { Get } from "@/services/requests";

export const useChannelStore = defineStore('channel', () => {
  // Tous les channels
    const allChannels = ref<Channel[]>([]);

  // Les channels auquels le user appartient
    const channels = ref<Channel[]>([]);

  // Les channels auquels le user a reçu une invitation
    const channelsInvite = ref<Channel[]>([]);

  // Le chanel sélectionné
    const channel = ref<Channel>();

  // Le channel que le user cherche à quitter
    const channelLeave = ref<Channel>();

  // Le channel que le user cherche à joindre
    const channelJoin = ref<Channel>();

  // Le channel que le user veut mettre à jour
    const channelUpdate = ref<Channel>();

  // Les users appartenant au channel selectionné
    const usersMembers = ref<User[]>([]);

  // Le user à qui on envoit un direct message
    const userDirectMessage = ref<User>();

  // Les users que l'on souhaite invité dans un channel privé
    const usersInvite = ref<User[]>([]);

    //const channelsJoin = ref<boolean>();
    const newOwner = ref<User>();
    const channelType = ref<number>();
    //const channelTypeUpdate = ref<number>();

    const arrayTime = ref<string[]>(["00:00:15", "00:15:00", "00:30:00", "01:00:00", "02:00:00", "12:00:00", "23:59:59", "indefinite time"])
    const timeLeft = ref<string>('');
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

    const updateMember = (userID: number) => {
      
      for (const chan of allChannels.value) {
        const members = chan.members;
        const index =  members.findIndex((el: User) => el.id === userID);
        if (index != -1) {
          chan.isMember = true;
        }
        else {
          chan.isMember = false;
        }
      }
    }

    const updateOwner = (userID: number) => {
      if (userID != -1) {
        Get('/users/search?id=' + userID.toString() + '&ownerChannels').then(res => {
          const ownerChannels = res.data[0].ownerChannels;
          for (const chan of allChannels.value) {
            const index = ownerChannels.findIndex((el: Channel) => el.id === chan.id)
            if (index != -1) {
              chan.isOwner = true;
            }
            else {
              chan.isOwner= false;
            }
          }
        })
      }
    }

    const updateInvite = (userID: number) => {
      for (const chan of allChannels.value) {
        if (isInvite(chan, userID) == true) {
          addChannelInvite(chan)
        }
      }
    }

    const getChannelByID = (id: number): Channel => {
      const index = channels.value.findIndex(
        (el: Channel) => el.id === id
      );
        return channels.value[index];
    }

    const getChannelByName = (channelName: string | undefined): Channel | null => {
      if (channelName != undefined) {
        const index = channels.value.findIndex(
          (el: Channel) => el.name === channelName
        );
        if (index != -1) {
          return channels.value[index];
        }
      }
      return null;
    }

    const deleteChannel = (id: number) => {
      let index = channels.value.findIndex((el: Channel) => el.id === id);
      if (index != -1) {
        channels.value.splice(index, 1);
      }
      index = allChannels.value.findIndex((el: Channel) => el.id === id);
      if (index != -1) {
        allChannels.value.splice(index, 1);
      }
    }

    const updateChannel = (id: number, updatedData: Channel, userID: number) => {
      if (isInvite(updatedData, userID)) {
        const index = channelsInvite.value.findIndex((el: Channel) => el.id === id);
        channelsInvite.value.splice(index, 1, { ...channelsInvite.value[index], ...updatedData });
      }
      if (isMember(updatedData, userID)) {
        const index = channels.value.findIndex((el: Channel) => el.id === id);
        channels.value.splice(index, 1, { ...channels.value[index], ...updatedData });
      }
      const index = allChannels.value.findIndex((el: Channel) => el.id === id);
      allChannels.value.splice(index, 1, { ...allChannels.value[index], ...updatedData });
    }

    const isAdmin = (channel_item: Channel | undefined, userID: number | undefined ) => {
      if (channel_item != undefined) {
        if (userID != undefined) {
          const admins  = channel_item.admins;
          const index = admins.findIndex((el: User) => el.id === userID);
          if (index != -1) {
            return true;
          }
        }
      }
      return false;
    }

    const isOwner = (channel_item: Channel | undefined, userID: number | undefined) => {
      if (channel_item != undefined) {
        if (userID != undefined) {
          const owner = channel_item.owner;
          if (owner.id === userID){
            return true;
          }
        }
      }
      return false
    }

    const isMember = (channel_item: Channel | undefined, userID: number ) => {
      if (channel_item != undefined) {
        const members  = channel_item.members;
        const index = members.findIndex((el: User) => el.id === userID);
        if (index != -1) {
          return true;
        }
      }
      return false;
    }

    const isBan = (channel_item: Channel | undefined, userID: number | undefined) => {
      if (channel_item != undefined) {
        if (userID != undefined) {
          const bans = channel_item.bans;
          if (bans != undefined) {
            const index = bans.findIndex((el: any) => el.user.id === userID);
            if (index != -1) {
              return true;
            }
          }
        }
      }
      return false;
    }

    const isMute = (channel_item: Channel | undefined, userID: number) => {
      if (channel_item != undefined) {
        const mutes = channel_item.mutes;
        if (mutes != undefined) {
          const index = mutes.findIndex((el: any) => el.user.id === userID);
          if (index != -1) {
            return true;
          }
        }
      }
      return false;
    }

    const isInvite = (channel_item: Channel | undefined, userID: number) => {
      if (channel_item != undefined) {
      const users = channel_item.invites;
      const index = users.findIndex((el: User) => el.id === userID);
      if (index != -1) {
        return true;
      }
    }
    return false;
    }

    const addUserInvite = (user: User) => {
      usersInvite.value.push(user);
    }

    const deleteUserInvite = (index: number) => {
      usersInvite.value?.splice(index, 1);
    }

    const addChannelInvite = (channel: Channel) => {
      channelsInvite.value.push(channel);
    }

    const deleteChannelInvite = (channel: Channel) => {
      const index = channelsInvite.value.findIndex((el: Channel) => el.id === channel.id);
      channelsInvite.value?.splice(index, 1);
    }

    return {
        allChannels,
        channels,
        channel,
        //channelsJoin,
        channelJoin,
        channelLeave,
        channelsInvite,
        channelUpdate,
        newOwner,
        usersMembers,
        userDirectMessage,
        usersInvite,
        channelType,
        arrayTime,
        timeLeft,
        //channelTypeUpdate,
        createChannel,
        joinChannel,
        leaveChannel,
        updateMember,
        updateOwner,
        updateInvite,
        getChannelByID,
        getChannelByName,
        deleteChannel,
        updateChannel,
        isAdmin,
        isOwner,
        isMember,
        isBan,
        isMute,
        isInvite,
        addUserInvite,
        deleteUserInvite,
        addChannelInvite,
        deleteChannelInvite
    };
});