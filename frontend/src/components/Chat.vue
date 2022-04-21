<script setup lang="ts">
import { onMounted, onBeforeMount, onUnmounted, onUpdated, ref } from "vue";

import { storeToRefs } from "pinia";

import { useUserStore } from "@/stores/user";
import { useMessageStore } from "@/stores/message";
import { useChannelStore } from "@/stores/channel";
import { useInputStore } from "@/stores/input";

import type { Channel } from "@/models/channel.model";

import { Get } from "@/services/requests";

import ChatMenu from "./ChatMenu.vue";
import ChatUsers from "./ChatUsers.vue";

const userStore = useUserStore();
const { loggedUser, users, isAuthenticated, socketChat } = storeToRefs(userStore);

const messageStore = useMessageStore();
const { messages, textMsg, textDirectMsg } = storeToRefs(messageStore);

const inputStore = useInputStore();
const { input } = storeToRefs(inputStore);

const channelStore = useChannelStore();
const {
  allChannels,
  // channels,
  channel,
  //channelsJoin,
  // channelJoin,
  //channelLeave,
  //channelsInvite,
  //channelUpdate,
  newOwner,
  // usersMembers,
  // userDirectMessage,
  // usersInvite,
  channelType,
  //channelTypeUpdate
  timeLeft
} = storeToRefs(channelStore);

onUpdated(() => {
  scrollFunction();
});

onBeforeMount(async () => {
  Get("/channels/search?&members&invites").then((res) => {
    if (res.status == 200) {
      allChannels.value = res.data;
      if (loggedUser.value != undefined) {
        channelStore.updateInvite(loggedUser.value?.id)
      }
    }
  });
 
  //channelsJoin.value = true;
  newOwner.value = undefined;
  channelType.value = 0;
  //channelTypeUpdate.value = 1;
});

onUnmounted(() => {
  socketChat.value?.off("newMessage");
  socketChat.value?.off("newChannel");
  socketChat.value?.off("deleteChannel");
  socketChat.value?.off("joinChannel");
  socketChat.value?.off("updateChannel");
  socketChat.value?.off("inviteChannel");
});

onMounted(() => {
  Get("/auth/status").then((res) => {
    if (res.status == 403) {
      console.log("[App CHAT] isAuthenticated: ", false);
      isAuthenticated.value = false;
    } else {
      console.log("[App CHAT] isAuthenticated: ", true);
      isAuthenticated.value = true;
      loggedUser.value = res.data;
      console.log("[App CHAT] loggedUser: ", res.data);
    }
  });
});


const test2 = () => {
  console.log("Socket 2 => ", socketChat.value)
}

///////////////////////
//  MESSAGES
///////////////////////
// const displayMessages = (channel_item: Channel) => {
//   Get('/channels/search?id=' + channel_item.id.toString() + '&messages&owner&admins&members&mutes&bans').then(res => {
//     channel.value = res.data[0]
//     messages.value = res.data[0].messages
//     usersMembers.value = res.data[0].members
//   })
// }

const sendNewMessage = (channelId: Number | undefined) => {
  if (channelId != undefined) {
    if (textMsg.value !== "") {
      const newMessage = {
        author: loggedUser.value?.id,
        channel: { id: channelId },
        data: textMsg.value,
      };
      socketChat.value?.emit("newMessage", newMessage, loggedUser.value);
    }
  }
  textMsg.value = "";
};

// // Créer un nouveau channel entre 2 users si n'existe pas encore et permet d'envoyer des messages privés
// const sendDirectMessage = async () => {
//   const name1 = `${userDirectMessage.value?.username} ${loggedUser.value?.username}`;
//   const name2 = `${loggedUser.value?.username} ${userDirectMessage.value?.username}`;
//   const channelItem = allChannels.value.find((el: Channel) => el.name === name1 || el.name === name2);
//   if (channelItem == undefined) {
//     const newChannel = {
//       name: `${userDirectMessage.value?.username} ${loggedUser.value?.username}`,
//       isPrivate: true,
//       password: null,
//       owner: { id: loggedUser.value?.id },
//       admins: [{ id: loggedUser.value?.id }, {id: userDirectMessage.value?.id}],
//       members: [{ id: loggedUser.value?.id }, {id: userDirectMessage.value?.id}],
//       isDirectChannel: true,
//       isProtected: false
//     };
//     socketChat.emit('newChannel', newChannel, {author: loggedUser.value?.id, channel: {id: null}, data: textDirectMsg.value}, loggedUser.value)
//   }
//   else {
//     socketChat.emit('newMessage', {author: loggedUser.value?.id, channel: {id: channelItem?.id}, data: textDirectMsg.value}, loggedUser.value)
//     textDirectMsg.value = '';
//   }
// }

