<script setup lang="ts">

    import { storeToRefs} from 'pinia';
    import { useChannelStore } from '@/stores/channel';
    import { useMessageStore } from '@/stores/message';

    import type { Channel } from '@/models/channel.model';
    import { Get } from '@/services/requests';

const messageStore = useMessageStore();
const { messages, textMsg, textDirectMsg } = storeToRefs(messageStore);

    const channelStore = useChannelStore();
    const { //allChannels,
            //channels,
            channel,
            //channelsJoin,
            //channelJoin,
            channelLeave,
            /*channelsInvite,
            channelUpdate,
            newOwner,
            usersMembers,
            userDirectMessage,
            usersInvite,
            channelType,
            channelTypeUpdate*/
        } = storeToRefs(channelStore);



  const props = defineProps({
      //channelStore: Object,
      socket: Object,
      channels: Object,
      allChannels: Object,
      channelsJoin: Boolean,
      loggedUser: Object || undefined,
      searchName: Function,
      displayMessages: Function
  })

// Quitter un channel si pas Owner
const leaveChannelIfNotOwner = (channel_item: Channel) => {
  Get('/channels/search?id=' + channel_item.id.toString() + '&admins&mutes&bans&members').then(res => {
    [channelLeave.value] = res.data;
    if (props.loggedUser != null) {
      if (channelStore.isAdmin(channelLeave.value, props.loggedUser.id) == true) {
        props.socket.emit('updateMember', channelLeave.value?.id, {removeAdmins: [{id: props.loggedUser.id}], removeMembers: [{id: props.loggedUser.id}]}, {author: props.loggedUser.id, channel: {id: channelLeave.value?.id}, data: `${props.loggedUser.username} has leaved the channel.`}, props.loggedUser)
      }
      else {
        if (channelStore.isBan(channelLeave.value, props.loggedUser.id) == true) {
           props.socket.emit('updateMember', channelLeave.value?.id, {removeBans: [{id: props.loggedUser.id}], removeMutes: [{id: props.loggedUser.id}], removeMembers: [{id: props.loggedUser.id}]}, {author: props.loggedUser.id, channel: {id: channelLeave.value?.id}, data: `${props.loggedUser.username} has leaved the channel.`}, props.loggedUser)
        }
          else if (channelStore.isMute(channelLeave.value, props.loggedUser.id) == true) {
             props.socket.emit('updateMember', channelLeave.value?.id, {removeMutes: [{id: props.loggedUser.id}], removeMembers: [{id: props.loggedUser.id}]}, {author: props.loggedUser.id, channel: {id: channelLeave.value?.id}, data: `${props.loggedUser.username} has leaved the channel.`}, props.loggedUser)
        }
        else {
           props.socket.emit('updateMember', channelLeave.value?.id, {removeMembers: [{id: props.loggedUser.id}]}, {author: props.loggedUser.id, channel: {id: channelLeave.value?.id}, data: `${props.loggedUser.username} has leaved the channel.`}, props.loggedUser)
        }
      }
      channelStore.leaveChannel(channel_item);
      channel.value = channel.value?.id === channel_item.id ? undefined : channel.value;
      messages.value = channel.value?.id === channel_item.id ? [] : messages.value;
      channelStore.updateMember()
    }
  })
}

