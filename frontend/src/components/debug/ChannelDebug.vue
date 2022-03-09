<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Get, Post, Delete, Patch } from '@/services/requests';

import { storeToRefs } from 'pinia';
import { useChannelStore } from '@/stores/channel';
//import type { Channel } from '@/models/channel.model';
import type { Input, InputStore } from '@/stores/input';

// Props
const props = defineProps<{
  title: string;
  inputStore: InputStore;
  input: Input;
}>();

// Request url to API
const baseUrl = 'http://localhost:3000/channels';

// Single element
//const user = ref<User | null>(null);

// Stores
const channelStore = useChannelStore();
const { channels } = storeToRefs(channelStore);
const { channel } = storeToRefs(channelStore);

// CRUD functions
const getChannel = () => {
  Get(baseUrl + '?name=' + props.input.search).then(res => {
    if (res.status == 200) {
      channel.value = res.data[0];
    }
    props.inputStore.$reset();
  });
};

const createChannel = () => {
  Post(baseUrl, { name: props.input.create, password: '', messages: [] }).then(res => {
    if (res.status == 201) {
      channelStore.createChannel(res.data);
      // Get(baseUrl).then(res => (channels.value = res.data));
    }
    props.inputStore.$reset();
  });
};

/*const updateChannel = (data: Channel | null) => {
  Patch(baseUrl + '/' + props.input.channel_id, data).then(res => {
    if (res.status == 200) {
      channelStore.updateChannel(res.data.id, res.data);
      // Get(baseUrl).then(res => (channels.value = res.data));
    }
    props.inputStore.$reset();
  });
};*/

const deleteChannel = (id: number) => {
  Delete(baseUrl + '/' + id.toString()).then(res => {
    if (res.status == 200) {
      channelStore.deleteChannel(id);
      // Get(baseUrl).then(res => (channels.value = res.data));
    }
  });
};

onMounted(() => {
  Get(baseUrl).then(res => (channels.value = res.data));
});
</script>

<template>
  <h3 class="title">{{ title }}</h3>

  <h4>Get by name</h4>
  <form @submit.prevent.trim.lazy="getChannel" method="GET">
    <label for="name">Name:</label>
    <input v-model="input.search" name="username" type="text" />
    <input type="submit" value="Submit" />
  </form>
  <p>{{ channel }}</p>

  <h4>Create Channel</h4>
  <form @submit.prevent.trim.lazy="createChannel" method="POST">
    <label for="name">Name:</label>
    <input v-model="input.create" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>

<!--  <h4>Update Channel</h4>
  <form @submit.prevent.trim.lazy="updateChannel(channelStore.getChannelUpdates(input))" method="PATCH">
    <label for="id">id:</label>
    <input v-model="input.channel_id" name="id" type="text" />
    <label for="name">new channel name:</label>
    <input v-model="input.update_channel_name" name="name" type="text" />
    <input type="submit" value="Submit" />
  </form>
-->
  <h4>Get all - id, name</h4>
  <ul v-if="channels">
    <li v-for="item in channels" :key="item.id">
      Id: {{ item.id }}, Name: {{ item.name }}
      <button @click="deleteChannel(item.id)">delete</button>
    </li>
  </ul>
  <p v-else>Not Found</p>
</template>
