import { defineStore, storeToRefs } from "pinia";
import { ref } from "vue";
import type { Channel } from '@/models/channel.model';
import type { User } from "@/models/user.model";
import { Get } from "@/services/requests";
import { useUserStore } from "@/stores/user";
import { useMessageStore } from "@/stores/message";

export const useChannelStore = defineStore('channel', () => {

  const userStore = useUserStore();
  const { loggedUser, socketChat, users, userClick } = storeToRefs(userStore);

  const messageStore = useMessageStore();
  const { stringSendMessage } = storeToRefs(messageStore);

  const allChannels = ref<Channel[]>([]);
  const channelsInvite = ref<Channel[]>([]);
  const channel = ref<Channel>();
  const channelLeave = ref<Channel>();
  const channelJoin = ref<Channel>();
  const channelUpdate = ref<Channel>();

  const usersMembers = ref<User[]>([]);
  const usersInvite = ref<User[]>([]);
  const newOwner = ref<User>();

  const channelType = ref<number>();
  const arrayTime = ref<string[]>(["00:00:15", "00:15:00", "00:30:00", "01:00:00", "02:00:00", "12:00:00", "23:59:59", "indefinite time"])
  const timerIntervalBan = ref<any[]>([]);
  const timerIntervalMute = ref<any[]>([]);

    const createChannel = (newChannel: Channel) => {
      allChannels.value.push(newChannel);
    }

    const getChannelName = (channelID: number) => {
      const name = allChannels.value.find((channel) => channel.id === channelID)?.name
      return name;
    }

    const updateMember = (userID: number | undefined) => {
      if (userID != undefined) {
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
    }

    const updateOwner = (userID: number | undefined) => {
      if (userID != undefined) {
        Get(`/users/search?id=${userID.toString()}&ownerChannels`).then(res => {
          if (res.status == 200) {
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


    const deleteChannel = (id: number) => {
      let index = allChannels.value.findIndex((el: Channel) => el.id === id);
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
      const index = allChannels.value.findIndex((el: Channel) => el.id === id);
      allChannels.value.splice(index, 1, { ...allChannels.value[index], ...updatedData });
    }

    const checkIfUserInTheChannel = () => {
      if (channelUpdate.value != undefined) {
        if (users.value != undefined) {
          for (const user of users.value) {
            if (channelUpdate.value.members.findIndex(el => el.id == user.id) == -1) {
              return false;
            }
          }
        }
      }
      return true;
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

    const isMute = (channel_item: Channel | undefined, userID: number | undefined) => {
      if (channel_item != undefined) {
        if (userID != undefined) {
          const mutes = channel_item.mutes;
          if (mutes != undefined) {
            const index = mutes.findIndex((el: any) => el.user.id === userID);
            if (index != -1) {
              return true;
            }
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

    const secToTime = (sec: number, isBan: boolean, channelId: number) => {
      let strH = "", strM = "", strS = "";
      const hours = Math.floor(sec / 3600);
      sec %= 3600;
      const minutes = Math.floor(sec / 60);
      const seconds = Math.floor(sec % 60);
      if (hours < 10) {
        strH = "0"
      }
      if (minutes < 10) {
        strM = "0"
      }
      if (seconds < 10) {
        strS = "0"
      }
      if (isBan) {
        const index = timerIntervalBan.value.findIndex((el: any) => el.channelId == channelId)
        if (index != -1) {
          timerIntervalBan.value[index].timeLeft = strH + hours + ":" + strM + minutes + ":" + strS + seconds ;
        }
      }
      else {
        const index = timerIntervalMute.value.findIndex((el: any) => el.channelId == channelId)
        if (index != -1) {
          timerIntervalMute.value[index].timeLeft = strH + hours + ":" + strM + minutes + ":" + strS + seconds ;
        }
      }
    }  

    const timer = (dateEnd: any, channelItem: Channel, isBan: boolean) => {
      const dateNow = new Date()
      if (dateNow.getTime() < dateEnd.getTime()) {
        secToTime((dateEnd.getTime() - dateNow.getTime())/1000, isBan, channelItem.id)
      }
      else {
        if (isBan) {
          const index = timerIntervalBan.value.findIndex((el: any) => el.channelId == channelItem.id)
          if (index != -1) {
            clearInterval(timerIntervalBan.value[index].idInterval)
            socketChat.value?.emit('updateMember', channelItem.id, {removeBans: [{user: {id: loggedUser.value?.id}}]}, null, loggedUser.value)
            timerIntervalBan.value.splice(index, 1)
          }
        }
        else {
          const index = timerIntervalMute.value.findIndex((el: any) => el.channelId == channelItem.id)
          if (index != -1) {
            clearInterval(timerIntervalMute.value[index].idInterval)
            socketChat.value?.emit('updateMember', channelItem.id, {removeMutes: [{user: {id: loggedUser.value?.id}}]}, null, loggedUser.value)
            timerIntervalMute.value.splice(index, 1)
          }
        }
      }
    
    }
    
    const handleBanMute = (channelItem: Channel, isBan: boolean) => {
      const channel_item = isBan ? channelItem.bans : channelItem.mutes;
      const index = channel_item.findIndex((el: any) => el.user.id == loggedUser.value?.id)
      const indexBan = timerIntervalBan.value.findIndex((el: any) => el.channelId == channelItem.id)
      const indexMute = timerIntervalMute.value.findIndex((el: any) => el.channelId == channelItem.id)
      if (index != undefined) {
        const dateStart = channel_item[index].date
        const dateTime = channel_item[index].time
        if (dateTime) {
          const splitTime = dateTime?.split(":")
          let dateEnd;
          if (splitTime != undefined && dateStart != null){
            dateEnd = new Date(dateStart)
            dateEnd.setHours(dateEnd.getHours() + Number(splitTime[0]))
            dateEnd.setMinutes(dateEnd.getMinutes() + Number(splitTime[1]))
            dateEnd.setSeconds(dateEnd.getSeconds() + Number(splitTime[2]))
            if (isBan) {
              if (indexBan != -1) {
                setInterval(timer, 1000, dateEnd, channelItem, true);
              }
              else {
                const newTimer = {
                  channelId: channelItem.id,
                  idInterval: setInterval(timer, 1000, dateEnd, channelItem, true),
                  timeLeft: ''
                }
                timerIntervalBan.value.push(newTimer)
              }
            }
            else {
              if (indexMute != -1) {
                setInterval(timer, 1000, dateEnd, channelItem, false);
              }
              else {
                const newTimer = {
                  channelId: channelItem.id,
                  idInterval: setInterval(timer, 1000, dateEnd, channelItem, false),
                  timeLeft: ''
                }
                timerIntervalMute.value.push(newTimer)
              }
            }
          }
        }
        else {
          const newTimer = {
            channelId: channelItem.id,
            timeLeft: ''
          }
          if (isBan) {
            if (indexBan == -1) {
              timerIntervalBan.value.push(newTimer)
            }
            timerIntervalBan.value[index].timeLeft = "undefinite"
          }
          else {
            if (indexMute == -1) {
              timerIntervalMute.value.push(newTimer)
            }
            timerIntervalMute.value[index].timeLeft = "undefinite"
          }
        }
      }
    }

    const updateBanMute = (data: any) => {
      const channelsBan = data[0].banChannels
      const channelsMute = data[0].muteChannels
      if (channelsBan != undefined) {
        for (const ban of channelsBan) {
          const channelItem = allChannels.value.find((el: Channel) => el.id === ban.channel.id)
          if (channelItem != undefined) {
            handleBanMute(channelItem, true)
          }
        }
      }
      if (channelsMute != undefined) {
        for (const mute of channelsMute) {
          const channelItem = allChannels.value.find((el: Channel) => el.id === mute.channel.id)
          if (channelItem != undefined) {
            handleBanMute(channelItem, false)
          }
        }
      }
    }

    const stopTimer = (channelItem: Channel, isBan: boolean) => {
      if (isBan) {
        const index = timerIntervalBan.value.findIndex((el: any) => el.channelId == channelItem.id)
        if (index != -1) {
          clearInterval(timerIntervalBan.value[index].idInterval)
          timerIntervalBan.value.splice(index, 1)
        }
      }
      else {
        const index = timerIntervalMute.value.findIndex((el: any) => el.channelId == channelItem.id)
        if (index !=-1) {
          clearInterval(timerIntervalMute.value[index].idInterval)
          timerIntervalMute.value.splice(index, 1)
        }
      }
    }

    const searchName = (channelItem: Channel | undefined): string => {
      if (channelItem == undefined) {
        return "CHAT";
      }
      if (channelItem.isDirectChannel === false) {
        return channelItem.name;
      }
      const membersChan = channelItem.members;
      const nameChan = membersChan.filter((el) => el.id != loggedUser.value?.id);
      return nameChan[0].username;
    };

    const sendDirectChannel = async (user: User | undefined) => {
      if(allChannels.value.length == 0) {
        const response = await Get('/channels/search?&members&invites&bans&mutes')
        if (response.status == 200) {
          allChannels.value = response.data
        }
      }
      if (user != undefined) {
        const name1 = `${user.id} ${loggedUser.value?.id}`;
        const name2 = `${loggedUser.value?.id} ${user.id}`;
        const channelItem = allChannels.value.find(
          (el: Channel) => el.name === name1 || el.name === name2
        );
        if (channelItem == undefined) {
          const newChannel = {
            name: `${user.id} ${loggedUser.value?.id}`,
            isPrivate: true,
            password: null,
            owner: { id: loggedUser.value?.id },
            admins: [{ id: loggedUser.value?.id }, { id: user.id }],
            members: [{ id: loggedUser.value?.id }, { id: user.id }],
            isDirectChannel: true,
            isProtected: false,
          };
          socketChat.value?.emit(
            "newChannel",
            newChannel,
            {
              author: loggedUser.value?.id,
              channel: { id: null },
              data: stringSendMessage.value,
            },
            loggedUser.value
          );
        } else {
          socketChat.value?.emit(
            "newMessage",
            {
              author: loggedUser.value?.id,
              channel: { id: channelItem?.id },
              data: stringSendMessage.value,
            },
            loggedUser.value
          );
        }
      }
      stringSendMessage.value = "";
      userClick.value = undefined;
    };

    return {
        allChannels,
        channel,
        channelJoin,
        channelLeave,
        channelsInvite,
        channelUpdate,
        newOwner,
        usersMembers,
        usersInvite,
        channelType,
        arrayTime,
        timerIntervalBan,
        timerIntervalMute,
        createChannel,
        getChannelName,
        updateMember,
        updateOwner,
        updateInvite,
        deleteChannel,
        updateChannel,
        checkIfUserInTheChannel,
        isAdmin,
        isOwner,
        isMember,
        isBan,
        isMute,
        isInvite,
        addUserInvite,
        deleteUserInvite,
        addChannelInvite,
        deleteChannelInvite,
        handleBanMute,
        updateBanMute,
        stopTimer,
        searchName,
        sendDirectChannel
    };
});