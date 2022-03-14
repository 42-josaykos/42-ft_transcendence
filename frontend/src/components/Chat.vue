<script setup lang="ts">
import { Get } from '@/services/requests';
import { useUserStore } from '@/stores/user';
import { useMessageStore } from '@/stores/message';
import { useChannelStore } from '@/stores/channel';
import type { Channel } from '@/models/channel.model'
import type { Message } from '@/models/message.model'
import type { User } from '@/models/user.model'
import { useInputStore } from '@/stores/input';
import { storeToRefs} from 'pinia';
import { io } from 'socket.io-client';
import { computed, onMounted, ref } from 'vue';
import { Post, Put, Patch } from '@/services/requests';
import ButtonChannel from './ButtonChannel.vue'

const socket = io("http://localhost:4000");

const userStore = useUserStore();
const { loggedUser } = storeToRefs(userStore);

const messageStore = useMessageStore();
const { messages } = storeToRefs(messageStore);

const inputStore = useInputStore();
const { input } = storeToRefs(inputStore);

const channelStore = useChannelStore();
const { allChannels } = storeToRefs(channelStore);
const { channels } = storeToRefs(channelStore);
const { channel } = storeToRefs(channelStore);

const baseUrl = '/messages';
const baseUrlChat = '/channels';

const handleSubmitNewMessage = () => {
  if (input.value.create !== '') {
    if (channel.value !== undefined) {
      const newMessage = {
          author: loggedUser.value?.id,
          channel: {id: channel.value.id},
          data: input.value.create
        };
        Post(baseUrl, newMessage)
        .then(res => {
          socket.emit('msgToServer', newMessage)
        })
    }
    inputStore.$reset();
  }
}

socket.on('msgToClient', (newMessage: Message) => {
  messageStore.createMessage(newMessage);
})

let isMember = ref(true);

const displayMessages = (channel_item: Channel) => {
  //member = isMember(channel_item);
  Get(baseUrlChat + '/' + channel_item.id.toString()).then(res => {
    if (res.status == 200) {
      channel.value = res.data;
      messages.value = res.data.messages;
    }
  });
  console.log('Messages => ', messages.value)
}

const displayMyChannels = () => {
  isMember.value = true
  Get('/users/' + loggedUser.value.id + '/channels/member')
  .then(res => channels.value = res.data);
}

const displayAllChannels = () => {
  isMember.value = false;
  Get('/channels')
  .then(res => allChannels.value = res.data);
}

const handleSubmitNewChannel = () => {
  if (input.value.create_channel !== '')
  {
      const newChannel = {
          name: input.value.create_channel,
          owner: { id: loggedUser.value?.id },
          members: [{ id: loggedUser.value?.id }, {id: 6}]
      };
      Post(baseUrlChat, newChannel).then(res => {
        if (res.status == 201) {
          channelStore.createChannel(res.data);
          channel.value = res.data;
          messages.value = [];
        }
      })
    inputStore.$reset();
  }
}

const isMember2 = (channel_item: Channel) => {
  //member = true;
  Get(baseUrlChat + '/' + channel_item.id.toString()).then(res => {
    if (res.status == 200) {
      console.log("res.data => ", res.data)
      const user_id = channelStore.getMemberChannelByID(res.data, loggedUser.value?.id);
      
      console.log("2 - user_id => ", user_id)
      isMember.value = true;
      return user_id;
     /* if (user_id == 0)
      {      console.log("*** FALSE ****")
        return false
      }
      console.log("Channel Item => ", channel_item)
      console.log("Logged=> ", loggedUser.value)
      return true*/
      /*let members: User[] = {...res.data.members};
      const index = members.findIndex((user: User) => user.id === loggedUser.value?.id)
      if (index >= 0) {
        return true;*/
    }
    
  })
  isMember.value = false;
  return false;
  /*let user_member = channelStore.getMemberChannelByID(channel_item, loggedUser.value?.id)
  if (!user_member)
    return false
    console.log("Channel Item => ", channel_item)
    console.log("Logged=> ", loggedUser.value)
    return true*/
}

