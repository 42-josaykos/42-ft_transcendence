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

import { Get, Patch, Post } from '@/services/requests';

import { io } from 'socket.io-client';

const socket = io("http://localhost:4000");

const userStore = useUserStore();
const { loggedUser } = storeToRefs(userStore);

const messageStore = useMessageStore();
const { messages } = storeToRefs(messageStore);

const inputStore = useInputStore();
const { input } = storeToRefs(inputStore);

const channelStore = useChannelStore();
const { allChannels, channels, channel, channelsJoin } = storeToRefs(channelStore);

const baseUrlMsg = '/messages';
const baseUrlChat = '/channels';

onMounted(async () => {
  Get('/users/' + loggedUser.value?.id + '/channels/member').then(res => channels.value = res.data);
  Get('/channels').then(res => allChannels.value = res.data);
  socket.emit('createConnection', loggedUser.value);
  channelsJoin.value = true;
});

///////////////////////
//  MESSAGES
///////////////////////

const displayMessages = (channel_item: Channel) => {
  Get(baseUrlChat + '/' + channel_item.id.toString()).then(res => {
    if (res.status == 200) {
      channel.value = res.data;
      messages.value = res.data.messages;
    }
  });
}

const handleSubmitNewMessage = () => {
  if (input.value.create !== '') {
    if (channel.value !== undefined) {
      const newMessage = {
          author: loggedUser.value?.id,
          channel: {id: channel.value.id},
          data: input.value.create
        };
        Post(baseUrlMsg, newMessage)
        .then(res => {
          socket.emit('msgToServer', newMessage)
        })
    }
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

const handleSubmitNewChannel = () => {
  if (input.value.create_channel !== '')
  {
      const newChannel = {
          name: input.value.create_channel,
          //isPrivate: input.value.is_private,
          password: input.value.password != null ? input.value.password : null,
          owner: { id: loggedUser.value?.id },
          members: [{ id: loggedUser.value?.id }],
      };
      Post(baseUrlChat, newChannel).then(res => {
        if (res.status == 201) {
          channelStore.joinChannel(res.data);
          socket.emit('channelToServer', res.data);
          channel.value = res.data;
          messages.value = [];

        }
      })

    inputStore.$reset();
  }
}

socket.on('channelToClient', (newChannel: Channel) => {
  channelStore.createChannel(newChannel);
  Get('/channels').then(res => {
    allChannels.value = res.data;
    channelStore.updateMember();
  });
})

const joinChannel = (channel_item: Channel) => {
  const updateChannel = {
    addMembers: [{id: loggedUser.value?.id}]
  };
  Patch(baseUrlChat + '/' + channel_item.id.toString(), updateChannel).then(res => {
    channelStore.joinChannel(res.data);
    channel.value = channelStore.getChannelByID(res.data.id);
    messages.value = res.data.messages;
    channelStore.updateMember();
    input.value.create = `${loggedUser.value?.username} has joined the channel.`;
    handleSubmitNewMessage()
  })
}

</script>

<template>
  <h2>Chat</h2>
  <div class="container-fluid chat">
    <div class="chatMenu">
      <div class="chatMenuWrapper">

        <!--Permet d'afficher mes channels-->
        <button @click="channelsJoin = true" type="button" class="btn btn-secondary send">Channels</button>
        <!--Permet d'afficher tous les channels-->
        <button @click="channelsJoin = false, channelStore.updateMember()" type="button" class="btn btn-secondary send">All Channels</button>

        <!--Affichage de mes channels-->
        <div v-if="channelsJoin">
          <div v-if="channels">
            <ul v-for="(item, index) in channels" :key="index" class="list-group">
              <!--Permet d'afficher les messages appartenant au channel selectionné-->
              <button @click="displayMessages(item)" type="button" class="btn btn-secondary btn-channel"> {{item.name}} </button>
            </ul>
          </div>
        </div>

        <!--Affichage de tous les channels-->
        <div v-else>
          <div v-if="allChannels">
            <ul v-for="(item, index) in  allChannels" :key="index" class="list-group">

                <div>{{item.isMember}}</div>
                <!--Permet d'afficher les messages appartenant au channel selectionné si je suis membre du channel-->
                <div v-if="item.isMember">
                  <button @click="displayMessages(item)" type="button" class="btn btn-secondary btn-channel">
                    <span v-if="item.isPrivate" class="badge bg-success">P</span>
                    <span v-if="item.password != ''" class="badge bg-warning">Pwd : {{item.password}}</span>
                    {{item.name}} 
                    <span class="badge bg-danger">Leave</span>
                  </button>
                </div>

                <!--Permet de bloquer l'accès aux messages appartenant au channel selectionné si je ne suis pas membre du channel-->
                <div v-else>
                  <button type="button" class="btn btn-secondary btn-channel">
                    <span v-if="item.isPrivate" class="badge bg-success">P</span>
                    <span v-if="item.password != ''" class="badge bg-warning">Pwd : {{item.password}}</span>
                    {{item.name}} 
                    <span class="badge bg-primary" @click="joinChannel(item)" >Join</span>
                  </button>
                </div>
            </ul>
          </div>
        </div>
        <div>

        <!--Permet de créer un nouveau channel-->
        <button type="button" class="send" data-bs-toggle="modal" data-bs-target="#newChannel">
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
          <form @submit.prevent.trim.lazy="handleSubmitNewMessage" method="POST" class="form">
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
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
            <button @click="handleSubmitNewChannel" type="submit" class="btn btn-primary" data-bs-dismiss="modal">Create</button>
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