<script setup lang="ts">
import UserCard from "./UserCard.vue";

const props = defineProps({
  user: Object,
  profile: Boolean,
});

const emit = defineEmits(["open"]);
const open = () => {
  emit("open");
};
</script>

<template>
  <button @click="open()" type="button"  v-bind:class="{ btnUserCard: !props.profile, btnUserCardProfile: props.profile }">
    <UserCard :user="props.user" :dashboard="false" :profile="props.profile"/>
  </button>
</template>

<style scoped>
.btnUserCard {
  background-color: transparent;
  color: #6c757d;
  box-shadow: 0px 0px 10px 2px var(--clr-neon);
  position: relative;
  border-radius: 10px;
  border: none;
  transition: 0.4s;
  margin: 5px 15px 5px;
}

.btnUserCard:hover {
  transform: scale(1.1);
  box-shadow: 0px 0px 10px var(--clr-neon), 0px 0px 15px 5px var(--clr-neon);
}

.btnUserCardProfile {
  background-color: transparent;
  color: #6c757d;
  position: relative;
  border-radius: 10px;
  border: none;
  transition: 0.4s;
  margin: 5px 15px 5px;
}

.btnUserCardProfile:hover {
  transform: scale(1.3);
}
</style>
