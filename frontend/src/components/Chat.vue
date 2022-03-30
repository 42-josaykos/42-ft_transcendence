<script setup lang="ts">

import { onMounted, onUnmounted } from 'vue';

import { storeToRefs} from 'pinia';

import { useUserStore } from '@/stores/user';
import { useMessageStore } from '@/stores/message';
import { useChannelStore } from '@/stores/channel';
import { useInputStore } from '@/stores/input';

import type { Channel } from '@/models/channel.model';
import type { Message } from '@/models/message.model';
import type { User } from '@/models/user.model';

import { Delete, Get, Patch, Post } from '@/services/requests';

import { io } from 'socket.io-client';

const socket = io("http://localhost:4000", {
  withCredentials: true
});

const userStore = useUserStore();
const { loggedUser, users } = storeToRefs(userStore);

const messageStore = useMessageStore();
const { messages, textMsg, textDirectMsg } = storeToRefs(messageStore);

const inputStore = useInputStore();
const { input } = storeToRefs(inputStore);

const channelStore = useChannelStore();
const { allChannels,
        channels,
        channel,
        channelsJoin,
        channelJoin,
        channelLeave,
        channelsInvite,
        channelUpdate,
        newOwner,
        usersMembers,
        userDirectMessage,
        usersInvite,
        channelType,
        channelTypeUpdate
      } = storeToRefs(channelStore);

const baseUrlMsg = '/messages';
const baseUrlChannel = '/channels';

onMounted(async () => {
  Get('/channels/search?&password').then(res => allChannels.value = res.data);
  Get('/users/search?id=' + loggedUser.value?.id.toString() + '&memberChannels&inviteChannels').then(res => {
    channels.value = res.data[0].memberChannels
    channelsInvite.value = res.data[0].inviteChannels
  });

  channelsJoin.value = true;
  newOwner.value = -1;
  channelType.value = 1;
  channelTypeUpdate.value = 1;
});

onUnmounted(() => {
  socket.off('msgToServer');
  socket.off('channelToServer');
  socket.off('deleteChannelToServer');
  socket.off('newOwnerToServer');
  socket.off('updateChannelToServer');
  socket.off('inviteJoinChannelToServer');
  socket.off('updateMemberChannelToServer');
})

///////////////////////
//  MESSAGES
///////////////////////
const displayMessages = (channel_item: Channel) => {
  Get('/channels/search?id=' + channel_item.id.toString() + '&messages&owner&admins&members&mutes&bans').then(res => {
    channel.value = res.data[0]
    messages.value = res.data[0].messages
    usersMembers.value = res.data[0].members
  })
}

const handleSubmitNewMessage = (channelId: Number | undefined) => {
  if (channelId != undefined) {
    if (textMsg.value !== '') {
      const newMessage = {
        author: loggedUser.value?.id,
        channel: {id: channelId},
        data: textMsg.value
      };
      socket.emit('msgToServer', newMessage, loggedUser.value)
    }
   }
   textMsg.value = '';
}

socket.on('msgToClient', (newMessage: Message) => {
 if (channel.value != undefined && channel.value.id == newMessage.channel.id) {
   messageStore.createMessage(newMessage);
 }
})

// Créer un nouveau channel entre 2 users si n'existe pas encore et permet d'envoyer des messages privés
const sendDirectMessage = () => {
  const name1 = `${userDirectMessage.value?.username} ${loggedUser.value?.username}`;
  const name2 = `${loggedUser.value?.username} ${userDirectMessage.value?.username}`;
  const channelItem = allChannels.value.find((el: Channel) => el.name === name1 || el.name === name2);
  if (channelItem == null) {
    const newChannel = {
      name: `${userDirectMessage.value?.username} ${loggedUser.value?.username}`,
      isPrivate: true,
      password: null,
      owner: { id: loggedUser.value?.id },
      admins: [{ id: loggedUser.value?.id }, {id: userDirectMessage.value?.id}],
      members: [{ id: loggedUser.value?.id }, {id: userDirectMessage.value?.id}],
      isDirectMessage: true
    };
    Post(baseUrlChannel, newChannel).then(res => {
      if (res.status == 201) {
        channelStore.joinChannel(res.data);
        socket.emit('channelToServer', res.data);
        channel.value = res.data;
        messages.value = [];
        socket.emit('msgToServer', {author: loggedUser.value?.id, channel: {id: res.data.id}, data: textDirectMsg.value}, loggedUser.value)
        textDirectMsg.value = '';
        Get('/channels/search?id=' + res.data.id.toString() + '&members').then(res => usersMembers.value = res.data[0].members)
      }
    })
  }
  else {
    socket.emit('msgToServer', {author: loggedUser.value?.id, channel: {id: channelItem.id}, data: textDirectMsg.value}, loggedUser.value)
    textDirectMsg.value = '';
  }
}

