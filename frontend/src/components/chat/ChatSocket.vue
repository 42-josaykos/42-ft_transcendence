<script setup lang="ts">

import { io } from "socket.io-client";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useMessageStore } from "@/stores/message";
import { useChannelStore } from "@/stores/channel";
import { Get } from "@/services/requests";

import type { Channel } from "@/models/channel.model";
import type { Message } from "@/models/message.model";
import type { User } from "@/models/user.model";


const userStore = useUserStore();
const { loggedUser, isAuthenticated, socketChat } = storeToRefs(userStore);

const messageStore = useMessageStore();
const { messages } = storeToRefs(messageStore);

const channelStore = useChannelStore();
const {
  channel,
  channelJoin,
  usersMembers,
  usersInvite,
} = storeToRefs(channelStore);

if (isAuthenticated.value) {

  if (socketChat.value == undefined) {
    socketChat.value = io("http://localhost:4000/chat", {
      withCredentials: true,
    });
  }

  socketChat.value.on('askInfo', () => {
    socketChat.value?.emit('sendInfo', loggedUser.value);
  })

  socketChat.value.on("newMessage", async (newMessage: Message) => {
    if (channel.value != undefined && channel.value.id == newMessage.channel.id) {
      messageStore.createMessage(newMessage);
    }
    else if (channel.value != undefined && channel.value.id != newMessage.channel.id && loggedUser.value?.id == newMessage.author.id) {
      await Get(
        `/channels/search?id=${newMessage.channel.id.toString()}&members&bans&mutes&admins&owner&messages`
      ).then((res) => {
        if (res.status == 200) {
          if (res.data[0].isDirectChannel) {
            channel.value = res.data[0];
            usersMembers.value = res.data[0].members;
            messageStore.sortMessages(res.data[0].messages);
          }
        }
      });
    }
  });

  socketChat.value.on("newChannel", async (data: any) => {
    const { newChannel, message, user } = data;
    if (loggedUser.value != undefined) {
      if (loggedUser.value?.id === newChannel.owner.id) {
        messages.value = [];
        if (newChannel.isPrivate == true && newChannel.isDirectChannel == false) {
          socketChat.value?.emit(
            "inviteChannel",
            newChannel,
            usersInvite.value ? usersInvite.value : null
          );
        }
        await Get(
          `/channels/search?id=${newChannel.id.toString()}&members&bans&mutes&admins&owner`
        ).then((res) => {
          if (res.status == 200) {
            channel.value = res.data[0];
            usersMembers.value = res.data[0].members;
          }
        });
      }
      channelStore.createChannel(newChannel);
      channelStore.updateMember(loggedUser.value?.id);
      channelStore.updateOwner(loggedUser.value.id);
      if (message != null && loggedUser.value.id == newChannel.owner.id) {
        socketChat.value?.emit("newMessage", message, user);
      }
    }
  });

  socketChat.value.on("updateInvite", (data: any) => {
    const { inviteChannel, inviteBool } = data;
    if (loggedUser.value != undefined) {
      channelStore.deleteChannelInvite(inviteChannel);
      if (inviteBool == true) {
        channelStore.updateMember(loggedUser.value.id);
      }
    }
  })

  socketChat.value.on("inviteChannel", (inviteChannel: Channel) => {
    channelStore.addChannelInvite(inviteChannel);
  });

  socketChat.value.on("uninviteChannel", (uninviteChannel: Channel) => {
    channelStore.deleteChannelInvite(uninviteChannel);
  });

  socketChat.value.on("joinChannel", () => {
    if (loggedUser.value != undefined) {
      if (channelJoin.value != undefined) {
        channel.value = channelJoin.value;
        messages.value = channelJoin.value.messages;
        socketChat.value?.emit(
          "updateMember",
          channelJoin.value.id,
          { addMembers: [{ id: loggedUser.value?.id }] },
          {
            author: loggedUser.value?.id,
            channel: { id: channelJoin.value?.id },
            data: `${loggedUser.value?.username} has joined the channel.`,
          },
          loggedUser.value
        );
        channelStore.updateMember(loggedUser.value?.id);
      }
    }
  });

  socketChat.value.on("deleteChannel", (channelID: number) => {
    if (channel.value?.id == channelID) {
      channel.value = undefined;
      messages.value = [];
    }
    channelStore.deleteChannel(channelID);
  });

  socketChat.value.on("updateMember", (updateChannel: Channel) => {
    if (loggedUser.value != null) {
      channelStore.updateChannel(
        updateChannel.id,
        updateChannel,
        loggedUser.value.id
      );
      channelStore.updateMember(loggedUser.value.id);
      channelStore.updateOwner(loggedUser.value.id);
      if (channel.value?.id === updateChannel.id) {
        Get(`/channels/search?id=${channel.value.id.toString()}&owner&admins&members&mutes&bans&messages`
        ).then((res) => {
          if (res.status == 200) {
            usersMembers.value = res.data[0].members;
            messageStore.sortMessages(res.data[0].messages)
          }
        });
        channel.value = updateChannel;
      }
    }
  });

  socketChat.value.on('userAddBan', (updateChannel: Channel) => {
    if (channel.value != undefined && loggedUser.value != null && channel.value.id == updateChannel.id) {
      channelStore.handleBanMute({...updateChannel}, true)
    }
  })

  socketChat.value.on('userRemoveBan', (updateChannel: Channel) => {
    if (loggedUser.value != null) {
      channelStore.stopTimer({...updateChannel}, true)
      if (channel.value != undefined && channel.value.id == updateChannel.id) {
        channel.value = updateChannel;
      }
    }
  })

  socketChat.value.on('userAddMute', (updateChannel: Channel) => {
    if (channel.value != undefined && loggedUser.value != null && channel.value.id == updateChannel.id) {
      channelStore.handleBanMute({...updateChannel}, false)
    }
  })

  socketChat.value.on('userRemoveMute', (updateChannel: Channel) => {
    if (undefined && loggedUser.value != null) {
      channelStore.stopTimer({...updateChannel}, false)
      if (channel.value != undefined && channel.value.id == updateChannel.id) {
        channel.value = updateChannel;
      }
    }
  })

  socketChat.value.on('addUserBlocked', (userBlocked: User) => {
    if (loggedUser.value != null) {
      userStore.addUserBlocked(userBlocked)
    }
  })

  socketChat.value.on('removeUserBlocked', (userBlocked: User) => {
    if (loggedUser.value != null) {
      userStore.removeUserBlocked(userBlocked.id)
    }
  })

  socketChat.value.on('userRemoveMember', (updateChannel: Channel) => {
    if (loggedUser.value != null) {
      channelStore.updateChannel(updateChannel.id, updateChannel, loggedUser.value.id)
      channelStore.updateMember(loggedUser.value.id)
    }
  })

  socketChat.value.on('addUserFriend', (userFriend: User) => {
    if (loggedUser.value != null) {
      userStore.addUserFriend(userFriend)
    }
  })

  socketChat.value.on('removeUserFriend', (userFriend: User) => {
    if (loggedUser.value != null) {
      userStore.removeUserFriend(userFriend.id)
    }
  })
} 
</script>

<template>
</template>