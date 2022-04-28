<script setup lang="ts">
import { onBeforeMount, onUnmounted, onUpdated } from "vue";

import { storeToRefs } from "pinia";

import { useUserStore } from "@/stores/user";
import { useChannelStore } from "@/stores/channel";

import { Get } from "@/services/requests";

import ChatMenu from "./ChatMenu.vue";
import ChatUsers from "./ChatUsers.vue";
import ChatMessages from "./ChatMessages.vue";

const userStore = useUserStore();
const { loggedUser, socketChat, usersBlocked } = storeToRefs(userStore);

const channelStore = useChannelStore();
const {
  allChannels,
  newOwner,
  channelType
} = storeToRefs(channelStore);

onUpdated(() => {
  scrollFunction();
});

onBeforeMount(async () => {
  Get("/channels/search?&members&invites&bans&mutes").then((res) => {
    if (res.status == 200) {
      allChannels.value = res.data;
      if (loggedUser.value != undefined) {
        channelStore.updateInvite(loggedUser.value?.id)
          Get("/users/search?id=" + loggedUser.value?.id + "&banChannels&muteChannels&blockedUsers").then((res) => {
            channelStore.updateBanMute(res.data);
            usersBlocked.value = res.data[0].blockedUsers;
          })
      }
    }
  });

  newOwner.value = undefined;
  channelType.value = 0;
});

onUnmounted(() => {
  socketChat.value?.off("newMessage");
  socketChat.value?.off("newChannel");
  socketChat.value?.off("deleteChannel");
  socketChat.value?.off("joinChannel");
  socketChat.value?.off("updateChannel");
  socketChat.value?.off("inviteChannel");
});

const scrollFunction = () => {
  const scroll = document.getElementById("scroll-bar");
  if (scroll != null) {
    scroll.scrollTop = scroll.scrollHeight;
  }
};

</script>

<template>
  <div class="container-fluid">
    <div class="row-chat padding-chat">
      <div class="col-md-3 col-chat">
        <div class="scrollspy-example my-5 px-2 py-2" style="min-height: 80vh">
          <ChatMenu />
        </div>
      </div>
      <div class="col-md-5 col-chat ms-auto">
        <div class="" style="min-height: 90vh; width: 100%">
          <ChatMessages />
        </div>
      </div>

      <div class="col-md-3 col-chat ms-auto">
        <div class="scrollspy-example my-5 px-2 py-2" style="min-height: 80vh">
          <ChatUsers />
          <!---->
          <!---->
          <!---->
          <!-- <div v-if="channel != undefined">
          <div v-if="usersMembers">
            <div class="">
              <div class="list-group" v-for="user in usersMembers" :key="user.id">
                <UserCard :user="user"/> -->

          <!--<div v-if="channelStore.isBan(channel, user.id) == false">
                  <a  class="list-group-item list-group-item-action"> {{user.username}} =>

                    <div v-if="channelStore.isAdmin(channel, user.id)">
                      Admin
                      <div v-if="channelStore.isOwner(channel, loggedUser?.id) && loggedUser?.id != user.id">
                        <button @click="socketChat.emit('updateMember', channel?.id, {removeAdmins: [{id: user.id}]}, null, loggedUser)" type="button" class="btn btn-danger btn-channel btn-sm">
                          Remove admin
                        </button>
                      </div>
                    </div>

                    <div v-else-if="channelStore.isMember(channel, user.id)">
                      Member
                      <div v-if="channelStore.isOwner(channel, loggedUser?.id)">
                        <button @click="socketChat.emit('updateMember', channel?.id, {addAdmins: [{id: user.id}]}, null, loggedUser)" type="button" class="btn btn-success btn-channel btn-sm">
                          Add admin
                        </button>
                      </div>
                      <div v-if="channelStore.isAdmin(channel, loggedUser?.id)">
                        <div v-if="!channelStore.isAdmin(channel, user.id) && !channelStore.isBan(channel, user.id)">
                          <button @click="socketChat.emit('updateMember', channel?.id, {addBans: [{id: user.id}], addMutes: [{id: user.id}]}, null, loggedUser)" type="button" class="btn btn-warning btn-channel btn-sm">
                            Ban
                          </button>
                        </div>
                        <div v-if="!channelStore.isAdmin(channel, user.id) && !channelStore.isMute(channel, user.id)">
                          <button @click="socketChat.emit('updateMember', channel?.id, {addMutes: [{id: user.id}]}, null, loggedUser)" type="button" class="btn btn-warning btn-channel btn-sm">
                            Mute
                          </button>
                        </div>
                      </div>
                    </div>

                    <div v-if="user.id != loggedUser?.id && channel.isDirectChannel == false">
                      <button @click="userDirectMessage = user" type="button" class="btn btn-info btn-channel btn-sm" data-bs-toggle="modal" data-bs-target="#directMessage">
                        Send message
                      </button>
                    </div>

                    <div v-if="loggedUser?.id != user.id && !channelStore.isAdmin(channel, user.id) && channelStore.isMute(channel, user.id)">
                      <button @click="socketChat.emit('updateMember', channel?.id, {removeMutes: [{id: user.id}]}, null, loggedUser)" type="button" class="btn btn-warning btn-channel btn-sm">
                        Remove mute
                      </button>
                    </div>
                  </a>
                </div>-->

          <!-- </div> -->

          <!-- <div v-if="channel.bans.length > 0">
                *** Users Bans ***
              </div>
              <div class="list-group" v-for="user in usersMembers" :key="user.id">
                <div v-if="channelStore.isBan(channel, user.id) == true">
                  <a  class="list-group-item list-group-item-action"> {{user.username}} =>

                    <div v-if="channelStore.isMember(channel, user.id)">
                      Member
                      <div v-if="channelStore.isOwner(channel, loggedUser?.id)">
                        <button @click="socketChat.emit('updateMember', channel?.id, {addAdmins: [{id: user.id}], removeBans: [{id: user.id}], removeMutes: [{id: user.id}]}, null, loggedUser)" type="button" class="btn btn-success btn-channel btn-sm">
                          Add admin
                        </button>
                      </div>
                      <div v-if="channelStore.isAdmin(channel, loggedUser?.id)">
                        <button @click="socketChat.emit('updateMember', channel?.id, {removeBans: [{id: user.id}], removeMutes: [{id: user.id}]}, null, loggedUser)" type="button" class="btn btn-warning btn-channel btn-sm">
                          Remove ban
                        </button>
                      </div>
                    </div>

                    <div v-if="user.id != loggedUser?.id && channel.isDirectChannel == false">
                      <button @click="userDirectMessage = user" type="button" class="btn btn-info btn-channel btn-sm" data-bs-toggle="modal" data-bs-target="#directMessage">
                        Send message
                      </button>
                    </div>

                  </a>
                </div>
              </div> -->

          <!-- </div>
          </div>
        </div> -->
          <!---->
          <!---->
          <!---->
        </div>
      </div>
    </div>
  </div>

