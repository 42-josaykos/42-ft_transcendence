<script setup lang="ts">

import { onMounted } from 'vue';

import { storeToRefs} from 'pinia';

import { useUserStore } from '@/stores/user';
import { useMessageStore } from '@/stores/message';
import { useChannelStore } from '@/stores/channel';
import { useInputStore } from '@/stores/input';

import type { Channel } from '@/models/channel.model';
import type { Message } from '@/models/message.model';
import type { User } from '@/models/user.model';

import { Delete, Get, Patch, Post } from '@/services/requests';

import { io } from 'socket.io-client';
import UserDebugVue from './debug/UserDebug.vue';

const socket = io("http://localhost:4000", {
  withCredentials: true
});

const userStore = useUserStore();
const { loggedUser, users } = storeToRefs(userStore);

const messageStore = useMessageStore();
const { messages } = storeToRefs(messageStore);

const inputStore = useInputStore();
const { input } = storeToRefs(inputStore);

const channelStore = useChannelStore();
const { allChannels, channels, channel, channelsJoin, channelJoin, channelLeave, channelsInvite, channelUpdate, newOwner, usersInvite} = storeToRefs(channelStore);

const baseUrlMsg = '/messages';
const baseUrlChannel = '/channels';

onMounted(async () => {
  Get('/users/' + loggedUser.value?.id + '/channels/member').then(res => channels.value = res.data);
  Get('/channels').then(res => allChannels.value = res.data);
  channelsJoin.value = true;
  newOwner.value = -1;
});

///////////////////////
//  MESSAGES
///////////////////////

const displayMessages = (channel_item: Channel) => {
  Get(baseUrlChannel + '/' + channel_item.id.toString()).then(res => {
    if (res.status == 200) {
      channel.value = res.data;
      messages.value = res.data.messages;
    }
  });
}

const handleSubmitNewMessage = (channelId: Number) => {
  if (input.value.create !== '') {
   // if (channel.value !== undefined) {
      const newMessage = {
          author: loggedUser.value?.id,
          channel: {id: channelId},
          data: input.value.create
        };
        Post(baseUrlMsg, newMessage)
        .then(res => {
          socket.emit('msgToServer', newMessage)
        })
    //}
    inputStore.$reset();
  }
}

socket.on('msgToClient', (newMessage: Message) => {
 if (channel.value != undefined && channel.value.id == newMessage.channel.id) {
   messageStore.createMessage(newMessage);
 }
})

///////////////////////
//  CHANNELS
///////////////////////

// Créer un nouveau channel
const handleSubmitNewChannel = () => {
  if (input.value.create_channel !== '')
  {
    const newChannel = {
      name: input.value.create_channel,
      isPrivate: input.value.channel_type == 2 ? true : false,
      password: input.value.channel_type == 3 ? input.value.password : null,
      owner: { id: loggedUser.value?.id },
      admins: [{ id: loggedUser.value?.id }],
      members: [{ id: loggedUser.value?.id }],
    };
    Post(baseUrlChannel, newChannel).then(res => {
      if (res.status == 201) {
        channelStore.joinChannel(res.data);
        socket.emit('channelToServer', res.data);
        channel.value = res.data;
        messages.value = [];
        if (res.data.isPrivate == true) {
          socket.emit('inviteJoinChannelToServer', res.data, ...usersInvite.value)
        }
      }
    })
    inputStore.$reset();
  }
}

// Permet d'attraper l'information qu'un nouveau channel a été créé
socket.on('channelToClient', (newChannel: Channel) => {
  if (loggedUser.value != undefined) {
    channelStore.createChannel(newChannel);
    channelStore.updateMember();
    channelStore.updateOwner(loggedUser.value.id)
  }
})

socket.on('inviteJoinChannelToClient', (inviteChannel: Channel) => {
  console.log("channelInvite => ", inviteChannel);
  channelStore.addChannelInvite(inviteChannel)
})

// Mettre à jour jour un tableau de users qui recevront une invitation à un channel
const updateUsersInvite = (user: User) => {
  if (usersInvite.value != undefined) {
    const index =  usersInvite?.value.findIndex((el: User) => el.id === user.id);
    if (index != -1) {
      channelStore.deleteUserInvite(index);
    }
    else {
      channelStore.addUserInvite(user);
    }
  }
  console.log("updateUSerImvite => ", usersInvite.value)
}