// Quitter un channel si Owner
/*const leaveChannelIfOwner = () => {
  if (props.loggedUser != null) {
    if (channelLeave.value !== undefined) {
      if (channelStore.isAdmin(channelLeave.value, newOwner.value != undefined ? newOwner.value.id : -1) == true) {
        socket.emit('updateMember', channelLeave.value.id, {owner: {id: newOwner.value?.id}, removeAdmins: [{id: props.loggedUser.id}], removeMembers: [{id: props.loggedUser.id}]}, {author: props.loggedUser.id, channel: {id: channelLeave.value.id}, data: `${props.loggedUser.username} the channel owner has left the channel - - ${newOwner.value?.username} becomes the owner.`}, props.loggedUser)
      }
      else {
        if (channelStore.isBan(channelLeave.value, props.loggedUser.id) == true) {
          socket.emit('updateMember', channelLeave.value?.id, {owner: {id: newOwner.value?.id}, addAdmins: [{id: newOwner.value?.id}], removeMutes: [{id: newOwner.value?.id}], removeBans: [{id: props.loggedUser.id}], removeAdmins: [{id: props.loggedUser.id}], removeMembers: [{id: props.loggedUser.id}]}, {author: props.loggedUser.id, channel: {id: channelLeave.value?.id}, data: `${props.loggedUser.username} has leaved the channel.`}, loggedUser.value)
        }
        else if (channelStore.isMute(channelLeave.value, newOwner.value != undefined ? newOwner.value.id : -1) == true) {
            socket.emit('updateMember', channelLeave.value?.id, {owner: {id: newOwner.value?.id}, addAdmins: [{id: newOwner.value?.id}], removeMutes: [{id: newOwner.value?.id}], removeAdmins: [{id: props.loggedUser.id}], removeMembers: [{id: props.loggedUser.id}]}, {author: props.loggedUser.id, channel: {id: channelLeave.value?.id}, data: `${props.loggedUser.username} has leaved the channel.`}, props.loggedUser)
        }
        else {
          socket.emit('updateMember', channelLeave.value?.id, {owner: {id: newOwner.value?.id}, removeAdmins: [{id: loggedUser.value?.id}], addAdmins: [{id: newOwner.value?.id}], removeMembers: [{id: props.loggedUser.id}]}, {author: props.loggedUser.id, channel: {id: channelLeave.value?.id}, data: `${props.loggedUser.username} has leaved the channel.`}, props.loggedUser)
        }
      }
      channelStore.leaveChannel(channelLeave.value);
      channel.value = channel.value?.id === channelLeave.value?.id ? undefined : channel.value;
      messages.value = channel.value?.id === channelLeave.value?.id ? [] : messages.value;
      channelStore.updateMember()
    }
  }
}*/

</script>