//const isMember = computed(() =>  {
 // member = false;
  /*console.log("Channel_item => ", channel_item)
  Get(baseUrlChat + '/' + channel_item.id.toString()).then(res => {
    if (res.status == 200) {
      console.log("res.data => ", res.data)
      const user_id = channelStore.getMemberChannelByID(res.data, loggedUser.value?.id);
      
      console.log("2 - user_id => ", user_id)
      return user_id;
      }
    
  })*/
  //return member;
//})

/*async function isMember3(channel_item: Channel): Promise<boolean> {
await Get(baseUrlChat + '/' + channel_item.id.toString()).then(res => {
    if (res.status == 200) {
      console.log("res.data => ", res.data)
      const user_id = channelStore.getMemberChannelByID(res.data, loggedUser.value?.id);
      
      console.log("2 - user_id => ", user_id)
      member = true;
    }
    else{member = false}
}
  )
      return member;
}*/

onMounted(() => {
  Get('/users/' + loggedUser.value.id + '/channels/member').then(res => channels.value = res.data);
  Get('/channels').then(res => allChannels.value = res.data);
  console.log("loggedUser", loggedUser.value)
  socket.emit('createConnection', loggedUser.value);
  console.log("LoggedUser => ", loggedUser.value)
  //Get(baseUrl).then(res => (messages.value = res.data));
});

const btn_channels = ref('Channels')
const btn_all_channels = ref('All Channels')
const display = ref(true) 

</script>

<template>
  <h2>Chat</h2>
  <div class="container-fluid chat">

    <div class="chatMenu">
      <div class="chatMenuWrapper">
        <ButtonChannel @clic="() => displayMyChannels()" @displayMsg="(item) => displayMessages(item)" :display="display" :text="btn_channels" />
        <ButtonChannel @clic="() => displayAllChannels()" :display="!display" :text="btn_all_channels" />
       <!-- <button @click="displayMyChannels" type="button" class="btn btn-secondary send">Channels</button>
        <button @click="displayAllChannels" type="button" class="btn btn-secondary send">All channels</button>
        <div v-if="channels" id="chatMenu">
          <ul v-for="item of channels" :key="item.id" class="list-group">-->
            <!--<div v-if="isMember">Ici : {{isMember}}
              <button  @click="displayMessages(item)" type="button" class="btn btn-secondary btn-channel"> {{item.name}} </button>
            </div>
            <div v-else>La : {{isMember}}
              <button type="button" class="btn btn-secondary btn-channel">
              {{item.name}}  <span class="badge bg-dark">Join</span>
              </button>-->

              <!--<button type="button" class="btn btn-secondary btn-channel"> {{item.name}} </button>
            </div>-->
          <!--<button v-else  type="button" class="btn btn-secondary btn-channel"> {{item.name}} </button>
          </ul>
        </div>-->
        <div>
          <form @submit.prevent.trim.lazy="handleSubmitNewChannel" method="POST" class="form">
            <input v-model="input.create_channel" type="text" class="input"/>
            <input type="submit" value="Create" class="send"/>
          </form>
        </div>
      </div>
    </div>

    <span class="vertical-line"></span>

    <div class="chatBox">
      <div class="chatBoxWrapper">{{channel?.name ? channel.name : "Message"}}
      <!--<div v-if="member">-->
        <div v-if="channel != undefined">
          <div v-if="messages" class="scroller">
            <ul id="msg" v-for="item in messages" :key="item.id">
              Message: {{ item.data }}
            </ul>
          </div>
          <form @submit.prevent.trim.lazy="handleSubmitNewMessage" method="POST" class="form">
            <input v-model="input.create" type="text" class="input"/>
            <input type="submit" value="Send" class="send"/>
          </form>
        </div>
      <!--</div>-->
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