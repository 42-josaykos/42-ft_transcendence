<script setup lang="ts">
import ModalChat from "./ModalChat.vue";
import { storeToRefs } from "pinia";
import { useChannelStore } from "@/stores/channel";
import { useMessageStore } from "@/stores/message";
import { useUserStore } from "@/stores/user";

import type { Channel } from "@/models/channel.model";
import type { User } from "@/models/user.model";
import { Get } from "@/services/requests";
import { ref } from "vue";

const messageStore = useMessageStore();
const { messages } = storeToRefs(messageStore);

const userStore = useUserStore();
const { loggedUser, users, socketChat } = storeToRefs(userStore);

let inputPassword = ref<string>("");
let channelName = ref<string>("");
const modalNewChannel = ref<boolean>(false);
const modalJoinChannel = ref<boolean>(false);
const modalDelChannel = ref<boolean>(false);
const modalUpdateChannel = ref<boolean>(false);
const modalValidate = ref<boolean>(false);
const modalAcceptJoinChannel = ref<boolean>(false);
const modalRefuseJoinChannel = ref<boolean>(false);
const errorBool = ref<boolean>(false);

const channelStore = useChannelStore();

const {
  allChannels,
  channel,
  channelJoin,
  channelLeave,
  channelsInvite,
  channelUpdate,
  newOwner,
  usersMembers,
  usersInvite,
  channelType
} = storeToRefs(channelStore);

const displayMessages = (channel_item: Channel) => {
  Get(`/channels/search?id=${channel_item.id.toString()}&messages&owner&admins&members&mutes&bans`)
    .then((res) => {
      if (res.status == 200) {
        channel.value = res.data[0];
        if (channel.value != undefined && loggedUser.value != null) {
          if (channelStore.isBan(channel.value, loggedUser.value?.id)) {
            channelStore.handleBanMute({...channel.value}, true)
          }
          else if (channelStore.isMute(channel.value, loggedUser.value?.id)) {
            channelStore.handleBanMute({...channel.value}, false)
          }
        }
        messageStore.sortMessages(res.data[0].messages);
        usersMembers.value = res.data[0].members;
      }
    });
};

// Créer un nouveau channel
const createChannel = () => {
  if (socketChat.value != undefined) {
    if (channelName.value !== "") {
      let obj: any = {};
      let usersArray: any = [];
      usersInvite.value.forEach((value) => {
        obj = { id: value.id };
        usersArray.push(obj);
      });
      const newChannel = {
        name: channelName.value,
        isPrivate: channelType.value == 2 ? true : false,
        password: channelType.value == 3 ? inputPassword : null,
        isProtected: channelType.value == 3 ? true : false,
        owner: { id: loggedUser.value?.id },
        admins: [{ id: loggedUser.value?.id }],
        members: [{ id: loggedUser.value?.id }],
        invites: channelType.value == 2 ? usersArray : [],
      };
      socketChat.value.emit("newChannel", newChannel, null, loggedUser.value);
    }
  }
  inputPassword.value = "";
  channelName.value = "";
  channelType.value = 0;
};

// Rejoindre un channel
const joinChannel = () => {
  if (socketChat.value != undefined) {
    socketChat.value.emit(
      "joinChannel",
      loggedUser.value?.id,
      channelJoin.value,
      inputPassword.value
    );
    inputPassword.value = "";
  }
};

// Accepter une invitation à rejoindre un channel
const acceptInviteChannel = () => {
  if (loggedUser.value != undefined) {
    if (socketChat.value != undefined) {
      const updateChannel = {
        removeInvites: [{ id: loggedUser.value?.id }],
        addMembers: [{ id: loggedUser.value?.id }],
      };
      if (channelJoin.value != undefined) {
        socketChat.value.emit(
          "updateMember",
          channelJoin.value.id,
          updateChannel,
          {
            author: loggedUser.value?.id,
            channel: { id: channelJoin.value.id },
            data: `${loggedUser.value?.username} has joined the channel.`,
          },
          loggedUser.value
        );
        socketChat.value.emit('updateInvite', channelJoin.value, true, loggedUser.value.id)
      }
    }
  }
};