// Rejoindre un channel
const joinChannel = () => {
  const updateChannel = {
    addMembers: [{id: loggedUser.value?.id}]
  };
  if (channelJoin.value != undefined) {
    if (channelJoin.value.password != null) {
      if (channelJoin.value.password !== input.value.password) {
        console.log("WRONG PASSWORD")
        inputStore.$reset();
        return ;
      }
    }
    Patch(baseUrlChannel + '/' + channelJoin.value?.id.toString(), updateChannel).then(res => {
      channelStore.joinChannel(res.data);
      channel.value = channelStore.getChannelByID(res.data.id);
      messages.value = res.data.messages;
      channelStore.updateMember();
      input.value.create = `${loggedUser.value?.username} has joined the channel.`;
      if (channelJoin.value != undefined) {
        handleSubmitNewMessage(channelJoin.value?.id)
      }
    })
  }
  inputStore.$reset();
}

///////////////////////////////////
// A REFAIRE QUAND ROUTES PRETES //
///////////////////////////////////
// Accepter une invitation à rejoindre un channel
const acceptInviteChannel = () => {
  console.log(`Accept invitation => ${channelJoin.value?.name}`)
  /*
    Supprimer avec une requete PATCH dans la bdd au niveau de inviteChannels
    Supprimer dans le store => deleteChannelInvite
  */
  if (channelJoin.value != undefined) {
    channelStore.deleteChannelInvite(channelJoin.value)
    joinChannel()
  }

}

// Refuser une invitation à rejoindre un channel
const refuseInviteChannel = () => {
  console.log(`Refuse invitation => ${channelJoin.value?.name}`)
  /*
    Supprimer avec une requete PATCH dans la bdd au niveau de inviteChannels
    Supprimer dans le store => deleteChannelInvite
  */
  if (channelJoin.value != undefined) {
    channelStore.deleteChannelInvite(channelJoin.value)
  }
  inputStore.$reset();
}

// Quitter un channel si pas Owner
const leaveChannelIfNotOwner = (channel_item: Channel) => {
  let updateChannel: any ;
  Get(baseUrlChannel + '/' + channel_item.id.toString()).then(res => {
    console.log("res.data = ", res.data)
    if (loggedUser.value != null) {
      if (channelStore.isAdmin(res.data, loggedUser.value.id) == true ) {
        updateChannel = {
          removeAdmins: [{id: loggedUser.value?.id}],
          removeMembers: [{id: loggedUser.value?.id}]
        };
      }
      else {
        if (channelStore.isBan(res.data, loggedUser.value.id) == true) {
          updateChannel = {
            removeBans: [{id: loggedUser.value?.id}]
          };
        }
        else if (channelStore.isMute(res.data, loggedUser.value.id) == true) {
          updateChannel = {
            removeMutes: [{id: loggedUser.value?.id}],
            removeMembers: [{id: loggedUser.value?.id}]
          };
        }
        else {
          updateChannel = {
            removeMembers: [{id: loggedUser.value?.id}]
          };
        }
      }
      Patch(baseUrlChannel + '/' + channel_item.id.toString(), updateChannel).then(res => {
        input.value.create = `${loggedUser.value?.username} has leaved the channel.`;
        handleSubmitNewMessage(channel_item.id)
        channelStore.leaveChannel(res.data);
        channel.value = channel.value?.id === channel_item.id ? undefined : channel.value;
        messages.value = channel.value?.id === channel_item.id ? [] : messages.value;
        channelStore.updateMember();
      }) 
    }
  })
}

// Quitter un channel si Owner
const leaveChannelIfOwner = () => {
  let updateChannel: any ;
  if (loggedUser.value != null) {
    if (channelLeave.value!== undefined) {
      if (channelStore.isAdmin(channelLeave.value, newOwner.value != undefined ? newOwner.value : -1) == true) {
        updateChannel = {
          owner: {id: newOwner.value},
          removeAdmins: [{id: loggedUser.value?.id}],
          removeMembers: [{id: loggedUser.value?.id}],
        }
      }
      else {
        if (channelStore.isMute(channelLeave.value, newOwner.value != undefined ? newOwner.value : -1) == true) {
          updateChannel = {
            owner: {id: newOwner.value},
            addAdmins: [{id: newOwner.value}],
            removeMutes: [{id: newOwner.value}],
            removeAdmins: [{id: loggedUser.value?.id}],
            removeMembers: [{id: loggedUser.value?.id}],
   
          }
        }
        else {
          updateChannel = {
            owner: {id: newOwner.value},
            removeAdmins: [{id: loggedUser.value?.id}],
            addAdmins: [{id: newOwner.value}],
            removeMembers: [{id: loggedUser.value?.id}],
          }
        }
      }
      Patch(baseUrlChannel + '/' + channelLeave.value.id.toString(), updateChannel).then(res => {
        input.value.create = `${loggedUser.value?.username} the channel owner is leave - - ${res.data.owner.username} becomes the owner.`;
        handleSubmitNewMessage(res.data.id)
        channelStore.leaveChannel(res.data);
        channel.value = channel.value?.id === channelLeave.value?.id ? undefined : channel.value;
        messages.value = channel.value?.id === channelLeave.value?.id ? [] : messages.value;
        channelStore.updateMember();
        channelStore.updateOwner(loggedUser.value != null ? loggedUser.value.id : -1)
        socket.emit('newOwnerToServer', res.data.owner.id)
      }) 
    }
  }
}

