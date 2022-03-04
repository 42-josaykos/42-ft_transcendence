<script setup lang="ts">
  import { Get } from '@/services/requests';
  import { useMessageStore } from '@/stores/message';
  import { useInputStore } from '@/stores/input';
  import { storeToRefs } from 'pinia';
  import { io } from 'socket.io-client';
  import { onMounted, ref } from 'vue';
  import { Post } from '@/services/requests';

  const socket = io("http://localhost:4000");

  //const message = ref<string>('')

  const msg = document.getElementById('msg');

  const messageStore = useMessageStore();
  const { messages } = storeToRefs(messageStore);

  const inputStore = useInputStore();
  const { input } = storeToRefs(inputStore);

  const baseUrl = 'http://localhost:3000/messages';


  const handleSubmitNewMessage = () => {
    console.log("SUBMIT");
    console.log("Message => ", input.value)
    console.log("Message.value => ", input.value.create)
      //createMessage(input.value.create);
    //const newMessage = {sender: 1, text: };
    socket.emit('msgToServer', { sender: 1, text: input.value.create });
    Post(baseUrl, {sender: 1, text: input.value.create}).then(res => {
      if (res.status == 201) {
        console.log("POST message")
      }
          //Get(baseUrl).then(res => (messages.value = res.data));
        //messageStore.createMessage(res.data);
    })
          inputStore.$reset();
  }


  //const createMessage = (data: string) => {
   /* Post(baseUrl, {sender: 1, text: data}).then(res => {
      if (res.status == 201) {
        console.log("POST message")
          //Get(baseUrl).then(res => (messages.value = res.data));
        //messageStore.createMessage(res.data);
      }*/
     // const newMessage = {sender: 1, text: data};
     // messageStore.createMessage(data);
      //inputStore.$reset();

    //});
 // };

  socket.on('msgToClient', (data) => {
    console.log("Data = ", data)
      messageStore.createMessage(data);

    //createMessage(data);
    //msg?.appendChild(builNewMessage(data));
  })

  /*const builNewMessage = (message: string) => {
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(message));
    return li;
  }*/

  onMounted(() => {
    Get(baseUrl).then(res => (messages.value = res.data));
  });

</script>

<template>
  <h2>Chat</h2>
  <div v-if="messages">
    <ul id="msg" v-for="item in messages" :key="item.id">
      <li>
        <!--IdMessage: {{ item.id }}, IdSender: {{ item.sender }} Message: -->{{ item.text }}
      </li>
    </ul>
  </div>

  <form @submit.prevent.trim.lazy="handleSubmitNewMessage" method="POST">
    <input v-model="input.create" type="text"/>
    <input type="submit" value="Send" />
  </form>

</template>