// Refuser une invitation à rejoindre un channel
const refuseInviteChannel = () => {
  if (socketChat.value != undefined) {
    if (channelJoin.value != undefined) {
      socketChat.value.emit(
        "updateMember",
        channelJoin.value.id,
        { removeInvites: [{ id: loggedUser.value?.id }] },
        null,
        loggedUser.value
      );
      socketChat.value.emit('updateInvite', channelJoin.value, false, loggedUser.value?.id)
    }
  }
  //inputStore.$reset();
};

// Supprimer un channel
const deleteChannel = () => {
  if (socketChat.value != undefined) {
    socketChat.value.emit("deleteChannel", channelLeave.value?.id);
  }
};

// Quitter un channel si Owner
const leaveChannel = () => {
  if (loggedUser.value != undefined && socketChat.value != undefined) {
    if (channelLeave.value !== undefined) {
      const msg = {
                    author: loggedUser.value.id,
                    channel: { id: channelLeave.value?.id },
                    data: `${loggedUser.value.username} has leaved the channel.`,
                  }
      const msgOwner = {
                          author: loggedUser.value.id,
                          channel: { id: channelLeave.value.id },
                          data: `${loggedUser.value.username} the channel owner has left the channel - - ${newOwner.value?.username} becomes the owner.`,
                        }
      if (!channelLeave.value.isDirectChannel) {
        if (
          channelStore.isOwner(channelLeave.value, loggedUser.value.id)
        ) {
          if (
            channelStore.isAdmin(channelLeave.value, newOwner.value?.id
            )
          ) {
            socketChat.value.emit(
              "updateMember",
              channelLeave.value.id,
              {
                owner: { id: newOwner.value?.id },
                removeAdmins: [{ id: loggedUser.value.id }],
                removeMembers: [{ id: loggedUser.value.id }],
              },
              msgOwner,
              loggedUser.value
            );
          } else {
            if (
              channelStore.isBan(channelLeave.value, newOwner.value?.id) && !channelStore.isMute(channelLeave.value, newOwner.value?.id)
            ) {
              socketChat.value.emit(
                "updateMember",
                channelLeave.value?.id,
                {
                  owner: { id: newOwner.value?.id },
                  addAdmins: [{ id: newOwner.value?.id }],
                  removeBans: [{user: {id: newOwner.value?.id}}],
                  removeAdmins: [{ id: loggedUser.value.id}],
                  removeMembers: [{ id: loggedUser.value.id }],
                },
                msgOwner,
                loggedUser.value
              );
            } else if (
              channelStore.isMute(channelLeave.value, newOwner.value?.id) && !channelStore.isBan(channelLeave.value, newOwner.value?.id)
            ) {
              socketChat.value.emit(
                "updateMember",
                channelLeave.value?.id,
                {
                  owner: { id: newOwner.value?.id },
                  addAdmins: [{ id: newOwner.value?.id }],
                  removeMutes: [{user: {id: newOwner.value?.id}}],
                  removeAdmins: [{ id: loggedUser.value.id }],
                  removeMembers: [{ id: loggedUser.value.id }],
                },
                msgOwner,
                loggedUser.value
              );
            } else if (
              channelStore.isMute(channelLeave.value, newOwner.value?.id) && channelStore.isBan(channelLeave.value, newOwner.value?.id)
            ) {
              socketChat.value.emit(
                "updateMember",
                channelLeave.value?.id,
                {
                  owner: { id: newOwner.value?.id },
                  addAdmins: [{ id: newOwner.value?.id }],
                  removeBans: [{user: {id: newOwner.value?.id}}],
                  removeMutes: [{user: {id: newOwner.value?.id}}],
                  removeAdmins: [{ id: loggedUser.value.id }],
                  removeMembers: [{ id: loggedUser.value.id }],
                },
                msgOwner,
                loggedUser.value
              );
            } else {
              socketChat.value.emit(
                "updateMember",
                channelLeave.value?.id,
                {
                  owner: { id: newOwner.value?.id },
                  addAdmins: [{ id: newOwner.value?.id }],
                  removeAdmins: [{ id: loggedUser.value.id }],
                  removeMembers: [{ id: loggedUser.value.id }],
                },
                msgOwner,
                loggedUser.value
              );
            }
          }
        } else {
          if (
            channelStore.isAdmin(channelLeave.value, loggedUser.value.id)
          ) {
            socketChat.value.emit(
              "updateMember",
              channelLeave.value?.id,
              {
                removeAdmins: [{ id: loggedUser.value.id }],
                removeMembers: [{ id: loggedUser.value.id }],
              },
              msg,
              loggedUser.value
            );
          } else {
            if (
              channelStore.isBan(channelLeave.value, loggedUser.value.id) && !channelStore.isMute(channelLeave.value, loggedUser.value.id)
            ) {
              socketChat.value.emit(
                "updateMember",
                channelLeave.value?.id,
                {
                  removeBans: [{user: {id: loggedUser.value?.id}}],
                  removeMembers: [{ id: loggedUser.value.id }],
                },
                msg,
                loggedUser.value
              );
            } else if (
              channelStore.isMute(channelLeave.value, loggedUser.value.id) && !channelStore.isBan(channelLeave.value, loggedUser.value.id)
            ) {
              socketChat.value.emit(
                "updateMember",
                channelLeave.value?.id,
                {
                  removeMutes: [{user: {id: loggedUser.value?.id}}],
                  removeMembers: [{ id: loggedUser.value.id }],
                },
                msg,
                loggedUser.value
              );
            } else if (
              channelStore.isMute(channelLeave.value, loggedUser.value.id) && channelStore.isBan(channelLeave.value, loggedUser.value.id)
            ) {
              socketChat.value.emit(
                "updateMember",
                channelLeave.value?.id,
                {
                  removeBans: [{user: {id: loggedUser.value?.id}}],
                  removeMutes: [{user: {id: loggedUser.value?.id}}],
                  removeMembers: [{ id: loggedUser.value.id }],
                },
                msg,
                loggedUser.value
              );
            } else {
              socketChat.value.emit(
                "updateMember",
                channelLeave.value?.id,
                { removeMembers: [{ id: loggedUser.value.id }] },
                msg,
                loggedUser.value
              );
            }
          }
        }
        // channelStore.leaveChannel(channelLeave.value);

        channel.value =
          channel.value?.id === channelLeave.value?.id
            ? undefined
            : channel.value;
        messages.value =
          channel.value?.id === channelLeave.value?.id ? [] : messages.value;
        channelStore.updateMember(loggedUser.value.id);
      }
    }
  }
};