///////////////////////
//  CHANNELS
///////////////////////

// Créer un nouveau channel
// const createChannel = () => {
//   if (input.value.create_channel !== '')
//   {
//     let obj: any = {}
//     let users: any = []
//     usersInvite.value.forEach((value) => {
//       obj = {id: value.id}
//       users.push(obj)
//     })
//     const newChannel = {
//       name: input.value.create_channel,
//       isPrivate: channelType.value == 2 ? true : false,
//       password: channelType.value == 3 ? input.value.password : null,
//       isProtected: channelType.value == 3 ? true : false,
//       owner: { id: loggedUser.value?.id },
//       admins: [{ id: loggedUser.value?.id }],
//       members: [{ id: loggedUser.value?.id }],
//       invites: channelType.value== 2 ? users : []
//     };
//     socketChat.emit('newChannel', newChannel, null ,loggedUser.value)
//     inputStore.$reset();
//   }
// }

// Mettre à jour jour un tableau de users qui recevront une invitation à un channel
// const updateUsersInvite = (user: User) => {
//   if (usersInvite.value != undefined) {
//     const index =  usersInvite?.value.findIndex((el: User) => el.id === user.id);
//     if (index != -1) {
//       channelStore.deleteUserInvite(index);
//     }
//     else {
//       channelStore.addUserInvite(user);
//     }
//   }
// }

// Rejoindre un channel
// const joinChannel = () => {
//   socketChat.emit('joinChannel', loggedUser.value?.id, channelJoin.value, input.value.password)
//   inputStore.$reset();
// }

// Supprimer un channel
// const deleteChannel = () => {
//   socketChat.emit('deleteChannel', channelLeave.value?.id)
// }

// Accepter une invitation à rejoindre un channel
// const acceptInviteChannel = () => {
//   console.log(`Accept invitation => ${channelJoin.value?.name}`)
//   const updateChannel = {
//     removeInvites: [{id: loggedUser.value?.id}],
//     addMembers: [{id: loggedUser.value?.id}]
//   };
//   if (channelJoin.value != undefined) {
//     socketChat.emit('updateMember', channelJoin.value.id, updateChannel, {author: loggedUser.value?.id, channel: {id: channelJoin.value.id}, data: `${loggedUser.value?.username} has joined the channel.`}, loggedUser.value)
//     channelStore.deleteChannelInvite(channelJoin.value)
//     channelStore.joinChannel(channelJoin.value)
//     channelStore.updateMember()
//   }
// }

// // Refuser une invitation à rejoindre un channel
// const refuseInviteChannel = () => {
//   console.log(`Refuse invitation => ${channelJoin.value?.name}`)
//   if (channelJoin.value != undefined) {
//     socketChat.emit('updateMember', channelJoin.value.id, {removeInvites: [{id: loggedUser.value?.id}]}, null, loggedUser.value)
//     channelStore.deleteChannelInvite(channelJoin.value)
//   }
//   inputStore.$reset();
// }

// Mettre à jour un channel
// const updateChannel = () => {
//   if (channelUpdate.value !== undefined)
//   {
//     let obj: any = {}
//     let users: any = []
//     usersInvite.value.forEach((value) => {
//       obj = {id: value.id}
//       users.push(obj)
//     })
//     const updateChannel = {
//       name: input.value.update_channel_name,
//       isPrivate: channelTypeUpdate.value == 2 ? true : false,
//       password: channelTypeUpdate.value == 3 ? input.value.password : null,
//       isProtected: channelTypeUpdate.value == 3 ? true : false,
//       invites: channelTypeUpdate.value == 2 ? users : []
//     }
//     socketChat.emit('updateChannel', input.value.channel_id, updateChannel)
//   }
//   inputStore.$reset();
// };