///////////////////////
//  CHANNELS
///////////////////////

// Créer un nouveau channel
const handleSubmitNewChannel = () => {
  if (input.value.create_channel !== '')
  {
    let obj: any = {}
    let users: any = []
    usersInvite.value.forEach((value) => {
      obj = {id: value.id}
      users.push(obj)
    })
    const newChannel = {
      name: input.value.create_channel,
      isPrivate: channelType.value == 2 ? true : false,
      password: channelType.value == 3 ? input.value.password : null,
      owner: { id: loggedUser.value?.id },
      admins: [{ id: loggedUser.value?.id }],
      members: [{ id: loggedUser.value?.id }],
      invites: channelType.value== 2 ? users : []
    };
    Post(baseUrlChannel, newChannel).then(res => {
      if (res.status == 201) {
        channelStore.joinChannel(res.data);
        socket.emit('channelToServer', res.data);
        channel.value = res.data;
        messages.value = [];
        if (res.data.isPrivate == true) {
          socket.emit('inviteJoinChannelToServer', res.data, ...usersInvite.value)
        }
      }
      Get('/channels/search?id=' + res.data.id.toString() + '&members').then(res => usersMembers.value = res.data[0].members)
    })
    inputStore.$reset();
  }
}

// Permet d'attraper l'information qu'un nouveau channel a été créé
socket.on('channelToClient', (newChannel: Channel) => {
  if (loggedUser.value != undefined) {
    channelStore.createChannel(newChannel);
    channelStore.updateMember();
    channelStore.updateOwner(loggedUser.value.id)
    if (loggedUser.value.id != newChannel.owner.id && newChannel.admins.findIndex((el: User) => el.id === loggedUser.value?.id) != -1) {
      channelStore.joinChannel(newChannel);
    }
  }
})

socket.on('inviteJoinChannelToClient', (inviteChannel: Channel) => {
  channelStore.addChannelInvite(inviteChannel)
})

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

// Rejoindre un channel
const joinChannel = () => {
  const updateChannel = {
    addMembers: [{id: loggedUser.value?.id}]
  };
  if (channelJoin.value != undefined) {
    if (channelJoin.value.password != null) {
      if (channelJoin.value.password !== input.value.password) {
        console.log("WRONG PASSWORD")
        inputStore.$reset();
        return ;
      }
    }
    Patch(baseUrlChannel + '/' + channelJoin.value?.id.toString(), updateChannel).then(res => {
      channelStore.joinChannel(res.data);
      channel.value = channelStore.getChannelByID(res.data.id);
      socket.emit("updateMemberChannelToServer", res.data)
      messages.value = res.data.messages;
      channelStore.updateMember();
      textMsg.value = `${loggedUser.value?.username} has joined the channel.`;
      if (channelJoin.value != undefined) {
        handleSubmitNewMessage(channelJoin.value?.id)
      }
    })
  }
  inputStore.$reset();
}