// Mettre à jour un channel
const updateChannel = () => {
  if (socketChat.value != undefined) {
    if (channelUpdate.value !== undefined) {
      let obj: any = {};
      let usersArray: any = [];
      usersInvite.value.forEach((value) => {
        obj = { id: value.id };
        usersArray.push(obj);
      });
      const updateChannel = {
        name: channelName.value,
        isPrivate: channelType.value == 2 ? true : false,
        password: channelType.value == 3 ? inputPassword.value : null,
        isProtected: channelType.value == 3 ? true : false,
        addInvites: channelType.value == 2 ? usersArray : [],
        removeInvites:
          channelType.value != 2 ? channelUpdate.value.invites : [],
      };
      socketChat.value.emit("updateChannel", channelUpdate.value.id, updateChannel);
    }
  }
  channelName.value = "";
  inputPassword.value = "";
  channelType.value = 1;
};

// Mettre à jour jour un tableau de users qui recevront une invitation à un channel
const updateUsersInvite = (user: User) => {
  if (usersInvite.value != undefined) {
    const index = usersInvite?.value.findIndex((el: User) => el.id === user.id);
    if (index != -1) {
      channelStore.deleteUserInvite(index);
    } else {
      channelStore.addUserInvite(user);
    }
  }
};

const isNum = (char: any) => {
  const str = "0123456789";
  for (const letter of str) {
    if (letter == char) {
      return true;
    }
  }
  return false;
}

</script>

