<script setup lang="ts">


    import { storeToRefs} from 'pinia';
    import { useChannelStore } from '@/stores/channel';
    import { useMessageStore } from '@/stores/message';

    import type { Channel } from '@/models/channel.model';
    import { Get } from '@/services/requests';
    import { ref } from 'vue';

    const messageStore = useMessageStore();
    const { messages, textMsg, textDirectMsg } = storeToRefs(messageStore);

    let inputPassword = ref<string>('');

    const channelStore = useChannelStore();
    const { allChannels,
            //channels,
            channel,
            //channelsJoin,
            channelJoin,
            channelLeave,
            //channelsInvite,
            channelUpdate,
            newOwner,
            usersMembers,
            /*userDirectMessage,
            usersInvite,
            channelType,
            channelTypeUpdate*/
        } = storeToRefs(channelStore);


  const props = defineProps({
      //channelStore: Object,
      socket: Object,
      //channels: Object,
      //allChannels: Object,
      channelsJoin: Boolean,
      loggedUser: Object || undefined,
      searchName: Function,
      //displayMessages: Function
  })

const displayMessages = (channel_item: Channel) => {
  Get('/channels/search?id=' + channel_item.id.toString() + '&messages&owner&admins&members&mutes&bans').then(res => {
    channel.value = res.data[0]
    messages.value = res.data[0].messages
    usersMembers.value = res.data[0].members
  })
}

// Rejoindre un channel
const joinChannel = () => {
  if (props.socket != undefined) {
    props.socket.emit('joinChannel', props.loggedUser?.id, channelJoin.value, inputPassword.value)
    inputPassword.value = ''
  }
}

/*props.socket.on('joinChannel', () => {
  if (channelJoin.value != undefined) {
    channelStore.joinChannel(channelJoin.value);
    channel.value = channelStore.getChannelByID(channelJoin.value.id);
    messages.value = channelJoin.value.messages;
    props.socket.emit("updateMember", channelJoin.value.id, {addMembers: [{id: props.loggedUser?.id}]}, {author: props.loggedUser?.id, channel: {id: channelJoin.value?.id}, data: `${props.loggedUser?.username} has joined the channel.`}, props.loggedUser)
    channelStore.updateMember();
  }
})*/

// Supprimer un channel
const deleteChannel = () => {
  if (props.socket != undefined) {
    props.socket.emit('deleteChannel', channelLeave.value?.id)
  }
}

/*const del = () => {
  if (props.socket != undefined) {
    props.socket.on('deleteChannel', (channelID: number) => {
      if (channel.value?.id == channelID) {
        channel.value = undefined;
        messages.value = [];
      }
      channelStore.deleteChannel(channelID)
    })
  }
}*/
// Quitter un channel si Owner
const leaveChannel = () => {
  if (props.loggedUser != null && props.socket != undefined) {
    if (channelLeave.value !== undefined) {
      if (channelStore.isOwner(channelLeave.value, props.loggedUser.id)) {
        if (channelStore.isAdmin(channelLeave.value, newOwner.value != undefined ? newOwner.value.id : -1) == true) {
          props.socket.emit('updateMember', channelLeave.value.id, {owner: {id: newOwner.value?.id}, removeAdmins: [{id: props.loggedUser.id}], removeMembers: [{id: props.loggedUser.id}]}, {author: props.loggedUser.id, channel: {id: channelLeave.value.id}, data: `${props.loggedUser.username} the channel owner has left the channel - - ${newOwner.value?.username} becomes the owner.`}, props.loggedUser)
        }
        else {
          if (channelStore.isBan(channelLeave.value, props.loggedUser.id) == true) {
            props.socket.emit('updateMember', channelLeave.value?.id, {owner: {id: newOwner.value?.id}, addAdmins: [{id: newOwner.value?.id}], removeMutes: [{id: newOwner.value?.id}], removeBans: [{id: props.loggedUser.id}], removeAdmins: [{id: props.loggedUser.id}], removeMembers: [{id: props.loggedUser.id}]}, {author: props.loggedUser.id, channel: {id: channelLeave.value?.id}, data: `${props.loggedUser.username} has leaved the channel.`}, props.loggedUser)
          }
          else if (channelStore.isMute(channelLeave.value, newOwner.value != undefined ? newOwner.value.id : -1) == true) {
              props.socket.emit('updateMember', channelLeave.value?.id, {owner: {id: newOwner.value?.id}, addAdmins: [{id: newOwner.value?.id}], removeMutes: [{id: newOwner.value?.id}], removeAdmins: [{id: props.loggedUser.id}], removeMembers: [{id: props.loggedUser.id}]}, {author: props.loggedUser.id, channel: {id: channelLeave.value?.id}, data: `${props.loggedUser.username} has leaved the channel.`}, props.loggedUser)
          }
          else {
            props.socket.emit('updateMember', channelLeave.value?.id, {owner: {id: newOwner.value?.id}, removeAdmins: [{id: props.loggedUser.id}], addAdmins: [{id: newOwner.value?.id}], removeMembers: [{id: props.loggedUser.id}]}, {author: props.loggedUser.id, channel: {id: channelLeave.value?.id}, data: `${props.loggedUser.username} has leaved the channel.`}, props.loggedUser)
          }
        }
      }
      else {
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
      }
      channelStore.leaveChannel(channelLeave.value);
      channel.value = channel.value?.id === channelLeave.value?.id ? undefined : channel.value;
      messages.value = channel.value?.id === channelLeave.value?.id ? [] : messages.value;
      channelStore.updateMember()
    }
  }
}

