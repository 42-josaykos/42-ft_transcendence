<script setup lang="ts">
 /* import { io } from 'socket.io-client';
  import { ref } from 'vue';

  const socket = io("http://localhost:3001/chat");

  const message = ref<string>('')
  //document.getElementById('message');
  const messages = document.getElementById('messages');

  const handleSubmitNewMessage = () => {
    console.log("SUBMIT");
    console.log("Message => ", message)
    console.log("Message.value => ", message.value)
    socket.emit('message', { data: message.value })
  }

  socket.on('message', ({data}) => {
    console.log("Data = ", data)
    handleNewMessage(data);
  })

  const handleNewMessage = (message: string) => {
    messages.appendChild(builNewMessage(message));
  }

  const builNewMessage = (message: string) => {
    const li = document.createElement("li");
    li.appendChild(document.createTextNode(message));
    return li;
  }*/

</script>
 
<template>
  <h2>Chat</h2>
 <!-- <div>
    <ul id="messages"></ul>
  </div>

  <div>
    <input v-model="message" type="text"/>
    <button @click="handleSubmitNewMessage">Submit</button>
  </div>
-->
</template>