// Accepter une invitation à rejoindre un channel
const acceptInviteChannel = () => {
  console.log(`Accept invitation => ${channelJoin.value?.name}`)
  const updateChannel = {
    removeInvites: [{id: loggedUser.value?.id}],
    addMembers: [{id: loggedUser.value?.id}]
  };
  if (channelJoin.value != undefined) {
    Patch(baseUrlChannel + '/' + channelJoin.value?.id.toString(), updateChannel).then(res => {
      channelStore.deleteChannelInvite(res.data)
      channelStore.joinChannel(res.data)
      channelStore.updateMember()
      textMsg.value = `${loggedUser.value?.username} has joined the channel.`;
      if (channelJoin.value != undefined) {
        handleSubmitNewMessage(channelJoin.value?.id)
      }
      socket.emit('updateChannelToServer', res.data)
    })
  }
}

// Refuser une invitation à rejoindre un channel
const refuseInviteChannel = () => {
  console.log(`Refuse invitation => ${channelJoin.value?.name}`)
  const updateChannel = {
    removeInvites: [{id: loggedUser.value?.id}]
  };
  if (channelJoin.value != undefined) {
    Patch(baseUrlChannel + '/' + channelJoin.value?.id.toString(), updateChannel).then(res => {
      channelStore.deleteChannelInvite(res.data)
    })
  }
  inputStore.$reset();
}

// Quitter un channel si pas Owner
const leaveChannelIfNotOwner = (channel_item: Channel) => {
  let updateChannel: any ;
  Get('/channels/search?id=' + channel_item.id.toString() + '&admins&mutes&bans&members').then(res => {
    [channelLeave.value] = res.data;
    if (loggedUser.value != null) {
      if (channelStore.isAdmin(channelLeave.value, loggedUser.value.id) == true) {
        updateChannel = {
          removeAdmins: [{id: loggedUser.value?.id}],
          removeMembers: [{id: loggedUser.value?.id}]
        };
      }
      else {
        if (channelStore.isBan(channelLeave.value, loggedUser.value.id) == true) {
          updateChannel = {
            removeBans: [{id: loggedUser.value?.id}],
            removeMembers: [{id: loggedUser.value?.id}]
          };
        }
          else if (channelStore.isMute(channelLeave.value, loggedUser.value.id) == true) {
          updateChannel = {
            removeMutes: [{id: loggedUser.value?.id}],
            removeMembers: [{id: loggedUser.value?.id}]
          };
        }
        else {
          updateChannel = {
            removeMembers: [{id: loggedUser.value?.id}]
          };
        }
      }
      Patch(baseUrlChannel + '/' + channel_item.id.toString(), updateChannel).then(res => {
        textMsg.value = `${loggedUser.value?.username} has leaved the channel.`;
        handleSubmitNewMessage(channel_item.id)
        socket.emit("updateMemberChannelToServer", res.data)
        channelStore.leaveChannel(res.data);
        channel.value = channel.value?.id === channel_item.id ? undefined : channel.value;
        messages.value = channel.value?.id === channel_item.id ? [] : messages.value;
        channelStore.updateMember();
      })
    }
  })
}

// Quitter un channel si Owner
const leaveChannelIfOwner = () => {
  let updateChannel: any ;
  if (loggedUser.value != null) {
    if (channelLeave.value !== undefined) {
      if (channelStore.isAdmin(channelLeave.value, newOwner.value != undefined ? newOwner.value : -1) == true) {
        updateChannel = {
          owner: {id: newOwner.value},
          removeAdmins: [{id: loggedUser.value?.id}],
          removeMembers: [{id: loggedUser.value?.id}],
        }
      }
      else {
        if (channelStore.isMute(channelLeave.value, newOwner.value != undefined ? newOwner.value : -1) == true) {
          updateChannel = {
            owner: {id: newOwner.value},
            addAdmins: [{id: newOwner.value}],
            removeMutes: [{id: newOwner.value}],
            removeAdmins: [{id: loggedUser.value?.id}],
            removeMembers: [{id: loggedUser.value?.id}],
   
          }
        }
        else {
          updateChannel = {
            owner: {id: newOwner.value},
            removeAdmins: [{id: loggedUser.value?.id}],
            addAdmins: [{id: newOwner.value}],
            removeMembers: [{id: loggedUser.value?.id}],
          }
        }
      }
      Patch(baseUrlChannel + '/' + channelLeave.value.id.toString(), updateChannel).then(res => {
        textMsg.value = `${loggedUser.value?.username} the channel owner has left the channel - - ${res.data.owner.username} becomes the owner.`;
        handleSubmitNewMessage(res.data.id)
        channelStore.leaveChannel(res.data);
        
        channel.value = channel.value?.id === channelLeave.value?.id ? undefined : channel.value;
        messages.value = channel.value?.id === channelLeave.value?.id ? [] : messages.value;
        channelStore.updateMember();
        channelStore.updateOwner(loggedUser.value != null ? loggedUser.value.id : -1)
        socket.emit('newOwnerToServer', res.data.owner.id)
        socket.emit("updateMemberChannelToServer", res.data)
      }) 
    }
  }
}

