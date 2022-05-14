<script setup lang="ts">
import UserCard from "./UserCard.vue";

const props = defineProps({
  user: Object,
});

const emit = defineEmits(["open"]);
const open = () => {
  emit("open");
};
</script>

<template>
  <button @click="open()" type="button" class="btn-user-card">
    <UserCard :user="props.user" :dashboard="false" />
  </button>
</template>

<style scoped>
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