<template>
  <div class="wrapper-accordion">
    <h2 class="accordion-header" id="channels-heading">
      <button
        @click="
          channelStore?.updateOwner(loggedUser?.id),
            channelStore?.updateMember(loggedUser?.id)
        "
        class="accordion-btn collapsed btn-neons-channels-menu"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#channels-collapse"
        aria-expanded="false"
        aria-controls="channels-collapse"
      >
        <div class="wrapper-icon">
          <i class="fa-solid fa-caret-down"></i>
        </div>
        <div class="col-sm-10 text-truncate title-btn">Channels</div>
      </button>
    </h2>
    <div
      id="channels-collapse"
      class="accordion-collapse collapse"
      aria-labelledby="channels-heading"
    >
      <div class="px-2 py-2">
        <div v-if="allChannels">
          <li
            v-for="(item, index) in allChannels"
            :key="index"
            class="btn-toggle-nav list-unstyled fw-normal small"
          >
            <div
              v-if="item.isMember && !item.isDirectChannel"
              style="display: flex; align-items: center"
            >
              <div class="text-truncate">
                <button
                  @click="displayMessages(item)"
                  type="button"
                  class="rounded btn-channel"
                >
                  {{ channelStore.searchName(item) }}
                </button>
              </div>
              <div class="ms-auto d-flex">
                <button
                  v-if="item.isOwner"
                  @click="
                    Get('/users/search').then((res) => {if (res.status == 200) {users = res.data}});
                    Get(`channels/search?id=${item.id.toString()}&admins&mutes&members&invites&bans`)
                      .then((res) => {
                        if (res.status == 200) {
                          [channelUpdate] = res.data;
                          channelName = res.data[0].name;
                          usersInvite = [];
                          modalUpdateChannel = true;
                          channelType = 0;
                        }
                      });
                  "
                  type="button"
                  class="rounded btn-channel wrapper-icon-leave ms-auto"
                >
                  <i class="fa-solid fa-pen"></i>
                </button>
                <button
                  @click="
                    Get(`channels/search?id=${item.id.toString()}&admins&mutes&members&bans&owner`)
                      .then((res) => {
                        if (res.status == 200) {
                          [channelLeave] = res.data;
                          item.isOwner
                            ? (modalDelChannel = true)
                            : (modalValidate = true);
                        }
                      })
                  "
                  type="button"
                  class="rounded btn-channel wrapper-icon-leave ms-auto"
                >
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
      <button
        @click="channelStore?.updateMember(loggedUser?.id)"
        class="accordion-btn collapsed btn-neons-channels-menu"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#all-channels-collapse"
        aria-expanded="false"
        aria-controls="all-channels-collapse"
      >
        <div class="wrapper-icon">
          <i class="fa-solid fa-caret-down"></i>
        </div>
        <div class="col-sm-10 text-truncate title-btn">All channels</div>
      </button>
    </h2>
    <div
      id="all-channels-collapse"
      class="accordion-collapse collapse"
      aria-labelledby="all-channels-heading"
    >
      <div class="px-2 py-2">
        <div v-if="allChannels">
          <li
            v-for="(item, index) in allChannels"
            :key="index"
            class="btn-toggle-nav list-unstyled fw-normal small"
          >
            <div
              v-if="!item.isMember && !item.isPrivate && !item.isDirectChannel"
              style="display: flex; align-items: center"
            >
              <div class="text-truncate">
                <button @click="" type="button" class="rounded btn-channel">
                  {{ channelStore.searchName(item) }}
                </button>
              </div>
              <div class="ms-auto">
                <button
                  @click="
                    modalJoinChannel = true;
                    Get(`channels/search?id=${item.id.toString()}&messages`)
                      .then((res) => {if (res.status == 200) {[channelJoin] = res.data}});
                  "
                  type="button"
                  class="rounded btn-channel wrapper-icon-leave ms-auto"
                >
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
      <button
        @click="
          channelStore?.updateOwner(loggedUser?.id),
            channelStore?.updateMember(loggedUser?.id)
        "
        class="accordion-btn collapsed btn-neons-channels-menu"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#direct-msg-collapse"
        aria-expanded="false"
        aria-controls="direct-msg-collapse"
      >
        <div class="wrapper-icon">
          <i class="fa-solid fa-caret-down"></i>
        </div>
        <div class="col-sm-10 text-truncate title-btn">Directs messages</div>
      </button>
    </h2>
    <div
      id="direct-msg-collapse"
      class="accordion-collapse collapse"
      aria-labelledby="direct-msg-heading"
    >
      <div class="px-2 py-2">
        <div v-if="allChannels">
          <li
            v-for="(item, index) in allChannels"
            :key="index"
            class="btn-toggle-nav list-unstyled fw-normal small"
          >
            <div
              v-if="item.isMember && item.isDirectChannel"
              style="display: flex; align-items: center"
            >
              <div class="text-truncate">
                <button
                  @click="displayMessages(item)"
                  type="button"
                  class="rounded btn-channel"
                >
                  {{ channelStore.searchName(item) }}
                </button>
              </div>
            </div>
          </li>
        </div>
      </div>
    </div>
  </div>

  <div class="wrapper-accordion">
    <h2 class="accordion-header" id="invite-heading">
      <button
        class="accordion-btn collapsed btn-neons-channels-menu position-relative"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#invite-collapse"
        aria-expanded="false"
        aria-controls="invite-collapse"
      >
        <div class="wrapper-icon">
          <i class="fa-solid fa-caret-down"></i>
        </div>
        <div class="col-sm-10 text-truncate title-btn">Invites</div>
        <div v-if="channelsInvite.length > 0" class="ms-auto">
          <span
            class="position-absolute position-badge translate-middle rounded-pill"
            >{{ channelsInvite.length }}</span
          >
        </div>
      </button>
    </h2>
    <div
      id="invite-collapse"
      class="accordion-collapse collapse"
      aria-labelledby="invite-heading"
    >
      <div class="px-2 py-2">
        <div v-if="channelsInvite">
          <li
            v-for="(item, index) in channelsInvite"
            :key="index"
            class="btn-toggle-nav list-unstyled fw-normal small"
          >
            <div style="display: flex; align-items: center">
              <div>
                <button @click="" type="button" class="rounded btn-channel">
                  {{ channelStore.searchName(item) }}
                </button>
              </div>
              <div class="ms-auto d-flex">
                <button
                  @click="
                    modalAcceptJoinChannel = true;
                    channelJoin = item;
                  "
                  type="button"
                  class="rounded btn-channel wrapper-icon-leave ms-auto"
                >
                  <i class="fa-solid fa-check"></i>
                </button>
                <button
                  @click="
                    modalRefuseJoinChannel = true;
                    Get(`channels/search?id=${item.id.toString()}&messages`)
                      .then((res) => {if (res.status == 200) {[channelJoin] = res.data}});
                  "
                  type="button"
                  class="rounded btn-channel wrapper-icon-leave ms-auto"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            </div>
          </li>
        </div>
      </div>
    </div>
  </div>

  <div>
    <button
      @click="
        Get('/users/search').then((res) => {
          if (res.status == 200) {
            users = res.data;
            usersInvite = [];
            modalNewChannel = true;
            channelType = 1;
          }
        })
      "
      type="button"
      class="rounded btn-channel wrapper-icon-leave ms-auto"
    >
      <i class="fa-solid fa-circle-plus"></i>
    </button>
  </div>

  <ModalChat
    v-if="modalNewChannel == true"
    @close="
      usersInvite = [];
      modalNewChannel = false;
      channelName = '';
      inputPassword = '';
      channelType = 0;
      errorBool = false;
    "
  >
    <template v-slot:header>
      <h2 class="pt-4"><u>New channel</u></h2>
    </template>
    <template v-slot:body>
      <div class="form-signin pb-3">
        <label for="name" class="sr-only">Channel name</label>
        <input
          type="text"
          id="name"
          class="form-control"
          placeholder="Channel name"
          v-model="channelName"
          required
          autofocus
        />
      </div>
      <div v-if="errorBool" class="mb-3" style="color: red; text-align: start;">
        - Please, enter a name for the channel <br>
        - Must not start with a number (0-9)
      </div>
      <div class="form-check form-check-inline">
        <input
          @click="channelType = 1"
          class="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id="inlineRadio1"
          checked
        />
        <label class="form-check-label" for="inlineRadio1">Public</label>
      </div>
      <div class="form-check form-check-inline">
        <input
          @click="channelType = 2"
          class="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id="inlineRadio2"
        />
        <label class="form-check-label" for="inlineRadio2">Private</label>
      </div>
      <div class="form-check form-check-inline">
        <input
          @click="channelType = 3"
          class="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id="inlineRadio2"
        />
        <label class="form-check-label" for="inlineRadio2">Protected</label>
      </div>
      <div v-if="channelType == 3">
        <div class="form-signin pt-3">
          <label for="password" class="sr-only">Password</label>
          <input
            type="text"
            id="password"
            class="form-control"
            placeholder="Password"
            v-model="inputPassword"
            required
            autofocus
          />
        </div>
      </div>
      <div v-else-if="channelType == 2">
        <div v-if="users.length != 1">
          <h5 class="pt-3" style="text-align: start"><u>Choose users :</u></h5>
          <div class="scrollspy-example2 card-choose-users">
            <div
              class="separator-list"
              v-for="user in users"
              :key="user.id"
            >
              <div
                v-if="user.id != loggedUser?.id"
                class="d-flex ms-auto"
                style="align-items: center"
              >
                <div class="ps-5">
                  <p class="pt-3" style="">{{ user.username }}</p>
                </div>
                <div class="ms-auto">
                  <button
                    @click="updateUsersInvite(user)"
                    type="button"
                    class="mod-btn mod-btn-cyan btn-sm"
                  >
                    {{ usersInvite.findIndex((el: User) => el.id === user.id) == -1 ? "Invite" : "Remove" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <button
        @click="if (channelName.trim() != '' && !isNum(channelName.trim()[0])) {
          modalNewChannel = false;
          createChannel();
          errorBool = false;
        } else {
          errorBool = true;
        }

        "
        type="submit"
        class="mod-btn mod-btn-blue"
        style="width: 75%;  margin-right: auto; margin-left: auto;"
      >
        Create
      </button>
      <button
        @click="
          usersInvite = [];
          modalNewChannel = false;
          channelName = '';
          inputPassword = '';
          channelType = 0;
          errorBool = false;
        "
        type="button"
        class="mod-btn mod-btn-yellow"
        style="width: 75%;  margin-right: auto; margin-left: auto;"
      >
        Cancel
      </button>
    </template>
  </ModalChat>

  <ModalChat
    v-if="modalUpdateChannel == true"
    @close="
      usersInvite = [];
      modalUpdateChannel = false;
      channelName = '';
      inputPassword = '';
      channelType = 0;
      errorBool = false;
    "
  >
    <template v-slot:header>
      <h2 class="pt-4">
        <u>Update channel :</u> {{ channelUpdate?.name }}
      </h2>
    </template>
    <template v-slot:body>
      <div class="form-signin pb-3">
        <label for="name" class="sr-only">Channel name</label>
        <input
          type="text"
          id="name"
          class="form-control"
          placeholder="Channel name"
          v-model="channelName"
          required
          autofocus
        />
      </div>
      <div v-if="errorBool" class="mb-3" style="color: red; text-align: start;">
        - Please, enter a name for the channel <br>
        - Must not start with a number (0-9)
      </div>
      <div class="form-check form-check-inline">
        <input
          @click="channelType = 1"
          class="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id="inlineRadio1"
        />
        <label class="form-check-label" for="inlineRadio1">Public</label>
      </div>
      <div class="form-check form-check-inline">
        <input
          @click="channelType = 2"
          class="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id="inlineRadio2"
        />
        <label class="form-check-label" for="inlineRadio2">Private</label>
      </div>
      <div class="form-check form-check-inline">
        <input
          @click="channelType = 3"
          class="form-check-input"
          type="radio"
          name="inlineRadioOptions"
          id="inlineRadio2"
        />
        <label class="form-check-label" for="inlineRadio2">Protected</label>
      </div>
      <div v-if="channelType == 3">
        <div class="form-signin pt-3">
          <label for="password" class="sr-only">Password</label>
          <input
            type="text"
            id="password"
            class="form-control"
            placeholder="Password"
            v-model="inputPassword"
            required
            autofocus
          />
        </div>
      </div>
      <div v-else-if="channelType == 2">
        <div v-if="users.length != 1 && !channelStore.checkIfUserInTheChannel()">
          <h5 class="pt-3" style="text-align: start"><u>Choose users :</u></h5>
          <div class="scrollspy-example2 card-choose-users">
            <div
              class="separator-list"
              v-for="user in users"
              :key="user.id"
            >
              <div
                v-if="
                  user.id != loggedUser?.id &&
                  channelStore.isMember(channelUpdate, user.id) == false &&
                  channelStore.isInvite(channelUpdate, user.id) == false
                "
                class="d-flex ms-auto"
                style="align-items: center"
              >
                <div class="ps-5">
                  <p class="pt-3" style="">{{ user.username }}</p>
                </div>
                <div class="ms-auto">
                  <button
                    @click="updateUsersInvite(user)"
                    type="button"
                    class="mod-btn mod-btn-cyan btn-sm"
                  >
                    {{ usersInvite.findIndex((el: User) => el.id === user.id) == -1 ? "Invite" : "Remove" }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <button
        @click="if (channelName.trim() != '' && !isNum(channelName.trim()[0])) {
          modalUpdateChannel = false;
          updateChannel();
          errorBool = false;
        } else {
          errorBool = true;
        }
        "
        type="submit"
        class="mod-btn mod-btn-blue"
        style="width: 75%; margin-right: auto; margin-left: auto;"
      >
        Update
      </button>
      <button
        @click="
          usersInvite = [];
          modalUpdateChannel = false;
          channelName = '';
          inputPassword = '';
          channelType = 0;
          errorBool = false;
        "
        type="button"
        class="mod-btn mod-btn-yellow"
        style="width: 75%;  margin-right: auto; margin-left: auto;"
      >
        Cancel
      </button>
    </template>
  </ModalChat>

  <ModalChat
    v-if="modalDelChannel == true"
    @close="
      newOwner = undefined;
      modalDelChannel = false;
    "
  >
    <template v-slot:header>
      <h2 class="pt-4">
        <u>Leave channel :</u> {{ channelLeave?.name }}
      </h2>
    </template>
    <template v-slot:body>
      <h5 class="pt-3" style="text-align: start">
        <u>Click here if you want to permanently delete this channel :</u>
      </h5>
      <div class="d-grid gap-2">
        <button
          @click="
            deleteChannel();
            modalDelChannel = false;
          "
          type="button"
          class="mod-btn mod-btn-red"
          style="width: 75%;  margin-right: auto; margin-left: auto;"
        >
          Delete
        </button>
      </div>
      <br />
      <div v-if="channelLeave?.members.length != 1">
        <h5 class="pt-3" style="text-align: start">
          <u>Otherwise choose a new channel owner :</u>
        </h5>
        <div
          v-if="channelLeave?.members"
          class="scrollspy-example2 card-choose-users"
        >
          <div
            class="separator-list"
            v-for="item in channelLeave.members"
            :key="item.id"
          >
            <div
              v-if="item.id != loggedUser?.id"
              class="d-flex ms-auto"
              style="align-items: center"
            >
              <div class="ps-5">
                <p class="pt-3" style="">{{ item.username }}</p>
              </div>
              <div class="ms-auto">
                <button
                  @click="
                    newOwner = item;
                    modalDelChannel = false;
                    modalValidate = true;
                  "
                  type="button"
                  class="mod-btn mod-btn-cyan btn-sm"
                >
                  New Owner
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <button
        @click="
          newOwner = undefined;
          modalDelChannel = false;
        "
        type="button"
        class="mod-btn mod-btn-yellow"
        style="width: 75%;  margin-right: auto; margin-left: auto;"
      >
        Cancel
      </button>
    </template>
  </ModalChat>

  <ModalChat
    v-if="modalValidate == true"
    @close="
      newOwner = undefined;
      modalValidate = false;
    "
  >
    <template v-slot:header>
      <h2 class="pt-4"><u>Are you sure ?</u></h2>
    </template>
    <template v-slot:footer>
      <button
        @click="
          modalValidate = false;
          leaveChannel();
        "
        type="button"
        class="mod-btn mod-btn-blue"
        style="width: 75%;  margin-right: auto; margin-left: auto;"
      >
        Yes
      </button>
      <button
        @click="
          newOwner = undefined;
          modalValidate = false;
          channelStore.isOwner(channelLeave, loggedUser?.id)
            ? (modalDelChannel = true)
            : (modalDelChannel = false);
        "
        type="button"
        class="mod-btn mod-btn-yellow"
        style="width: 75%;  margin-right: auto; margin-left: auto;"
      >
        No
      </button>
    </template>
  </ModalChat>

  <ModalChat v-if="modalJoinChannel" @close="modalJoinChannel = false">
    <template v-slot:header>
      <h2 style="padding-top: 10px"><u>Join :</u> {{ channelJoin?.name }}</h2>
    </template>
    <template v-slot:body>
      <div v-if="channelJoin?.isProtected == true">
        <h5 class="pt-3" style="text-align: start">
          <u>This channel is protected with a password :</u>
        </h5>
        <div class="form-signin pt-3">
          <label for="password" class="sr-only">Password</label>
          <input
            type="text"
            id="password"
            class="form-control"
            placeholder="Password"
            v-model="inputPassword"
            required
            autofocus
          />
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <button
        @click="
          joinChannel();
          modalJoinChannel = false;
        "
        type="submit"
        class="mod-btn mod-btn-blue"
        style="width: 75%;  margin-right: auto; margin-left: auto;"
      >
        Join
      </button>
      <button
        @click="modalJoinChannel = false"
        type="button"
        class="mod-btn mod-btn-yellow"
        style="width: 75%;  margin-right: auto; margin-left: auto;"
      >
        Cancel
      </button>
    </template>
  </ModalChat>

  <ModalChat
    v-if="modalAcceptJoinChannel == true"
    @close="modalAcceptJoinChannel = false"
  >
    <template v-slot:header>
      <h2 class="pt-4">
        <u>Are you sure you want to accept the invitation to this channel</u>
      </h2>
    </template>
    <template v-slot:footer>
      <button
        @click="
          modalAcceptJoinChannel = false;
          acceptInviteChannel();
        "
        type="button"
        class="mod-btn mod-btn-blue"
        style="width: 75%;  margin-right: auto; margin-left: auto;"
      >
        Yes
      </button>
      <button
        @click="modalAcceptJoinChannel = false"
        type="button"
        class="mod-btn mod-btn-yellow"
        style="width: 75%;  margin-right: auto; margin-left: auto;"
      >
        No
      </button>
    </template>
  </ModalChat>

  <ModalChat
    v-if="modalRefuseJoinChannel == true"
    @close="modalRefuseJoinChannel = false"
  >
    <template v-slot:header>
      <h2 class="pt-4">
        <u>Are you sure you want to decline the invitation to this channel</u>
      </h2>
    </template>
    <template v-slot:footer>
      <button
        @click="
          modalRefuseJoinChannel = false;
          refuseInviteChannel();
        "
        type="button"
        class="mod-btn mod-btn-blue"
        style="width: 75%;  margin-right: auto; margin-left: auto;"
      >
        Yes
      </button>
      <button
        @click="modalRefuseJoinChannel = false"
        type="button"
        class="mod-btn mod-btn-yellow"
        style="width: 75%;  margin-right: auto; margin-left: auto;"
      >
        No
      </button>
    </template>
  </ModalChat>
</template>

<style>
.position-badge {
  left: 90% !important;
  top: 50% !important;
  display: inline-block;
  padding: 0.35em 0.65em;
  font-size: 0.75em;
  font-weight: 700;
  line-height: 1;
  color: #fff;
  background-color: rgb(54, 224, 28);
  text-align: center;
  white-space: nowrap;
  border: rgb(54, 224, 28) 3px solid;
  box-shadow: inset 0 0 0.5em 0 hsl(54, 224, 28), 0 0 0.5em 0 hsl(54, 224, 28);
}

.title-btn {
  /*display: block;
    text-overflow: ellipsis;
    overflow: hidden;*/
  white-space: nowrap;
}

.wrapper-icon {
  padding-right: 20px;
  padding-left: 10px;
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
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out;
  border-color: 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  border-radius: 0.15s ease;
}

.accordion-btn::after {
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  margin-left: auto;
  content: "";
  background-repeat: no-repeat;
  background-size: 1.25rem;
  transition: transform 0.2s ease-in-out;
  transform: rotate(-180deg);
}

.btn-neons-channels-menu {
  background-color: transparent;
  color: #c4c4c4;
  box-shadow: 0px 0px 10px 2px #e58703;
  position: relative;
  border-radius: 10px;
  border: #e58703 3px solid;
  transition: 0.4s;
  margin: 5px 15px 5px;
  width: -webkit-fill-available;
  width: -moz-available;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3), 0 0 0.45em currentColor;
  font-weight: normal;
}

.btn-neons-channels-menu:hover {
  background-color: #e58703;
  color: #000;
}

.btn-channel {
  background-color: transparent !important;
  border-color: transparent !important;
  color: #c4c4c4;
  font-size: initial;
  font-weight:bolder;
}

.btn-channel:hover {
  font-size: 15px;
}

.wrapper-icon-leave {
  color: #e58703;
}

.scrollspy-example2 {
  position: relative;
  max-height: 20vh;
  margin-top: 0.5rem;
  overflow: auto;
}

.scrollspy-example2::-webkit-scrollbar {
  width: 8px;
}

.scrollspy-example2::-webkit-scrollbar-track {
  background: transparent;
}

.scrollspy-example2::-webkit-scrollbar-thumb {
  background-color: #5656f0;
}

.card-choose-users {
  border: #0202aa solid 3px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 2px #3131f7, inset 0px 0px 4px 2px #3131f7;
}

.separator-list {
  border-bottom: 1px solid #0202aa;
}
</style>