// Quitter un channel si pas Owner
// const leaveChannelIfNotOwner = (channel_item: Channel) => {
//   Get('/channels/search?id=' + channel_item.id.toString() + '&admins&mutes&bans&members').then(res => {
//     [channelLeave.value] = res.data;
//     if (loggedUser.value != null) {
//       if (channelStore.isAdmin(channelLeave.value, loggedUser.value.id) == true) {
//         socketChat.emit('updateMember', channelLeave.value?.id, {removeAdmins: [{id: loggedUser.value?.id}], removeMembers: [{id: loggedUser.value?.id}]}, {author: loggedUser.value.id, channel: {id: channelLeave.value?.id}, data: `${loggedUser.value?.username} has leaved the channel.`}, loggedUser.value)
//       }
//       else {
//         if (channelStore.isBan(channelLeave.value, loggedUser.value.id) == true) {
//           socketChat.emit('updateMember', channelLeave.value?.id, {removeBans: [{id: loggedUser.value?.id}], removeMutes: [{id: loggedUser.value?.id}], removeMembers: [{id: loggedUser.value?.id}]}, {author: loggedUser.value.id, channel: {id: channelLeave.value?.id}, data: `${loggedUser.value?.username} has leaved the channel.`}, loggedUser.value)
//         }
//           else if (channelStore.isMute(channelLeave.value, loggedUser.value.id) == true) {
//             socketChat.emit('updateMember', channelLeave.value?.id, {removeMutes: [{id: loggedUser.value?.id}], removeMembers: [{id: loggedUser.value?.id}]}, {author: loggedUser.value.id, channel: {id: channelLeave.value?.id}, data: `${loggedUser.value?.username} has leaved the channel.`}, loggedUser.value)
//         }
//         else {
//           socketChat.emit('updateMember', channelLeave.value?.id, {removeMembers: [{id: loggedUser.value?.id}]}, {author: loggedUser.value.id, channel: {id: channelLeave.value?.id}, data: `${loggedUser.value?.username} has leaved the channel.`}, loggedUser.value)
//         }
//       }
//       channelStore.leaveChannel(channel_item);
//       channel.value = channel.value?.id === channel_item.id ? undefined : channel.value;
//       messages.value = channel.value?.id === channel_item.id ? [] : messages.value;
//       channelStore.updateMember()
//     }
//   })
// }

// // Quitter un channel si Owner
// const leaveChannelIfOwner = () => {
//   if (loggedUser.value != null) {
//     if (channelLeave.value !== undefined) {
//       if (channelStore.isAdmin(channelLeave.value, newOwner.value != undefined ? newOwner.value.id : -1) == true) {
//         socketChat.emit('updateMember', channelLeave.value.id, {owner: {id: newOwner.value?.id}, removeAdmins: [{id: loggedUser.value?.id}], removeMembers: [{id: loggedUser.value?.id}]}, {author: loggedUser.value.id, channel: {id: channelLeave.value.id}, data: `${loggedUser.value?.username} the channel owner has left the channel - - ${newOwner.value?.username} becomes the owner.`}, loggedUser.value)
//       }
//       else {
//         if (channelStore.isBan(channelLeave.value, loggedUser.value.id) == true) {
//           socketChat.emit('updateMember', channelLeave.value?.id, {owner: {id: newOwner.value?.id}, addAdmins: [{id: newOwner.value?.id}], removeMutes: [{id: newOwner.value?.id}], removeBans: [{id: loggedUser.value?.id}], removeAdmins: [{id: loggedUser.value?.id}], removeMembers: [{id: loggedUser.value?.id}]}, {author: loggedUser.value.id, channel: {id: channelLeave.value?.id}, data: `${loggedUser.value?.username} has leaved the channel.`}, loggedUser.value)
//         }
//         else if (channelStore.isMute(channelLeave.value, newOwner.value != undefined ? newOwner.value.id : -1) == true) {
//             socketChat.emit('updateMember', channelLeave.value?.id, {owner: {id: newOwner.value?.id}, addAdmins: [{id: newOwner.value?.id}], removeMutes: [{id: newOwner.value?.id}], removeAdmins: [{id: loggedUser.value?.id}], removeMembers: [{id: loggedUser.value?.id}]}, {author: loggedUser.value.id, channel: {id: channelLeave.value?.id}, data: `${loggedUser.value?.username} has leaved the channel.`}, loggedUser.value)
//         }
//         else {
//           socketChat.emit('updateMember', channelLeave.value?.id, {owner: {id: newOwner.value?.id}, removeAdmins: [{id: loggedUser.value?.id}], addAdmins: [{id: newOwner.value?.id}], removeMembers: [{id: loggedUser.value?.id}]}, {author: loggedUser.value.id, channel: {id: channelLeave.value?.id}, data: `${loggedUser.value?.username} has leaved the channel.`}, loggedUser.value)
//         }
//       }
//       channelStore.leaveChannel(channelLeave.value);
//       channel.value = channel.value?.id === channelLeave.value?.id ? undefined : channel.value;
//       messages.value = channel.value?.id === channelLeave.value?.id ? [] : messages.value;
//       channelStore.updateMember()
//     }
//   }
// }

