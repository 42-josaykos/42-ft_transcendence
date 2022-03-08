<script setup lang="ts">
import { Get } from '@/services/requests';
import { useMessageStore } from '@/stores/message';
import { useChannelStore } from '@/stores/channel';
import type { Channel } from '@/models/channel.model'
import { useInputStore } from '@/stores/input';
import { storeToRefs } from 'pinia';
import { io } from 'socket.io-client';
import { onMounted, ref } from 'vue';
import { Post } from '@/services/requests';

const socket = io("http://localhost:4000");

//const message = ref<string>('')
let display = false

const msg = document.getElementById('msg');

const messageStore = useMessageStore();
const { messages } = storeToRefs(messageStore);

const inputStore = useInputStore();
const { input } = storeToRefs(inputStore);

const chan = document.getElementById('chan');

const channelStore = useChannelStore();
const { channels } = storeToRefs(channelStore);

const channel = ref<Channel>()

const baseUrl = 'http://localhost:3000/messages';
const baseUrlChat = 'http://localhost:3000/channels';

const handleSubmitNewMessage = () => {
  console.log("Message => ", input.value)
  console.log("Message.value => ", input.value.create)

  //socket.emit('msgToServer', { data: input.value.create })
  socket.emit('msgToServer', {author: {
        "id": 1,
        "username": "user1"
      }, data: input.value.create, channel: channel.value?.id})
  Post(baseUrl,
    {
      author: {
        "id": 1,
        "username": "user1"
      },
      data: input.value.create,
      channel: channel.value?.id
    }).then(res => {
    if (res.status == 201) {
         //Get(baseUrl).then(res => (messages.value = res.data));
         if (channel.value !== undefined){
          messageStore.createMessage(res.data);
          console.log("Channel after POST = ", channel.value)
          channelStore.addMessage(res.data);
          console.log("ChannelStore => ", channelStore)
         }
     }
     inputStore.$reset();
     });
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

socket.on('msgToClient', ({ data }) => {
  console.log("Data = ", data)
  /* if (data !== null)*/
    // messageStore.createMessage(data);
   //data = null;*/
  //msg?.appendChild(builNewMessage(data));
})

/* const builNewMessage = (message: string) => {
   const li = document.createElement("li");
   li.appendChild(document.createTextNode(message));
   return li;
 }*/

const displayMessages = async (id: number) => {
  console.log("ID => ", id)
  await Get(baseUrlChat/* + '/' + id.toString()*/).then(res => {
    if (res.status == 200) {
      console.log("RES => ", res.data[id - 1]);
      channel.value = res.data[id - 1];
      messages.value = res.data[id - 1].messages;
    }
  });
  console.log("Messages => ", messages.value);
  /*console.log("CLICK", item)
  console.log("Messages => ", messages)
  console.log("Messages.value => ", messages.value)*/
}




onMounted(() => {
  Get(baseUrlChat).then(res => channels.value = res.data);
  console.log("channels => ", channels)
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
      </div>
    </div>

    <span class="vertical-line"></span>

    <div class="chatBox">
      <div class="chatBoxWrapper">{{channel?.name ? channel.name : "Message"}}
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
