<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { useGameStore } from "@/stores/game";

const userStore = useUserStore();
const { usersOnline } = storeToRefs(userStore);

const gameStore = useGameStore();
const { usersInQueue, usersInGame } = storeToRefs(gameStore);

const props = defineProps({
  user: Object,
  dashboard: Boolean,
  profile: Boolean,
});

const isOnlineBool = ref<boolean>(false);
const isInQueue = ref<boolean>(false);
const isInGame = ref<boolean>(false);

const isOnline = computed(() => {
  let status = "Offline";

  // Online status
  if (usersOnline.value.findIndex((el: Number) => el == props.user?.id) == -1) {
    isOnlineBool.value = false;
    status = "Offline";
  } else {
    isOnlineBool.value = true;
    status = "Online";
    // If in Queue
    if (userStore.valueInArray(props.user?.id, usersInQueue.value)) {
      isInQueue.value = true;
      status = "In Queue";
    } else isInQueue.value = false;
    // If in Game
    if (userStore.valueInArray(props.user?.id, usersInGame.value)) {
      isInGame.value = true;
      status = "In Game";
    } else isInGame.value = false;
  }

  return status;
});
</script>

<template>
  <div v-bind:class="{ row : !props.profile}" class="no-gutters d-flex">
    <div v-if="props.dashboard" v-bind:class="{ 'col-md-4': !props.profile}" class="cercle-user-card-dashboard">
      <img v-bind:src="props.user?.avatar" alt="Avatar" class="card-img" />
    </div>
    <div v-else v-bind:class="{ 'col-md-4': !props.profile}" class="cercle-user-card">
      <img v-bind:src="props.user?.avatar" alt="Avatar" class="card-img" />
    </div>
    <div class="infos" v-bind:class="{ infosChat: !props.dashboard, 'col-md-7': !props.profile }">
      <div class="text-truncate">
        <div
          class="info"
          v-bind:class="{'home_username' : props.profile && !props.dashboard}"
        >
          {{ props.user?.username }}
        </div>
        <div class="info">
          <div class="status d-flex">
            <div v-if="isOnlineBool == true">
              <i class="fa fa-circle online"></i>
            </div>
            <div v-else>
              <i class="fa fa-circle offline"></i>
            </div>
            <small class="text-muted ps-1">{{ isOnline }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

.home_username {
  font-size: xx-large;
  color: white;
  font-weight: bold;
}

.infos {
  display: flex;
  align-items: center;
  padding-left: 10px !important;
  padding-top: 4px;
}
.infosChat {
  margin-left: 10px;
}

.info {
  text-align: left;
}

.cercle-user-card {
  border-radius: 50% !important;
  padding: 5px;
}

.cercle-user-card img {
  border-radius: 50%;
  border: var(--clr-neon) 3px solid;
  background-color: transparent;
  box-shadow: inset 0 0 0.5em 0 var(--clr-neon), 0 0 0.5em 0 var(--clr-neon);
  object-fit: cover;
  width: 60px;
  height: 60px;
}

.cercle-user-card-dashboard {
  border-radius: 50% !important;
  padding: 5px;
}

.cercle-user-card-dashboard img {
  border-radius: 50%;
  border: var(--clr-neon) 3px solid;
  background-color: transparent;
  box-shadow: inset 0 0 0.5em 0 var(--clr-neon), 0 0 0.5em 0 var(--clr-neon);
  object-fit: cover;
  width: 40px;
  height: 40px;
}

.online,
.offline {
  margin-right: 2px;
  font-size: 8px;
  vertical-align: middle;
}

.online {
  color: #86c541;
}

.offline {
  color: #e47297;
}

.btn-user-card {
  background-color: transparent;
  color: #6c757d;
  box-shadow: 0px 0px 10px 2px var(--clr-neon);
  position: relative;
  border-radius: 10px;
  border: none;
  transition: 0.4s;
  margin: 5px 15px 5px;
}

.btn-user-card:hover {
  transform: scale(1.1);
  box-shadow: 0px 0px 10px var(--clr-neon), 0px 0px 15px 5px var(--clr-neon);
}
</style>