socket.on('newOwnerToClient', (newOwnerID: number) => {
  if (loggedUser.value?.id === newOwnerID) {
    channelStore.updateOwner(newOwnerID);
  }
})

socket.on('updateMemberChannelToClient', (channelID: number) => {
  if (channel.value?.id === channelID) {
    Get('/channels/search?id=' + channelID.toString() + '&owner&members&admins&mutes&bans').then(res => {
      channel.value = res.data[0]
      usersMembers.value = res.data[0].members
    })
  }
})

// Supprimer un channel
const deleteChannel = () => {
  Delete(baseUrlChannel + '/' + channelLeave.value?.id.toString()).then(res => {
    if (res.status == 200) {
      socket.emit('deleteChannelToServer', channelLeave.value?.id)
    }
  });
}

socket.on('deleteChannelToClient', (channelID: number) => {
  if (channel.value?.id == channelID) {
    channel.value = undefined;
    messages.value = [];
  }
  channelStore.deleteChannel(channelID)
})

// Mettre à jour un channel
const updateChannel = () => {
  if (channelUpdate.value !== undefined)
  {
    let obj: any = {}
    let users: any = []
    usersInvite.value.forEach((value) => {
      obj = {id: value.id}
      users.push(obj)
    })
    const updateChannel = {
      name: input.value.update_channel_name,
      isPrivate: channelTypeUpdate.value == 2 ? true : false,
      password: channelTypeUpdate.value == 3 ? input.value.password : null,
      invites: channelTypeUpdate.value == 2 ? users : []
    }
    Patch(baseUrlChannel + '/' + input.value.channel_id, updateChannel).then(res => {
      if (res.status == 200) {
        socket.emit('updateChannelToServer', res.data)
      }
    });
  }
  inputStore.$reset();
};

socket.on('updateChannelToClient', (updateChannel: Channel) => {
  if (loggedUser.value != null) {
    channelStore.updateChannel(updateChannel.id, updateChannel, loggedUser.value.id);
    if (channel.value?.id === updateChannel.id) {
      Get('/channels/search?id=' + channel.value.id.toString() + '&members').then(res => usersMembers.value = res.data[0].members)
      channel.value = updateChannel;
    }
  }
})

const updateChan = (updateChannel: any) => {
  Patch(baseUrlChannel + '/' + channel.value?.id, updateChannel).then(res => {
      if (res.status == 200) {
        socket.emit('updateChannelToServer', res.data)

      }
    });
}

const searchName = (channelItem: Channel | undefined): string=> {
  if (channelItem == undefined) {return "Messages"}
  if (channelItem.isDirectMessage === true) {
    const names = channelItem.name.split(' ');
    if (names[0] === loggedUser.value?.username) {
        return names[1]
    } else {
      return names[0]
    }
  }
  return channelItem.name
}

</script>

