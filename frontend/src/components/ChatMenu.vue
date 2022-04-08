<script setup lang="ts">

    import ModalChat from '@/components/ModalChat.vue';
    import { storeToRefs} from 'pinia';
    import { useChannelStore } from '@/stores/channel';
    import { useMessageStore } from '@/stores/message';

    import type { Channel } from '@/models/channel.model';
    import type { User } from '@/models/user.model';
    import { Get } from '@/services/requests';
    import { ref } from 'vue';

    const messageStore = useMessageStore();
    const { messages, textMsg, textDirectMsg } = storeToRefs(messageStore);

    let inputPassword = ref<string>('');
    let channelName = ref<string>('');
    const modalNewChannel = ref<boolean>(false);
    const modalJoinChannel = ref<boolean>(false);
    const modalDelChannel = ref<boolean>(false);
    const modalValidate = ref<boolean>(false);

    //const usersInvite = ref<User[]>([]);
    //const users = ref<User[]>([]);

    const str = ref<string>('joinChannel')

    const channelStore = useChannelStore();
    const { allChannels,
            //channels,
            channel,
            //channelsJoin,
            channelJoin,
            channelLeave,
            channelsInvite,
            channelUpdate,
            newOwner,
            usersMembers,
            /*userDirectMessage,*/
            usersInvite,
            channelType,
            //channelTypeUpdate
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
      users: [Object],
  })

const displayMessages = (channel_item: Channel) => {
  Get('/channels/search?id=' + channel_item.id.toString() + '&messages&owner&admins&members&mutes&bans').then(res => {
    channel.value = res.data[0]
    messages.value = res.data[0].messages
    usersMembers.value = res.data[0].members
  })
}

// Créer un nouveau channel
const createChannel = () => {
  if (props.socket != undefined) {
    if (channelName.value !== '')
    {
      let obj: any = {}
      let usersArray: any = []
      usersInvite.value.forEach((value) => {
        obj = {id: value.id}
        usersArray.push(obj)
      })
      const newChannel = {
        name: channelName.value,
        isPrivate: channelType.value == 2 ? true : false,
        password: channelType.value == 3 ? inputPassword : null,
        isProtected: channelType.value == 3 ? true : false,
        owner: { id: props.loggedUser?.id },
        admins: [{ id: props.loggedUser?.id }],
        members: [{ id: props.loggedUser?.id }],
        invites: channelType.value== 2 ? usersArray : []
      };
      props.socket.emit('newChannel', newChannel, null ,props.loggedUser)
    }
  }
  inputPassword.value = ''
  channelName.value = ''
  channelType.value = 1
}

// Rejoindre un channel
const joinChannel = () => {
  if (props.socket != undefined) {
    props.socket.emit('joinChannel', props.loggedUser?.id, channelJoin.value, inputPassword.value)
    inputPassword.value = ''
  }
}

// Supprimer un channel
const deleteChannel = () => {
  if (props.socket != undefined) {
    props.socket.emit('deleteChannel', channelLeave.value?.id)
  }
}

