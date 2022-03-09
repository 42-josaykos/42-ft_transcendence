<script setup lang="ts">
import { Get } from '@/services/requests';
import { useUserStore } from '@/stores/user';
import { useMessageStore } from '@/stores/message';
import { useChannelStore } from '@/stores/channel';
import type { Channel } from '@/models/channel.model'
import type { Message } from '@/models/message.model'
import { useInputStore } from '@/stores/input';
import { storeToRefs} from 'pinia';
import { io } from 'socket.io-client';
import { onMounted, ref } from 'vue';
import { Post, Put, Patch } from '@/services/requests';

const socket = io("http://localhost:4000");

const msg = document.getElementById('msg');

const userStore = useUserStore();
const { loggedUser } = storeToRefs(userStore);

const messageStore = useMessageStore();
const { messages } = storeToRefs(messageStore);

const inputStore = useInputStore();
const { input } = storeToRefs(inputStore);

const chan = document.getElementById('chan');

const channelStore = useChannelStore();
const { channels } = storeToRefs(channelStore);
const { channel } = storeToRefs(channelStore);

const baseUrl = 'http://localhost:3000/messages';
const baseUrlChat = 'http://localhost:3000/channels';

const handleSubmitNewMessage = () => {
  if (input.value.create !== '')
  {
    if (channel.value !== undefined) {
      const newMessage = {
          author: loggedUser.value,
          data: input.value.create,
          channel: channel.value
        };
        console.log("newMessage => ", newMessage)
        channelStore.addMessage(channel.value?.id, newMessage);
        console.log("channels.value = ", channels.value)
        console.log("channel.value = ", channel.value)
console.log("********* = ", channelStore.getChannelByID(channel.value?.id - 1))
        Put(baseUrlChat + '/' + channel.value.id.toString(), channelStore.getChannelByID(channel.value?.id - 1))
        .then(res => console.log("Put RES => ", res))
        socket.emit('msgToServer', newMessage)
        Post(baseUrl, newMessage)
        .then(res => console.log("Post RES => ", res))
    }
    else
      console.log("Channel NULL");
    inputStore.$reset();
  }
}


/* const createMessage = (data: string) => {
   Post(baseUrl, {sender: 1, text: data}).then(res => {
     if (res.status == 201) {
         //Get(baseUrl).then(res => (messages.value = res.data));
       messageStore.createMessage(res.data);
     }
     inputStore.$reset();

   });
 };*/

socket.on('msgToClient', (newMessage: Message) => {
  channelStore.addMessage(newMessage.channel.id, newMessage);
  Get(baseUrlChat).then(res => {
      messages.value = res.data[channel.value?.id - 1].messages;
  })
})

/* const builNewMessage = (message: string) => {
   const li = document.createElement("li");
   li.appendChild(document.createTextNode(message));
   return li;
 }*/

const displayMessages = (id: number) => {
  Get(baseUrlChat).then(res => {
    if (res.status == 200) {
      channel.value = res.data[id - 1];
      messages.value = res.data[id - 1].messages;
    }
  });
}

const handleSubmitNewChannel = () => {
  if (input.value.create_channel !== '')
  {
   // if (channel.value !== undefined) {
      const newChannel = {
          name: input.value.create_channel,
          isPrivate: false,
          password: '',
          messages: [],
          owner: loggedUser.value,
      };
      Post(baseUrlChat, newChannel).then(res => {
        if (res.status == 201) {
          channelStore.createChannel(res.data);
          channel.value = res.data;
          messages.value = [];
          console.log("After Post channel.value = ", channel.value)
        }
      })
       /* channelStore.addMessage(channel.value?.id, newMessage);
        Put(baseUrlChat + '/' + channel.value?.id.toString(), channelStore.getChannelByID(channel.value?.id - 1))
        .then(res => console.log("Put RES => ", res))
        socket.emit('msgToServer', newMessage)
        Post(baseUrl, newMessage)
        .then(res => console.log("Post RES => ", res))*/
   // }
   // else
    //  console.log("Channel NULL");
    inputStore.$reset();
  }
}

onMounted(() => {
  Get(baseUrlChat).then(res => channels.value = res.data);
  //Get(baseUrl).then(res => (messages.value = res.data));
});

</script>

<template>
  <h2>Chat</h2>
  <div class="container-fluid chat">

    <div class="chatMenu">
      <div class="chatMenuWrapper">Channels
        <div v-if="channels" id="chatMenu">
          <ul v-for="item in channels" :key="item.id" class="list-group">
          <button @click="displayMessages(item.id)" type="button" class="btn btn-secondary btn-channel"> {{item.name}} </button>
          </ul>
        </div>
        <div>
          <form @submit.prevent.trim.lazy="handleSubmitNewChannel" method="POST" id="form">
            <input v-model="input.create_channel" type="text" id="input"/>
            <input type="submit" value="Create" id="send"/>
          </form>
        </div>
      </div>
    </div>

    <span class="vertical-line"></span>

    <div class="chatBox">
      <div class="chatBoxWrapper">{{channel?.name ? channel.name : "Message"}}
        <div v-if="channel != undefined">
          <div v-if="messages" class="scroller">
            <ul id="msg" v-for="item in messages" :key="item.id">
              Message: {{ item.data }}
            </ul>
          </div>
          <form @submit.prevent.trim.lazy="handleSubmitNewMessage" method="POST" id="form">
            <input v-model="input.create" type="text" id="input"/>
            <input type="submit" value="Send" id="send"/>
          </form>
        </div>
       </div>
    </div>

    <span class="vertical-line"></span>

    <div class="chatFriends">
      <div class="chatFriendsWrapper">
        <input type="text" placeholder="search for friends" class="chatFriendsInput" />
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

#form {
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

#input {
  border: none;
  padding: 0 1rem;
  flex-grow: 1;
  border-radius: 2rem;
  margin: 0.25rem;
}

#send {
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