</script>

<template>

    <div class="wrapper-accordion">
        <h2 class="accordion-header" id="channels-heading">
            <button @click="channelStore?.updateOwner(props.loggedUser?.id), channelStore?.updateMember()" class="accordion-btn collapsed btn-neons-channels-menu" type="button" data-bs-toggle="collapse" data-bs-target="#channels-collapse" aria-expanded="false" aria-controls="channels-collapse">
                <div class="wrapper-icon">
                    <i class="fa-solid fa-caret-down"></i>
                </div>
                <div class="title-btn">Channels</div>
            </button>
        </h2>
        
        <div id="channels-collapse" class="accordion-collapse collapse" aria-labelledby="channels-heading">
            <div class="accordion-body">

            <div v-if="allChannels">
              <li v-for="(item, index) in allChannels" :key="index" class="btn-toggle-nav list-unstyled fw-normal small">
                <!--Permet d'afficher les messages appartenant au channel selectionné-->
                <div v-if="item.isMember" style="display: flex; align-items: center;">
                  <div>
                      <button @click="displayMessages(item)" type="button" class="rounded btn-channel">
                          {{searchName(item)}}
                      </button>
                  </div>
                  <div v-if="item.isOwner" class="ms-auto">
<!--  -->
<!-- A AJOUTER SI INVITATIONS SUR UN CHANNEL DETRUIT SUPPRIMER LES INVITATIONS -->
<!--  -->
                      <button @click="Get('channels/search?id=' + item.id.toString() + '&admins&mutes&members&bans&owner').then(res => [channelLeave] = res.data)" type="button" class="rounded btn-channel wrapper-icon-leave ms-auto" data-bs-toggle="modal" data-bs-target="#leaveChannel">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                    <button @click="Get('channels/search?id=' + item.id.toString() + '&admins&mutes&members').then(res => [channelUpdate] = res.data)" type="button" class="rounded btn-channel wrapper-icon-leave ms-auto" data-bs-toggle="modal" data-bs-target="#updateChannel">
                      Leave Owner
                    </button>

                  </div>
                  <div v-else class="ms-auto">
                      <button @click="Get('channels/search?id=' + item.id.toString() + '&mutes&members').then(res => {[channelLeave] = res.data; leaveChannel()})" type="button" class="rounded btn-channel wrapper-icon-leave ms-auto">
                          <i class="fa-solid fa-xmark"></i>
                      </button>
                  </div>
                </div>
              </li>
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
                <li v-for="(item, index) in allChannels" :key="index" class="btn-toggle-nav list-unstyled fw-normal small">
                <!--Permet d'afficher les messages appartenant au channel selectionné-->
                <div v-if="!item.isMember && !item.isPrivate && !item.isDirectChannel" style="display: flex; align-items: center;">
                  <div>
                    <button @click="" type="button" class="rounded btn-channel">
                        {{searchName(item)}}
                    </button>
                  </div>
                  <div class="ms-auto">
                    <button @click="Get('channels/search?id=' + item.id.toString() + '&password&messages').then(res => [channelJoin] = res.data)" type="button" class="rounded btn-channel wrapper-icon-leave ms-auto"  data-bs-toggle="modal" data-bs-target="#joinChannel">
                      <i class="fa-solid fa-plus"></i>
                    </button>
                  </div>
                </div>
                </li>
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


    <!--Formulaire pour détruire un channel ou définir un nouveau Owner-->
    <div class="modal fade modal-dialog-scrollable" id="leaveChannel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">

      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Leave channel : {{channelLeave?.name}}</h5>
              <button @click="newOwner = undefined" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                        <button @click="newOwner = item" type="button" class="btn btn-danger btn-channel" data-bs-toggle="modal" data-bs-target="#validate">
                            New Owner                
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="newOwner = undefined" type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
          </div>

        </div>
      </div>
    </div>

    <!--Formulaire pour valider le nouveau Owner-->
    <div class="modal fade modal-dialog-scrollable" id="validate" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            Are you sure ?
              <button @click="leaveChannel" type="button" class="btn btn-primary btn-sm" data-bs-dismiss="modal">Yes</button>
              <button @click="newOwner = undefined" type="button" class="btn btn-danger btn-sm"  data-bs-toggle="modal" data-bs-target="#leaveChannel">No</button>
          </div>
        </div>
      </div>
    </div>


    <!--Formulaire pour rejoindre un channel-->
    <div class="modal fade modal-dialog-scrollable" id="joinChannel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
{{channelJoin}}
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
                <input v-model="inputPassword" type="text" class="input"/>
              </div>
            </div>
          </div>


          <div class="modal-footer">
            <button @click="inputPassword = ''; channelJoin = undefined" type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
            <button @click="joinChannel()" type="submit" class="btn btn-primary" data-bs-dismiss="modal">Join</button>
          </div>

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