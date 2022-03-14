<script setup lang="ts">
import { storeToRefs} from 'pinia';
import { useUserStore } from '@/stores/user';
import { useChannelStore } from '@/stores/channel';
import type { Channel } from '@/models/channel.model'

const userStore = useUserStore();
const { loggedUser } = storeToRefs(userStore);
const channelStore = useChannelStore();
const { channels } = storeToRefs(channelStore);
const { allChannels } = storeToRefs(channelStore);

const props = defineProps({
  text: String,
  display: Boolean
})

const emit = defineEmits(['clic', 'displayMsg']);

const buttonEmit = () => {
    emit('clic')
}

const displayMessages = (item: Channel) => {
    emit('displayMsg', item)
}

</script>

<template>
    <button  @click="buttonEmit" type="button" class="btn btn-secondary send">{{ text }}</button>
    <div v-if="display">
        <div v-if="channels" class="chatMenu">
            <ul v-for="item of channels" :key="item.id" class="list-group">
                <button  @click="displayMessages(item)" type="button" class="btn btn-secondary btn-channel"> {{item.name}} </button>
            </ul>
        </div>
    </div>
    <div v-else>
        <div v-if="allChannels" class="chatMenu">
            <ul v-for="item of allChannels" :key="item.id" class="list-group">
                {{item.name}} 
            </ul>
        </div>
    </div>
</template>

<style>
.send {
  background: #333;
  border: none; padding: 0 1rem;
  margin: 0.25rem; border-radius: 3px;
  outline: none;
  color: #fff;
}

.chatMenu {
  flex: 2;
  text-align: center;
}
</style>