//////////////////////////////////////////
// CHANGER AVEC LES ID QUI RESTE UNIQUE //
//////////////////////////////////////////
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

const scrollFunction = () => {
  const scroll = document.getElementById("scroll-bar");
  if (scroll != null) {
    scroll.scrollTop = scroll.scrollHeight;
  }
};

// const timeLeft = ref<string>('');
// new Date (channel.bans[0].date).toLocaleTimeString('fr-FR')
// const counter = ref<number>(10);
// let intervalId :any;// = null;

// const stopTimer = () => {
//   clearInterval(intervalId);
//   // document.getElementById("timer").innerHTML = "TERMINE!";	
// }

// const timer = () => {
//     counter.value--;
//     if(counter.value == 0) stopTimer();
//     else {	
      
//       // date1.ToString("T", CultureInfo.CreateSpecificCulture("es-ES"))
//         // document.getElementById("timer").innerHTML = counter + " secondes restantes";


//     const event = new Date('August 19, 1975 23:15:30 GMT-3:00');

//     console.log(event.toUTCString());
//     // expected output: Wed, 20 Aug 1975 02:15:30 GMT

//     console.log(event.getUTCHours());
//     // expected output: 2

//     event.setUTCHours(23);

//     console.log(event.toUTCString());
//     // expected output: Wed, 20 Aug 1975 23:15:30 GMT
//     }	
// }
// const startTimer = () => {
//   intervalId = setInterval(timer, 1000);
// }
</script>