// Quitter un channel si Owner
const leaveChannel = () => {
  if (props.loggedUser != null && props.socket != undefined) {
    if (channelLeave.value !== undefined) {
      if (channelLeave.value.isDirectChannel) {

      }
      else if (channelStore.isOwner(channelLeave.value, props.loggedUser.id)) {
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

// // Mettre à jour un channel
// const updateChannel = () => {
//   if (props.socket != undefined) {
//     if (channelUpdate.value !== undefined)
//     {
//       let obj: any = {}
//       let usersArray: any = []
//       usersInvite.value.forEach((value) => {
//         obj = {id: value.id}
//         usersArray.push(obj)
//       })
//       const updateChannel = {
//         name: input.value.update_channel_name,
//         isPrivate: channelTypeUpdate.value == 2 ? true : false,
//         password: channelTypeUpdate.value == 3 ? inputPassword : null,
//         isProtected: channelTypeUpdate.value == 3 ? true : false,
//         invites: channelTypeUpdate.value == 2 ? usersArray : []
//       }
//       props.socket.emit('updateChannel', input.value.channel_id, updateChannel)
//     }
//   }
//   inputStore.$reset();
// };

// Mettre à jour jour un tableau de users qui recevront une invitation à un channel
const updateUsersInvite = (user: User) => {
  if (usersInvite.value != undefined) {
    const index =  usersInvite?.value.findIndex((el: User) => el.id === user.id);
    if (index != -1) {
      channelStore.deleteUserInvite(index);
    }
    else {
      channelStore.addUserInvite(user);
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
                  <div class="ms-auto">
<!--  -->
<!-- A AJOUTER SI INVITATIONS SUR UN CHANNEL DETRUIT SUPPRIMER LES INVITATIONS -->
<!--  -->
                      <button @click="Get('channels/search?id=' + item.id.toString() + '&admins&mutes&members&bans&owner').then(res => {[channelLeave] = res.data; item.isOwner ? modalDelChannel = true : modalValidate = true})" type="button" class="rounded btn-channel wrapper-icon-leave ms-auto">
                        <i class="fa-solid fa-xmark"></i>
                      </button>
                      <!-- <button @click="Get('channels/search?id=' + item.id.toString() + '&admins&mutes&members').then(res => [channelUpdate] = res.data)" type="button" class="rounded btn-channel wrapper-icon-leave ms-auto" data-bs-toggle="modal" data-bs-target="#updateChannel">
                        <i class="fa-solid fa-pen"></i>
                      </button> -->

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
                    <button @click="modalJoinChannel = true; Get('channels/search?id=' + item.id.toString() + '&messages').then(res => [channelJoin] = res.data)" type="button" class="rounded btn-channel wrapper-icon-leave ms-auto">
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
      <button  class="accordion-btn collapsed btn-neons-channels-menu position-relative" type="button" data-bs-toggle="collapse" data-bs-target="#invite-collapse" aria-expanded="false" aria-controls="invite-collapse">
        <div class="wrapper-icon">
            <i class="fa-solid fa-caret-down"></i>
        </div>
        <div class="title-btn">Invites</div>
        <div v-if="channelsInvite.length > 0" class="ms-auto">
            <span class="position-absolute position-badge translate-middle rounded-pill">{{channelsInvite.length}}</span>
        </div>
      </button>
    </h2>
    <div id="invite-collapse" class="accordion-collapse collapse" aria-labelledby="invite-heading">
      <div class="accordion-body">
            <div v-if="channelsInvite"> 
                <li v-for="(item, index) in channelsInvite" :key="index" class="btn-toggle-nav list-unstyled fw-normal small">
                <div  style="display: flex; align-items: center;">
                  <div>
                    <button @click="" type="button" class="rounded btn-channel">
                        {{searchName(item)}}
                    </button>
                  </div>
                </div>
                </li>
            </div>
      </div>
    </div>
  </div>

  <div>

    <!--Permet de créer un nouveau channel-->
    <button @click="Get('/users/search').then(res => {users = res.data; usersInvite = []; modalNewChannel = true})" type="button" class="rounded btn-channel wrapper-icon-leave ms-auto">
        <i class="fa-solid fa-circle-plus"></i>
    </button>

  </div>


    <ModalChat v-if="modalNewChannel == true" @close="usersInvite = []; modalNewChannel = false; channelName = ''; inputPassword = ''; channelType = 1">
      <template v-slot:header>
        <h5 class="modal-title" id="staticBackdropLabel">New channel : {{channelName}}</h5>
      </template>
      <template v-slot:body>
            <div class="form form-new-channel">
              <label for="name">Channel name: </label>
              <input v-model="channelName" type="text" class="input"/>
            </div>
            <div class="form-check form-check-inline">
              <input @click="channelType = 1" class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" checked>
              <label class="form-check-label" for="inlineRadio1">Public</label>
            </div>
            <div class="form-check form-check-inline">
              <input @click="channelType = 2" class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2">
              <label class="form-check-label" for="inlineRadio2">Private</label>
            </div>
            <div class="form-check form-check-inline">
              <input @click="channelType = 3" class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2">
              <label class="form-check-label" for="inlineRadio2">Protected</label>
            </div>
            <div v-if="channelType == 3">
              <div class="form form-new-channel">
                <label for="name">Password:</label>
                <input v-model="inputPassword" type="text" class="input"/>
              </div>
            </div>
            <div v-else-if="channelType == 2">
              <div v-if="props.users?.length != 1">
                  Choose users :
                  <div class="scroller">
                    <div class="list-group" v-for="user in props.users" :key="user.id">
                      <div v-if="user.id != loggedUser?.id">{{user}}
                        <a  class="list-group-item list-group-item-action"> {{user.username}} =>
                          <button @click="updateUsersInvite(user)" type="button" class="btn btn-primary btn-sm">
                              {{usersInvite.findIndex((el: User) => el.id === user.id) == -1 ? "Invite" : "Remove"}}
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
              </div>
            </div>
      </template>
      <template v-slot:footer>
            <button @click="usersInvite = []; modalNewChannel = false; channelName = ''; inputPassword = ''; channelType = 1" type="button" class="btn btn-danger">Cancel</button>
            <button @click="modalNewChannel = false; createChannel()" type="submit" class="btn btn-primary">Create</button>
      </template>
    </ModalChat>

    <ModalChat v-if="modalDelChannel == true" @close="newOwner = undefined; modalDelChannel = false">
      <template v-slot:header>
        <h5 class="modal-title" id="staticBackdropLabel">Leave channel : {{channelLeave?.name}}</h5>
      </template>
      <template v-slot:body>
        Click here if you want to permanently delete this channel :
        <div class="d-grid gap-2">
          <button @click="deleteChannel(); modalDelChannel = false" type="button" class="btn btn-danger">Delete</button>
        </div>
        <br>
        <div v-if="channelLeave?.members.length != 1">
          Otherwise choose a new channel owner :
          <div v-if="channelLeave?.members" class="scroller">
            <div class="list-group" v-for="item in channelLeave.members" :key="item.id">
              <div v-if="item.id != loggedUser?.id">
                <a  class="list-group-item list-group-item-action"> {{item.username}} =>
                  <button @click="newOwner = item; modalDelChannel = false; modalValidate = true" type="button" class="btn btn-danger btn-channel">
                    New Owner                
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <button @click="newOwner = undefined; modalDelChannel = false" type="button" class="btn btn-danger">Cancel</button>
      </template>
    </ModalChat>

    <ModalChat v-if="modalValidate == true" @close="newOwner = undefined; modalValidate = false">
      <template v-slot:header>
            Are you sure ?
      </template>
      <template v-slot:footer>
        <button @click="modalValidate = false; leaveChannel()" type="button" class="btn btn-primary btn-sm">Yes</button>
        <button @click="newOwner = undefined; modalValidate = false; channelStore.isOwner(channelLeave, props.loggedUser?.id) ? modalDelChannel = true : modalDelChannel = false" type="button" class="btn btn-danger btn-sm">No</button>
      </template>
    </ModalChat>


    <ModalChat v-if="modalJoinChannel" @close="modalJoinChannel = false">
      <template v-slot:header>
        <h5 class="modal-title" id="staticBackdropLabel">Join : {{channelJoin?.name}}</h5>
      </template>
      <template v-slot:body>
        <div v-if="channelJoin?.isProtected == true">
          This channel is protected with a password.
          <div class="form form-new-channel">
            <label for="name">Enter Password:</label>
            <input v-model="inputPassword" type="text" class="input"/>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <button @click="modalJoinChannel = false" type="button" class="btn btn-danger">Cancel</button>
        <button @click="joinChannel(); modalJoinChannel = false" type="submit" class="btn btn-primary">Join</button>
      </template>
    </ModalChat>

</template>

<style>

.position-badge {
  left: 90% !important;
  top: 50% !important;
  display: inline-block;
  padding: .35em .65em;
  font-size: .75em;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  background-color: rgb(54, 224, 28);
  text-align: center;
  white-space: nowrap;
  border: rgb(54, 224, 28) 3px solid;
  box-shadow: inset 0 0 0.5em 0 hsl(54, 224, 28), 0 0 0.5em 0 hsl(54, 224, 28);
}

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
    color: #fff;
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