</template>

<style>

.chatMenu {
  flex: 2;
  text-align: center;
  margin-top: 10px;
}

.form {
  background: rgba(0, 0, 0, 0.15);
  padding: 0.25rem;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  height: 3rem;
  box-sizing: border-box;
}

.input {
  border: none;
  padding: 0 1rem;
  flex-grow: 1;
  border-radius: 2rem;
  margin: 0.25rem;
}

.msg {
  list-style-type: none;
  border-radius: 2rem;
  margin-left: 10px;
  margin-right: 5px;
}

:root {
  --clr-neon: hsl(317 100% 54%);
  --clr-bg: hsl(323 21% 16%);
}

.padding-chat {
  padding: 1% !important;
  padding-top: 5% !important;
  padding-bottom: 5% !important;
}
.col-chat {
  min-height: 90vh;
  width: -webkit-fill-available;
  justify-content: center;
  text-decoration: none;
  border: #fff961 3px solid;
  background-color: transparent;
  border-radius: 0.25em;
  text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3), 0 0 0.45em currentColor;
  box-shadow: inset 0 0 0.5em 0 #fff961, 0 0 0.5em 0 #fff961;
  transition: all 0.5s;
  border-radius: 50px !important;
}

.row-chat {
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 0;
  display: flex;
  flex-wrap: wrap;
}

.scrollspy-example {
  position: relative;
  height: 100px;
  margin-top: 0.5rem;
  overflow: auto;
}

.scrollspy-example::-webkit-scrollbar {
  width: 8px;
}

.scrollspy-example::-webkit-scrollbar-track {
  background: transparent;
}

.scrollspy-example::-webkit-scrollbar-thumb {
  background-color: rgb(32, 31, 31);
  border-radius: 20px;
}

.horizontal-line-bottom {
  border-bottom: #fff961 1.5px solid;
  display: block;
  height: 60px;
  text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3), 0 0 0.45em currentColor;
}

.horizontal-line-top {
  border-top: #fff961 1.5px solid;
  display: block;
  height: 60px;
  text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3), 0 0 0.45em currentColor;

  background: rgba(0, 0, 0, 0.15);
  padding: 0.25rem;

  bottom: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;
}

.horizontal-line-center {
  margin: auto;
  border-top: #fff961 1.5px solid;
  display: block;
  text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3), 0 0 0.45em currentColor;
  background: rgba(0, 0, 0, 0.15);
  padding: 0.25rem;
  bottom: 0;
  left: 0;
  right: 0;
  box-sizing: border-box;
}

.chat-message-left,
.chat-message-right {
  display: flex;
}

.chat-message-left {
  margin-right: auto;
  border: #1a52ed 3px solid;
}

.chat-message-right {
  flex-direction: row-reverse;
  margin-left: auto;
  border: #3ded29 3px solid;
}

.chat-message-delete {
  margin: auto;
  border: #db810c 3px solid;
}

.timer {
  margin: auto;
  border: #ba0f1b 3px solid;
}

.text-msg-left .font-weight-bold {
  color: #1a52ed;
  text-align: start;
}
.text-msg-left {
  color: white;
  padding: 10px;
}

.text-msg-right .font-weight-bold {
  color: #3ded29;
  text-align: end;
}
.text-msg-right {
  color: white;
  padding: 10px;
}

@media (min-width: 950px) {
  .my-col-sm-3 {
    flex: 0 0 auto !important;
    width: 16.66666667% !important;
  }
}
@media (min-width: 950px) {
  .my-col-sm-5 {
    flex: 0 0 auto !important;
    width: 58.33333333%;
  }
}
</style>