<template>
  <div class="container-fluid">
    <div class="row-chat padding-chat">
      <div class="col-md-3 col-chat">
        <div class="scrollspy-example my-5 px-2 py-2" style="min-height: 80vh">
          <ChatMenu
            :searchName="searchName"
          />
        </div>
      </div>
      <div class="col-md-5 col-chat ms-auto">
        <div class="" style="min-height: 90vh; width: 100%">
          <!---->
          <!---->
          <!---->
          <div class="horizontal-line-bottom">
            <h1 class=" text-truncate px-4" style="line-height: 1.5 !important">
              {{ searchName(channel) }}
            </h1>
          </div>
          <div
            id="scroll-bar"
            class="scrollspy-example"
            style="height: 80vh; width: 100%; overflow-y: scroll"
            tabindex="0"
          >
            <!--Affichage des messages du channel selectionné-->
            <div v-if="channel != undefined">
              <div v-if="channelStore.isBan(channel, loggedUser?.id) == false">
                <div v-if="messages">
                  <div
                    id=""
                    style="display: flex"
                    v-for="item in messages"
                    :key="item.id"
                  >
                    <div
                      v-if="channelStore.isBan(channel, item.author.id) == true"
                    >
                      *** Message delete ***
                    </div>
                    <div v-else-if="item.author.id != loggedUser?.id">
                      <div class="msg chat-message-left mb-4">
                        <div
                          style="
                            margin: auto;
                            padding-left: 10px;
                            padding-right: 10px;
                          "
                        >
                          <img
                            v-bind:src="item.author.avatar"
                            alt="Avatar"
                            class="rounded-circle mr-1"
                            width="40"
                            height="40"
                          />
                        </div>
                        <div class="flex-shrink-1 rounded ml-3 text-msg-left">
                          <div class="font-weight-bold mb-1">
                            {{ item.author.username }}
                          </div>
                          <div style="text-align: start">{{ item.data }}</div>
                        </div>
                      </div>
                    </div>
                    <div v-else style="display: contents">
                      <div class="msg chat-message-right mb-4">
                        <div
                          style="
                            margin: auto;
                            padding-left: 10px;
                            padding-right: 10px;
                          "
                        >
                          <img
                            v-bind:src="item.author.avatar"
                            alt="Avatar"
                            class="rounded-circle mr-1"
                            width="40"
                            height="40"
                          />
                        </div>
                        <div class="flex-shrink-1 rounded mr-3 text-msg-right">
                          <div class="font-weight-bold mb-1">
                            {{ item.author.username }}
                          </div>
                          <div style="text-align: start">{{ item.data }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else id="timer">
                You are banned from this channel for {{ timeLeft }} time
              </div>
            </div>
          </div>

          <div class="horizontal-line-top">
            <form
              @submit.prevent.trim.lazy="sendNewMessage(channel?.id)"
              method="POST"
              class="form"
            >
              <input v-model="textMsg" type="text" class="input" />
              <button
                type="submit"
                class="rounded btn-channel wrapper-icon-leave ms-auto"
              >
                <i class="fa-solid fa-paper-plane"></i>
              </button>

              <!-- <input type="submit" value="Send" class="send"/> -->
            </form>
          </div>
          <!---->
          <!---->
          <!---->
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

  <!-- Modal -->
  <!--Formulaire pour envoyer un direct message-->
  <!-- <div class="modal fade modal-dialog-scrollable" id="directMessage" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">

      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">
              {{ userDirectMessage?.username }}
            </h5>
            <button
              @click="textDirectMsg = ''"
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>

          <div class="modal-body">
            <div class="form form-new-channel">
              <input v-model="textDirectMsg" type="text" class="input" />
            </div>
          </div>

          <div class="modal-footer">
            <button
              @click="textDirectMsg = ''"
              type="button"
              class="btn btn-danger"
              data-bs-dismiss="modal"
            >
              Cancel
            </button>
            <button
              @click="sendDirectMessage"
              type="submit"
              class="btn btn-info"
              data-bs-dismiss="modal"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div> -->
</template>

<style>
.chat {
  height: calc(100vh - 70px);
  display: flex;
}

.chatMenu {
  flex: 2;
  text-align: center;
  margin-top: 10px;
}

/*.btn-channel {
  margin-bottom: 5px;
}*/

.chatBox {
  flex: 6;
  text-align: center;
}

.chatFriends {
  flex: 2;
  text-align: center;
}

.chatFriendsInput {
  width: 90%;
  padding: 10px 0;
  border: none;
  border-bottom: 1px solid rgb(168, 164, 164);
  background-color: rgba(209, 209, 208, 0.542);
}

.chatBoxWrapper {
  height: 100%;
}

.chatMenuWrapper,
.chatFriendsWrapper {
  padding: 10px;
}

.vertical-line {
  border-left: 2px solid rgba(170, 170, 167, 0.542);
  display: inline-block;
  height: 100%;
  flex: 0;
}

/* .scroller {
  overflow-y: scroll;
  scrollbar-width: thin;
  height: 100%;
} */

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

.form-new-channel {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
  align-items: center;
}

.input {
  border: none;
  padding: 0 1rem;
  flex-grow: 1;
  border-radius: 2rem;
  margin: 0.25rem;
}

.send {
  background: #333;
  border: none;
  padding: 0 1rem;
  margin: 0.25rem;
  border-radius: 3px;
  outline: none;
  color: #fff;
}

.msg {
  list-style-type: none;
  /* margin: 0; */
  /* padding: 0; */
  /* padding: 0.5rem 1rem; */
  /* margin-bottom: 10px; */
  /* background: #efefef; */
  border-radius: 2rem;
  /* border: #fff961 3px solid; */
  margin-left: 10px;
  margin-right: 5px;
}

.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  /*height: 100vh;
    background: black*/
}

:root {
  --clr-neon: hsl(317 100% 54%);
  --clr-bg: hsl(323 21% 16%);
}

.neons {
  font-size: 25px;
  height: 60px;
  width: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-family: "Balsamiq Sans", cursive;
  text-decoration: none;
  color: var(--clr-neon);
  border: var(--clr-neon) 3px solid;
  background-color: transparent;
  border-radius: 0.25em;
  text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3), 0 0 0.45em currentColor;
  box-shadow: inset 0 0 0.5em 0 var(--clr-neon), 0 0 0.5em 0 var(--clr-neon);
  transition: all 0.5s;
}

.neons:hover {
  background-color: var(--clr-neon);
  color: #fff;
}

/*--------------------------*/
/*--------------------------*/
/*--------------------------*/
.padding-chat {
  padding: 1% !important;
  padding-top: 5% !important;
  padding-bottom: 5% !important;
}
.col-chat {
  min-height: 90vh;
  width: -webkit-fill-available;
  /* display: flex; */
  justify-content: center;
  text-decoration: none;
  /* color: #fff961; */
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

/*--------------------------*/
/*--------------------------*/
/*--------------------------*/
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

.chat-message-left,
.chat-message-right {
  display: flex;
  flex-shrink: 0;
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
