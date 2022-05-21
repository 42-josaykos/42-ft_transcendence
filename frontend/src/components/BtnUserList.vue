<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import type { User } from "@/models/user.model";
import { useMessageStore } from "@/stores/message";
import UserCard from "./UserCard.vue";
import { computed } from "@vue/reactivity";

// Stores
const userStore = useUserStore();
const {
  socketChat,
  setting_open,
  userClick,
  loggedUser,
  usersFriends,
  modaleOpenInviteGame,
} = storeToRefs(userStore);

const messageStore = useMessageStore();
const { modalSendMessage } = storeToRefs(messageStore);

const props = defineProps({
  usersList: Object,
  isOffLine: Boolean,
});
const isFriend = (user: User): boolean => {
  const friendIndex = usersFriends.value.findIndex(
    (friend) => friend.id === user.id
  );
  if (friendIndex === -1) return false;
  else return true;
};

const numberUsers = computed(() => {
  let totalOnline = 0;
  if (props.usersList){
    for (const user in props.usersList) {
        totalOnline++;
      }
  }
  return totalOnline.toString()
})

</script>

<template>
  <span class="d-flex mb-3 mt-2">
    <span class="horizontal-line-center"></span>
      {{isOffLine ? 'Offline' : 'Online'}} - {{numberUsers}}
    <span class="horizontal-line-center"></span>
  </span>

  <table style="width: 90%; table-layout: fixed; margin-left: 5%">
    <tr v-for="player in props.usersList" :key="player.id">
      <!-- User -->
      <td style="width: 50%">
        <UserCard :user="player" :dashboard="true" :profile="true"/>
      </td>
        <!-- Profile -->
      <td>
        <a v-if="player.id != loggedUser?.id"
          class="hovertext hovertextC"
          data-hover="Profile"
          href="javascript:void();"
          @click="
            setting_open = true;
            userClick = player;
          "
        >
          <i class="fa-solid fa-user action_icon"></i
        ></a>
      </td>

      <!-- Send message -->
      <td>
        <a v-if="player.id != loggedUser?.id"
          class="hovertext hovertextC"
          data-hover="Send message"
          href="javascript:void();"
          @click="
            modalSendMessage = true;
            userClick = player;
          "
        >
          <i class="fa-solid fa-comment-dots fa-xl action_icon"></i
        ></a>
      </td>
      <!-- Invite to a game -->
      <td>
        <a v-if="props.isOffLine == false && player.id != loggedUser?.id"
          class="hovertext hovertextC"
          data-hover="Invite to game"
          href="javascript:void();"
          @click="
            modaleOpenInviteGame = true;
            userClick = player;
          "
        >
          <i class="fa-solid fa-gamepad fa-xl action_icon"></i>
        </a>
      </td>
      <!-- Add friend -->
      <td v-if="!isFriend(player)">
        <a v-if="player.id != loggedUser?.id"
          class="hovertext hovertextL"
          data-hover="Add friend"
          href="javascript:void();"
          @click="
            socketChat?.emit('updateFriends', {
              id: loggedUser?.id,
                  updateDTO: { addFriends: [{ id: player.id }] },
            })
          "
        >
          <i class="fa-solid fa-user-plus action_icon"></i
        ></a>
      </td>
      <!-- Remove friend -->
      <td v-else>
        <a v-if="player.id != loggedUser?.id"
          class="hovertext hovertextL"
          data-hover="Remove friend"
          href="javascript:void();"
          @click="
            socketChat?.emit('updateFriends', {
              id: loggedUser?.id,
              updateDTO: { removeFriends: [{ id: player.id }] },
            })
          "
        >
          <i class="fa-solid fa-user-minus action_icon"></i
        ></a>
      </td>
    </tr>
  </table>
</template>

<style scoped>
.hovertext {
  position: relative;
  border-bottom: 1px dotted black;
}

.hovertext:before {
  content: attr(data-hover);
  visibility: hidden;
  opacity: 0;
  width: 140px;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 5px;
  padding: 5px 0;
  transition: opacity 1s ease-in-out;

  position: absolute;
  z-index: 1;
  left: 0;
  top: 110%;
}

.hovertext:hover:before {
  opacity: 1;
  visibility: visible;
}
.hovertextL:before {
  left: -120px;
}
.hovertextC:before {
  left: -60px;
}

p {
  margin-left: auto;
  margin-right: auto;
  width: 6em;
}

th {
  white-space: nowrap;
  width: 40%;
}

.action_icon {
  color: var(--sidebar-icon-color);
}

.action_icon:hover {
  transform: scale(1.5);
  transition: 0.4s;
  cursor: pointer;
}

th {
  padding: 5px;
}
</style>