<template>
  <h2>Chat</h2>
  <div class="container-fluid chat">
    <div class="chatMenu">
      <div class="chatMenuWrapper">
        <!--Permet d'afficher mes channels-->
        <button @click="channelsJoin = true" type="button" class="btn btn-secondary send">Channels</button>
        <!--Permet d'afficher tous les channels-->
        <button @click="channelsJoin = false, channelStore.updateMember(), channelStore.updateOwner(loggedUser != null ? loggedUser.id : -1)" type="button" class="btn btn-secondary send">All Channels</button>
        <!--Permet d'afficher les inviations aux channels-->
        <button @click="channelsJoin = undefined" type="button" class="btn btn-secondary send">Invite
          <div v-if="channelsInvite.length > 0">
            <span class="badge rounded-pill bg-danger">{{channelsInvite.length}}</span>
          </div>
        </button>

        <!--Affichage de mes channels-->
        <div v-if="channelsJoin == true">
          <div v-if="channels">
            <ul v-for="(item, index) in channels" :key="index" class="list-group">
              <!--Permet d'afficher les messages appartenant au channel selectionné-->
              <button @click="displayMessages(item)" type="button" class="btn btn-secondary btn-channel">
              {{searchName(item)}}
              </button>
            </ul>
          </div>
        </div>

        <!--Affichage de tous les channels-->
        <div v-else-if="channelsJoin == false">
          <div v-if="allChannels">
            <ul v-for="(item, index) in  allChannels" :key="index" class="list-group">

              <div v-if="item.isMember">
                <!--Permet d'afficher les messages appartenant au channel selectionné si je suis membre du channel-->
                <button @click="displayMessages(item)" type="button" class="btn btn-secondary btn-channel">
                  <span v-if="item.isPrivate == true" class="badge bg-success">Private</span>
                  <span v-else-if="item.password != null" class="badge bg-warning">Pass : {{item.password}}</span>
                  <span v-else class="badge bg-success">Public</span>
                  {{searchName(item)}}
                </button>

                <div v-if="item.isOwner">
                  <!--Permet de quitter un channel si on est le propriétaire du channel-->
                  <button type="button" class="btn btn-danger btn-channel btn-sm" @click="Get('channels/search?id=' + item.id.toString() + '&admins&mutes&members').then(res => [channelLeave] = res.data)" data-bs-toggle="modal" data-bs-target="#leaveChannel">
                    Leave Owner
                  </button>

                  <!--Permet de mettre à jour le channel-->
                  <button
                    type="button"
                    class="btn btn-success btn-channel btn-sm"
                    @click="
                      Get('/users/search').then(res => users = res.data);
                      usersInvite = [];
                      Get('/channels/search?id=' + item.id.toString() + '&password&members&invites').then(res => {
                        channelUpdate = res.data[0];
                        input.update_channel_name = res.data[0].name;
                        input.channel_id = res.data[0].id;
                      })"
                    data-bs-toggle="modal"
                    data-bs-target="#updateChannel">
                    Update Channel
                  </button>
                </div>

                <div v-else>
                  <!--Permet de quitter un channel-->
                  <button type="button" class="btn btn-danger btn-channel btn-sm" @click="leaveChannelIfNotOwner(item)" >Leave</button>
                </div>
              </div>

                <!--Permet de bloquer l'accès aux messages appartenant au channel selectionné si je ne suis pas membre du channel-->
                <div v-else>
                  <button type="button" class="btn btn-secondary btn-channel">
                    <span v-if="item.isPrivate == true" class="badge bg-success">Private</span>
                    <span v-else-if="item.password != null" class="badge bg-warning">Pass : {{item.password}}</span>
                    <span v-else class="badge bg-success">Public</span>
                    {{item.name}}
                  </button>

                  <div v-if="item.isPrivate == false">
                    <!--Permet de rejoindre un channel si le channel n'est pas privé-->
                    <button type="button" class="btn btn-primary btn-channel btn-sm" @click="channelJoin = item" data-bs-toggle="modal" data-bs-target="#joinChannel" >Join</button>
                  </div>
                </div>
            <!--</div>-->
            </ul>
          </div>
        </div>

        <!--Affichage des invitations-->
        <div v-else>
          <div v-if="channelsInvite">
            <ul v-for="(item, index) in  channelsInvite" :key="index" class="list-group">
              <button type="button" class="btn btn-secondary btn-channel">
                {{item.name}}
              </button> 
              <button type="button" class="btn btn-primary btn-channel btn-sm" @click="channelJoin = item, acceptInviteChannel()">Join</button>
              <button type="button" class="btn btn-danger btn-channel btn-sm" @click="channelJoin = item, refuseInviteChannel()">Refuse</button>
            </ul>
          </div>
        </div>

        <div>

        <!--Permet de créer un nouveau channel-->
        <button @click="Get('/users/search').then(res => users = res.data); usersInvite = []" type="button" class="send" data-bs-toggle="modal" data-bs-target="#newChannel">
          New Channel
        </button>

        </div>
      </div>
    </div>

    <span class="vertical-line"></span>

    <div class="chatBox">
      <div class="chatBoxWrapper">{{searchName(channel)}}

        <!--Affichage des messages du channel selectionné-->
        <div v-if="channel != undefined">

          <div v-if="channelStore.isBan(channel, loggedUser?.id) == false">
            <div v-if="messages" class="scroller">
              <ul id="msg" v-for="item in messages" :key="item.id">
              <div v-if="channelStore.isBan(channel, item.author.id) == true">
                *** Message delete ***
              </div>
              <div v-else>
                {{item.author.username}} wrote : {{ item.data }}
              </div>
              </ul>
            </div>
          </div>
          <div v-else>
            You are banned from this channel for XX time
          </div>

          <!--Permet d'envoyer un nouveau message dans le channel selectionné'-->
          <form @submit.prevent.trim.lazy="handleSubmitNewMessage(channel?.id)" method="POST" class="form">
            <input v-model="textMsg" type="text" class="input"/>
            <input type="submit" value="Send" class="send"/>
          </form>

        </div>

      </div>
    </div>

    <span class="vertical-line"></span>

    <!--Permettra de visualiser les membres du channel-->
    <div class="chatFriends">
      <div class="chatFriendsWrapper">
        <div v-if="channel != undefined">
          <div v-if="usersMembers">
            <div class="scroller">
              <div class="list-group" v-for="user in usersMembers" :key="user.id">

                <div v-if="channelStore.isBan(channel, user.id) == false">
                  <a  class="list-group-item list-group-item-action"> {{user.username}} =>

                    <div v-if="channelStore.isAdmin(channel, user.id)">
                      Admin
                      <div v-if="channelStore.isOwner(channel, loggedUser?.id) && loggedUser?.id != user.id">
                        <button @click="updateChan({removeAdmins: [{id: user.id}]})" type="button" class="btn btn-danger btn-channel btn-sm">
                          Remove admin
                        </button>
                      </div>
                    </div>

                    <div v-else-if="channelStore.isMember(channel, user.id)">
                      Member
                      <div v-if="channelStore.isOwner(channel, loggedUser?.id)">
                        <button @click="updateChan({addAdmins: [{id: user.id}]})" type="button" class="btn btn-success btn-channel btn-sm">
                          Add admin
                        </button>
                      </div>
                    </div>

                    <div v-if="user.id != loggedUser?.id && channel.isDirectMessage == false">
                      <button @click="userDirectMessage = user" type="button" class="btn btn-info btn-channel btn-sm" data-bs-toggle="modal" data-bs-target="#directMessage">
                        Send message
                      </button>
                    </div>

                    <div v-if="loggedUser?.id != user.id && !channelStore.isAdmin(channel, user.id) && !channelStore.isMute(channel, user.id)">
                      <button @click="updateChan({addMutes: [{id: user.id}]})" type="button" class="btn btn-warning btn-channel btn-sm">
                        Mute
                      </button>
                    </div>

                    <div v-if="loggedUser?.id != user.id && !channelStore.isAdmin(channel, user.id) && !channelStore.isBan(channel, user.id)">
                      <button @click="updateChan({addBans: [{id: user.id}]})" type="button" class="btn btn-warning btn-channel btn-sm">
                        Ban
                      </button>
                    </div>

                    <div v-if="loggedUser?.id != user.id && !channelStore.isAdmin(channel, user.id) && channelStore.isMute(channel, user.id)">
                      <button @click="updateChan({removeMutes: [{id: user.id}]})" type="button" class="btn btn-warning btn-channel btn-sm">
                        Remove mute
                      </button>
                    </div>

                  </a>
                </div>

                <div v-else>
                  *** Users Bans ***
                  <a  class="list-group-item list-group-item-action"> {{user.username}} =>
                    <div v-if="channelStore.isAdmin(channel, user.id)">
                      Admin
                      <div v-if="channelStore.isOwner(channel, loggedUser?.id) && loggedUser?.id != user.id">
                        <button @click="updateChan({removeAdmins: [{id: user.id}]})" type="button" class="btn btn-danger btn-channel btn-sm">
                          Remove admin
                        </button>
                      </div>
                    </div>

                    <div v-else-if="channelStore.isMember(channel, user.id)">
                      Member
                      <div v-if="channelStore.isOwner(channel, loggedUser?.id)">
                        <button @click="updateChan({addAdmins: [{id: user.id}]})" type="button" class="btn btn-success btn-channel btn-sm">
                          Add admin
                        </button>
                      </div>
                    </div>

                    <div v-if="user.id != loggedUser?.id && channel.isDirectMessage == false">
                      <button @click="userDirectMessage = user" type="button" class="btn btn-info btn-channel btn-sm" data-bs-toggle="modal" data-bs-target="#directMessage">
                        Send message
                      </button>
                    </div>

                    <div v-if="loggedUser?.id != user.id && !channelStore.isAdmin(channel, user.id) && !channelStore.isMute(channel, user.id)">
                      <button @click="updateChan({addMutes: [{id: user.id}]})" type="button" class="btn btn-warning btn-channel btn-sm">
                        Mute
                      </button>
                    </div>

                    <div v-if="loggedUser?.id != user.id && !channelStore.isAdmin(channel, user.id) && channelStore.isMute(channel, user.id)">
                      <button @click="updateChan({removeMutes: [{id: user.id}]})" type="button" class="btn btn-warning btn-channel btn-sm">
                        Remove mute
                      </button>
                    </div>

                    <div v-if="loggedUser?.id != user.id && !channelStore.isAdmin(channel, user.id) && channelStore.isBan(channel, user.id)">
                      <button @click="updateChan({removeBans: [{id: user.id}]})" type="button" class="btn btn-warning btn-channel btn-sm">
                        Remove ban
                      </button>
                    </div>

                  </a>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <!--Formulaire pour créer un nouveau channel-->
    <div class="modal fade modal-dialog-scrollable" id="newChannel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">

      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">New Channel => {{channelType}}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
     
            <div class="form form-new-channel">
              <label for="name">Channel name:</label>
              <input v-model="input.create_channel" type="text" class="input"/>
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
                <input v-model="input.password" type="text" class="input"/>
              </div>
            </div>
            <div v-else-if="channelType == 2">
              <div v-if="users.length != 1">
                  Choose users :
                  <div class="scroller">
                    <div class="list-group" v-for="user in users" :key="user.id">
                      <div v-if="user.id != loggedUser?.id">
                        <a  class="list-group-item list-group-item-action"> {{user.username}} =>
                          <button @click="updateUsersInvite(user)" type="button" class="btn btn-success btn-channel btn-sm">
                              {{usersInvite.findIndex((el: User) => el.id === user.id) == -1 ? "Invite" : "Remove"}}
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
              </div>
            </div>

          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
            <button @click="handleSubmitNewChannel" type="submit" class="btn btn-primary" data-bs-dismiss="modal">Create</button>
          </div>

        </div>
      </div>
    </div>

    <!--Formulaire pour modifier un channel-->
    <div class="modal fade modal-dialog-scrollable" id="updateChannel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">

      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Update : {{ input.update_channel_name }} => {{channelTypeUpdate}}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">

            <div class="form form-new-channel">
              <label for="name">Channel name:</label>
              <input v-model="input.update_channel_name" type="text" class="input"/>
            </div>
{{channelUpdate}}
            <div>Channel : {{channelUpdate?.isPrivate ? "Private" : channelUpdate?.password != null ? "Proteted" : "Public"}}</div>
            <div class="form-check form-check-inline">
              <input @click="channelTypeUpdate = 1" class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" checked>
              <label class="form-check-label" for="inlineRadio1">Public</label>
            </div>
            <div class="form-check form-check-inline">
              <input @click="channelTypeUpdate = 2" class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2">
              <label class="form-check-label" for="inlineRadio2">Private</label>
            </div>
            <div class="form-check form-check-inline">
              <input @click="channelTypeUpdate = 3" class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2">
              <label class="form-check-label" for="inlineRadio2">Protected</label>
            </div>

            <div v-if="channelTypeUpdate == 3">
              <div class="form form-new-channel">
                <label for="name">Password:</label>
                <input v-model="input.password" type="text" class="input"/>
              </div>
            </div>
            <div v-else-if="channelTypeUpdate == 2">
              <div v-if="users.length != 1">
                  Choose users :
                  <div class="scroller">
                    <div class="list-group" v-for="user in users" :key="user.id">
                      <div v-if="user.id != loggedUser?.id && channelStore.isMember(channelUpdate, user.id) == false  && channelStore.isInvite(channelUpdate, user.id) == false">
                        <a  class="list-group-item list-group-item-action"> {{user.username}} =>
                          <button @click="updateUsersInvite(user)" type="button" class="btn btn-success btn-channel btn-sm">
                              {{usersInvite.findIndex((el: User) => el.id === user.id) == -1 ? "Invite" : "Remove"}}
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
              </div>
            </div>

          </div>

          <div class="modal-footer">
            <button @click="inputStore.$reset(); channelUpdate = undefined" type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
            <button @click="updateChannel" type="submit" class="btn btn-primary" data-bs-dismiss="modal">Update</button>
          </div>

        </div>
      </div>
    </div>

    <!--Formulaire pour rejoindre un channel-->
    <div class="modal fade modal-dialog-scrollable" id="joinChannel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">

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
                <input v-model="input.password" type="text" class="input"/>
              </div>
            </div>
          </div>


          <div class="modal-footer">
            <button @click="inputStore.$reset(); channelJoin = undefined" type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
            <button @click="joinChannel()" type="submit" class="btn btn-primary" data-bs-dismiss="modal">Join</button>
          </div>

        </div>
      </div>
    </div>


    <!--Formulaire pour détruire un channel ou définir un nouveau Owner-->
    <div class="modal fade modal-dialog-scrollable" id="leaveChannel" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">

      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Leave channel : {{channelLeave?.name}}</h5>
              <button @click="newOwner = -1" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                        <button @click="newOwner = item.id" type="button" class="btn btn-danger btn-channel" data-bs-toggle="modal" data-bs-target="#validateNewOwner">
                            New Owner                
                        </button>
                      </a>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          <div class="modal-footer">
            <button @click="newOwner = -1" type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
          </div>

        </div>
      </div>
    </div>

    <!--Formulaire pour valider le nouveau Owner-->
    <div class="modal fade modal-dialog-scrollable" id="validateNewOwner" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            Are you sure ?
              <button @click="leaveChannelIfOwner" type="button" class="btn btn-primary btn-sm" data-bs-dismiss="modal">Yes</button>
              <button @click="newOwner = -1" type="button" class="btn btn-danger btn-sm"  data-bs-toggle="modal" data-bs-target="#leaveChannel">No</button>
          </div>
        </div>
      </div>
    </div>

    <!--Formulaire pour envoyer un direct message-->
    <div class="modal fade modal-dialog-scrollable" id="directMessage" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">

      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">{{userDirectMessage?.username}}</h5>
              <button @click="textDirectMsg = ''" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">

            <div class="form form-new-channel">
              <input v-model="textDirectMsg" type="text" class="input"/>
            </div>

          </div>

          <div class="modal-footer">
            <button @click="textDirectMsg = ''" type="button" class="btn btn-danger" data-bs-dismiss="modal">Cancel</button>
            <button @click="sendDirectMessage" type="submit" class="btn btn-info" data-bs-dismiss="modal">Send</button>
          </div>

        </div>
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

.form-new-channel {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d;
  align-items: center;
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