socket.on('newOwnerToClient', (newOwnerID: number) => {
  if (loggedUser.value?.id === newOwnerID) {
    channelStore.updateOwner(newOwnerID);
  }
})

// Supprimer un channel
const deleteChannel = () => {
  Delete(baseUrlChannel + '/' + channelLeave.value?.id.toString()).then(res => {
    if (res.status == 200) {
      socket.emit('deleteChannelToServer', channelLeave.value?.id)
    }
  });
}

socket.on('deleteChannelToClient', (channelID: number) => {
  if (channel.value?.id == channelID) {
    channel.value = undefined;
    messages.value = [];
  }
  channelStore.deleteChannel(channelID)
})

// Mettre à jour un channel
const updateChannel = () => {
  const updateChannel = {
    name: input.value.update_channel_name
  }
  console.log("update == ", updateChannel)
  Patch(baseUrlChannel + '/' + input.value.channel_id, updateChannel).then(res => {
    if (res.status == 200) {
      socket.emit('updateChannelToServer', res.data)
    }
    inputStore.$reset();
  });
};

socket.on('updateChannelToClient', (updateChannel: Channel) => {
  if (loggedUser.value != null) {
    channelStore.updateChannel(updateChannel.id, updateChannel, loggedUser.value.id);
    channel.value = channel.value?.id === updateChannel.id ? updateChannel : channel.value;
  }
})

</script>