<template>
    <div class="wrapper-accordion">
        <h2 class="accordion-header" id="channels-heading">
            <button  class="accordion-btn collapsed btn-neons-channels-menu" type="button" data-bs-toggle="collapse" data-bs-target="#channels-collapse" aria-expanded="false" aria-controls="channels-collapse">
                <div class="wrapper-icon">
                    <i class="fa-solid fa-caret-down"></i>
                </div>
                <div class="title-btn">Channels</div>
            </button>
        </h2>
        <div id="channels-collapse" class="accordion-collapse collapse" aria-labelledby="channels-heading">
            <div class="accordion-body">

            <div v-if="channels">
                <ul v-for="(item, index) in channels" :key="index" class="btn-toggle-nav list-unstyled fw-normal pb-1 small" style="display: flex; align-items: center;">
                <!--Permet d'afficher les messages appartenant au channel selectionné-->
                <div>
                    <button @click="displayMessages(item)" type="button" class="rounded btn-channel">
                        {{searchName(item)}}
                    </button>
                </div>
                    <button @click="leaveChannelIfNotOwner(item)" type="button" class="rounded btn-channel wrapper-icon-leave ms-auto" data-bs-toggle="tooltip" data-bs-placement="right" title="Leave channel">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                
                </ul>
            </div>

            </div>
        </div>

    </div>

    <div class="wrapper-accordion">
        <h2 class="accordion-header" id="all-channels-heading">

            <button @click="channelStore?.updateMember()" class="accordion-btn collapsed btn-neons-channels-menu" type="button" data-bs-toggle="collapse" data-bs-target="#all-channels-collapse" aria-expanded="false" aria-controls="all-channels-collapse">
                <div class="wrapper-icon">
                    <i class="fa-solid fa-caret-down"></i>
                </div>
                <div class="title-btn">All channels</div>
            </button>
        </h2>
        <div id="all-channels-collapse" class="accordion-collapse collapse" aria-labelledby="all-channels-heading">
            <div class="accordion-body">

            <div v-if="allChannels">
                <ul v-for="(item, index) in allChannels" :key="index" class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                <!--Permet d'afficher les messages appartenant au channel selectionné-->
                <div v-if="!item.isMember">
                    <button @click="" type="button" class="rounded btn-channel">
                        {{searchName(item)}}
                    </button>
                </div>
                </ul>
            </div>

            </div>
        </div>

    </div>

  <div class="wrapper-accordion">
    <h2 class="accordion-header" id="direct-msg-heading">
      <button class="accordion-btn collapsed btn-neons-channels-menu" type="button" data-bs-toggle="collapse" data-bs-target="#direct-msg-collapse" aria-expanded="false" aria-controls="direct-msg-collapse">
        <div class="wrapper-icon">
            <i class="fa-solid fa-caret-down"></i>
        </div>
        <div class="title-btn">Directs messages</div>
      </button>
    </h2>
    <div id="direct-msg-collapse" class="accordion-collapse collapse" aria-labelledby="direct-msg-heading">
      <div class="accordion-body">
          <ul>
              <li>
                  Ambre
              </li>
              <li>
                  Bob
              </li>
          </ul>
      </div>
    </div>
  </div>

  <div class="wrapper-accordion">
    <h2 class="accordion-header" id="invite-heading">
      <button class="accordion-btn collapsed btn-neons-channels-menu" type="button" data-bs-toggle="collapse" data-bs-target="#invite-collapse" aria-expanded="false" aria-controls="invite-collapse">
        <div class="wrapper-icon">
            <i class="fa-solid fa-caret-down"></i>
        </div>
        <div class="title-btn">Invites</div>
      </button>
    </h2>
    <div id="invite-collapse" class="accordion-collapse collapse" aria-labelledby="invite-heading">
      <div class="accordion-body">
          <ul>
              <li>
                  Ambre
              </li>
              <li>
                  Bob
              </li>
          </ul>
      </div>
    </div>
  </div>

</template>

<style>

.title-btn{
    /*display: block;
    text-overflow: ellipsis;
    overflow: hidden;*/
    white-space: nowrap;
}
.wrapper-accordion {
    padding-right: 0.75rem;
}
.wrapper-icon {
    padding-right: 20px;
}

.accordion-btn:not(.collapsed)::after {
    transform: rotate(180deg);
}

.accordion-btn {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 1rem 1.25rem;
    font-size: 1rem;
    color: #212529;
    text-align: left;
    background-color: #fff;
    border: 0;
    border-radius: 0;
    overflow-anchor: none;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out,border-radius .15s ease;
}

.accordion-btn::after {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    margin-left: auto;
    content: "";
    background-repeat: no-repeat;
    background-size: 1.25rem;
    transition: transform .2s ease-in-out;
        transform: rotate(-180deg);
}

.btn-neons-channels-menu {
    /*font-size: 25px;*/
    height: 10px;
    width: -webkit-fill-available;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    text-decoration: none;
    color: hsl(31 100% 54%);
    border: hsl(31 100% 54%) 3px solid;
    background-color: transparent;
    border-radius: 0.25em;
    text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3), 0 0 0.45em currentColor;
    box-shadow: inset 0 0 0.5em 0 hsl(31 100% 54%), 0 0 0.5em 0 hsl(31 100% 54%);
    transition: all 0.5s;
    border-radius: 50px !important;
    margin-bottom: 5px;
}

.btn-neons-channels-menu:hover {
    background-color: hsl(31 100% 54%);
    color: #fff
}

.btn-channel {
    background-color: transparent !important;
    border-color: transparent !important;
    color: hsl(31 100% 54%);
}

.btn-channel:hover {
    font-size: 15px;
}

.wrapper-icon-leave {
    color: hsl(31 100% 54%);
}

</style>