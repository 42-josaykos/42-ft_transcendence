<script setup lang="ts">
import { io } from "socket.io-client";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { Get } from "@/services/requests";
import type { User } from "@/models/user.model";
import { useMessageStore } from '@/stores/message';
import { useChannelStore } from '@/stores/channel';
import { useMatchStore } from '@/stores/match';

const { userClick, loggedUser, usersOnline, isAuthenticated, statusSocket, users, usersFriends, leaderboard } = storeToRefs(useUserStore());
const { channel, usersMembers, channelLeave, channelUpdate, allChannels } = storeToRefs(useChannelStore());
const { matches } = storeToRefs(useMatchStore());

console.log("[StatusStore] isAuthenticated: ", isAuthenticated.value);

if (isAuthenticated.value) {
  console.log("[StatusStore] loggedUser: ", loggedUser.value);
  statusSocket.value = io("ws://localhost:3615/status", {
    withCredentials: true,
  });

  // After socker connection, the server needs the logged user id
  statusSocket.value.on("requestUserInfo", function (data: any) {
    console.log("Sending info: ", loggedUser.value);
    statusSocket.value?.emit("connection", loggedUser.value);
  });

  // Listening for updates on the user list
  statusSocket.value.on("update", (data: number[]) => {
    usersOnline.value = data;
    console.log("[StatusStore] usersOnline: ", usersOnline.value);
  });

  statusSocket.value.on('updateUser', async (data: User) => {
    if (userClick.value?.id == data.id) {
      userClick.value = data;
    }
    if (loggedUser.value?.id == data.id) {
      loggedUser.value = data;
    }
    if(userClick.value && userClick.value.id == data.id) {
      userClick.value = data;
      const response = await Get(`/users/${userClick.value?.id}/matches/played`);
      if (response.status === 200) {
        matches.value = response.data.reverse();
      }
    }
    const response = await Get('/stats');
    if (response.status === 200) {
      leaderboard.value = response.data;
    }
    if (channel.value) {
      Get(
        '/channels/search?id=' +
          channel.value.id.toString() +
          '&messages&owner&admins&members&mutes&bans&invites'
      ).then(res => {
        channel.value = res.data[0];
        useMessageStore().sortMessages(res.data[0].messages);
        usersMembers.value = res.data[0].members;
        if (channelUpdate.value) {
          channelUpdate.value = res.data[0]
        }
        if (channelLeave.value) {
          channelLeave.value = res.data[0]
        }
      });
    }
    if (users.value) {
      await Get('/users/search').then((res) => {if (res.status == 200) {users.value = res.data}});
    }
    await Get(`/users/search?id=${loggedUser.value?.id}&friends`).then((res: any) => {
      if (res.status == 200) {
        usersFriends.value = res.data[0].friends;
      }
    })
  })
}
</script>

<template></template>