<template>
  <h2>Chat</h2>
  <div class="container-fluid chat">
    <div class="chatMenu">
      <div class="chatMenuWrapper">

        <!--Permet d'afficher mes channels-->
        <button @click="channelsJoin = true" type="button" class="btn btn-secondary send">Channels</button>
        <!--Permet d'afficher tous les channels-->
        <button @click="channelsJoin = false, channelStore.updateMember(), channelStore.updateOwner(loggedUser != null ? loggedUser.id : -1)" type="button" class="btn btn-secondary send">All Channels</button>
        <!--Permet d'afficher les inviations aux channels-->
        <button @click="channelsJoin = undefined" type="button" class="btn btn-secondary send">Invite
        <div v-if="channelsInvite.length > 0">
          <span class="badge rounded-pill bg-danger">{{channelsInvite.length}}</span>
        </div>
        </button>

        <!--Affichage de mes channels-->
        <div v-if="channelsJoin == true">
          <div v-if="channels">
            <ul v-for="(item, index) in channels" :key="index" class="list-group">
              <!--Permet d'afficher les messages appartenant au channel selectionné-->
              <button @click="displayMessages(item)" type="button" class="btn btn-secondary btn-channel"> {{item.name}} </button>
            </ul>
          </div>
        </div>

        <!--Affichage de tous les channels-->
        <div v-else-if="channelsJoin == false">
          <div v-if="allChannels">
            <ul v-for="(item, index) in  allChannels" :key="index" class="list-group">

                <div>Is member : {{item.isMember}}</div>
                <!--Permet d'afficher les messages appartenant au channel selectionné si je suis membre du channel-->
                <div v-if="item.isMember">
                  <button @click="displayMessages(item)" type="button" class="btn btn-secondary btn-channel">
                    <span v-if="item.isPrivate == true" class="badge bg-success">Private</span>
                    <span v-if="item.isPrivate == false" class="badge bg-success">Public</span>
                    <span v-if="item.password != null" class="badge bg-warning">Pass : {{item.password}}</span>
                    {{item.name}}
                  </button>
                  <div v-if="item.isOwner">
                    <!--<button type="button" class="btn btn-danger btn-channel" @click="leaveChannelIfOwner(item)" >Leave Owner</button>-->
                    <button type="button" class="btn btn-danger btn-channel btn-sm" @click="Get(baseUrlChannel + '/' + item.id.toString()).then(res => channelLeave = res.data)" data-bs-toggle="modal" data-bs-target="#leaveChannel">
                      Leave Owner
                    </button>
                    <button type="button" class="btn btn-success btn-channel btn-sm" @click="Get(baseUrlChannel + '/' + item.id.toString()).then(res => {channelUpdate = res.data; input.update_channel_name = res.data.name, input.channel_id = res.data.id})" data-bs-toggle="modal" data-bs-target="#updateChannel">
                      Update Channel
                    </button>
                  </div>
                  <div v-else>
                    <button type="button" class="btn btn-danger btn-channel btn-sm" @click="leaveChannelIfNotOwner(item)" >Leave</button>
                  </div>
                </div>

                <!--Permet de bloquer l'accès aux messages appartenant au channel selectionné si je ne suis pas membre du channel-->
                <div v-else>
                  <button type="button" class="btn btn-secondary btn-channel">
                    <span v-if="item.isPrivate == true" class="badge bg-success">Private</span>
                    <span v-if="item.isPrivate == false" class="badge bg-success">Public</span>
                    <span v-if="item.password != null" class="badge bg-warning">Pass : {{item.password}}</span>
                    {{item.name}}
                  </button> 
                  <div v-if="item.isPrivate == false">
                    <button type="button" class="btn btn-primary btn-channel btn-sm" @click="channelJoin = item" data-bs-toggle="modal" data-bs-target="#joinChannel" >Join</button>
                  </div>
                </div>
            </ul>
          </div>
        </div>

        <div v-else>
          <div v-if="channelsInvite">
            <ul v-for="(item, index) in  channelsInvite" :key="index" class="list-group">
              <button type="button" class="btn btn-secondary btn-channel">
                {{item.name}}
              </button> 
              <button type="button" class="btn btn-primary btn-channel btn-sm" @click="channelJoin = item, acceptInviteChannel()">Join</button>
              <button type="button" class="btn btn-danger btn-channel btn-sm" @click="channelJoin = item, refuseInviteChannel()">Refuse</button>
            </ul>
          </div>
        </div>

        <div>

        <!--Permet de créer un nouveau channel-->
        <button @click="Get('/users').then(res => users = res.data); usersInvite = []" type="button" class="send" data-bs-toggle="modal" data-bs-target="#newChannel">
          New Channel
        </button>

        </div>
      </div>
    </div>

    <span class="vertical-line"></span>

    <div class="chatBox">
      <div class="chatBoxWrapper">{{channel?.name ? channel.name : "Message"}}

        <!--Affichage des messages du channel selectionné-->
        <div v-if="channel != undefined">
          <div v-if="messages" class="scroller">
            <ul id="msg" v-for="item in messages" :key="item.id">
              Message: {{ item.data }}
            </ul>
          </div>

          <!--Permet d'envoyer un nouveau message dans le channel selectionné'-->
          <form @submit.prevent.trim.lazy="handleSubmitNewMessage(channel?.id)" method="POST" class="form">
            <input v-model="input.create" type="text" class="input"/>
            <input type="submit" value="Send" class="send"/>
          </form>

        </div>

      </div>
    </div>

    <span class="vertical-line"></span>

    <!--Permettra de visualiser les amis??-->
    <div class="chatFriends">
      <div class="chatFriendsWrapper">
        <input type="text" placeholder="search for friends" class="chatFriendsInput" />
      </div>
    </div>

    <!-- Modal -->
    <!--Formulaire pour créer un nouveau channel-->
    <div class="modal fade modal-dialog-scrollable" id="newChannel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">

      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">New Channel</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
     
            <div class="form form-new-channel">
              <label for="name">Channel name:</label>
              <input v-model="input.create_channel" type="text" class="input"/>
            </div>

            <div class="form-check form-check-inline">
              <input @click="input.channel_type = 1" class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" checked>
              <label class="form-check-label" for="inlineRadio1">Public</label>
            </div>
            <div class="form-check form-check-inline">
              <input @click="input.channel_type = 2" class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2">
              <label class="form-check-label" for="inlineRadio2">Private</label>
            </div>
            <div class="form-check form-check-inline">
              <input @click="input.channel_type = 3" class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2">
              <label class="form-check-label" for="inlineRadio2">Protected</label>
            </div>

            <div v-if="input.channel_type == 3">
              <div class="form form-new-channel">
                <label for="name">Password:</label>
                <input v-model="input.password" type="text" class="input"/>
              </div>
            </div>
            <div v-else-if="input.channel_type == 2">
              <div v-if="users.length != 1">
                  Choose users :
                  <div class="scroller">
                    <div class="list-group" v-for="user in users" :key="user.id">
                      <div v-if="user.id != loggedUser?.id">
                        <a  class="list-group-item list-group-item-action"> {{user.username}} =>
                          <button @click="updateUsersInvite(user)" type="button" class="btn btn-success btn-channel btn-sm">
                              Invite               
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
              </div>
            </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
            <button @click="handleSubmitNewChannel" type="submit" class="btn btn-primary" data-bs-dismiss="modal">Create</button>
          </div>

        </div>
      </div>
    </div>

    <!--Formulaire pour rejoindre un channel-->
    <div class="modal fade modal-dialog-scrollable" id="joinChannel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">

      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Join : {{ channelJoin?.name}}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div v-if="channelJoin?.password != null">
            <div class="modal-body">
              This channel is protected with a password.
              <div class="form form-new-channel">
                <label for="name">Enter Password:</label>
                <input v-model="input.password" type="text" class="input"/>
              </div>
            </div>
          </div>


          <div class="modal-footer">
            <button @click="inputStore.$reset(); channelJoin = undefined" type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
            <button @click="joinChannel()" type="submit" class="btn btn-primary" data-bs-dismiss="modal">Join</button>
          </div>

        </div>
      </div>
    </div>


    <!--Formulaire pour détruire un channel ou définir un nouveau Owner-->
    <div class="modal fade modal-dialog-scrollable" id="leaveChannel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">

      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Leave channel : {{channelLeave?.name}}</h5>
              <button @click="newOwner = -1" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            Click here if you want to permanently delete this channel :
            <div class="d-grid gap-2">
              <button @click="deleteChannel" type="button" class="btn btn-danger" data-bs-dismiss="modal">Delete</button>
            </div>
            <br>
            <div v-if="channelLeave?.members.length != 1">
                Otherwise choose a new channel owner :
                <div v-if="channelLeave?.members" class="scroller">
                  <div class="list-group" v-for="item in channelLeave.members" :key="item.id">
                    <div v-if="item.id != loggedUser?.id">
                      <a  class="list-group-item list-group-item-action"> {{item.username}} =>
                        <button @click="newOwner = item.id" type="button" class="btn btn-danger btn-channel" data-bs-toggle="modal" data-bs-target="#validateNewOwner">
                            New Owner                
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="newOwner = -1" type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
          </div>

        </div>
      </div>
    </div>

    <!--Formulaire pour valider le nouveau Owner-->
    <div class="modal fade modal-dialog-scrollable" id="validateNewOwner" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            Are you sure ?
              <button @click="leaveChannelIfOwner" type="button" class="btn btn-primary btn-sm" data-bs-dismiss="modal">Yes</button>
              <button @click="newOwner = -1" type="button" class="btn btn-danger btn-sm"  data-bs-toggle="modal" data-bs-target="#leaveChannel">No</button>
          </div>
        </div>
      </div>
    </div>

    <!--Formulaire pour modifier un channel-->
    <div class="modal fade modal-dialog-scrollable" id="updateChannel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">

      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Update : {{ input.update_channel_name }}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
     
            <div class="form form-new-channel">
              <label for="name">Channel name:</label>
              <input v-model="input.update_channel_name" type="text" class="input"/>
            </div>

            <!--<div class="form-check form-switch">
              <input class="form-check-input" type="checkbox" id="flexSwitchCheckChecked" checked @click="input.is_private = !input.is_private">
              <label class="form-check-label" for="flexSwitchCheckChecked">{{input.is_private ? "Private channel" : "Public channel"}} {{input.is_private}}</label>
            </div>-->

            <div class="form form-new-channel">
              <label for="name">Password:</label>
              <input v-model="input.password" type="text" class="input"/>
            </div>

          </div>

          <div class="modal-footer">
            <button @click="inputStore.$reset(); channelUpdate = undefined" type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
            <button @click="updateChannel" type="submit" class="btn btn-primary" data-bs-dismiss="modal">Update</button>
          </div>

        </div>
      </div>
    </div>

  </div>

</template>

<style>
.chat {
  height: calc(100vh - 70px);
  display: flex;
}

.chatMenu {
  flex: 2;
  text-align: center;
}

.btn-channel {
  margin-bottom: 5px;
}

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
.chatFriendsWrapper{
  padding: 10px;
  height: 100%;
}

.vertical-line{
	border-left: 2px solid rgba(170, 170, 167, 0.542);
	display: inline-block;
	height: 100%;
  flex: 0;
	}

.scroller {
  overflow-y: scroll;
  scrollbar-width: thin;
  height: 100%;
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
  backdrop-filter: blur(10px);

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
  border: none; padding: 0 1rem;
  margin: 0.25rem; border-radius: 3px;
  outline: none;
  color: #fff;
}

#msg {
  list-style-type: none;
  margin: 0;
  padding: 0;
  padding: 0.5rem 1rem;
  margin-bottom: 5px;
  background: #efefef;
  border-radius: 2rem;
}

</style>