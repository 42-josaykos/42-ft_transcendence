<script setup lang="ts">
import UserCard from "./UserCard.vue";

  const props = defineProps({
      user: Object
  })

const emit = defineEmits(['open'])
const open = () => {
    emit('open');
}

</script>

<template>
  <button  @click="open()" type="button" class="btn-user-card">
    <UserCard :user="props.user"/>
  </button>
</template>

<style>

  .infos {
    display: flex;
    align-items: center;
    padding-left: 10px !important;
    padding-top: 4px;
  }

  .info {
    text-align: left;
  }

  .cercle-user-card{
    border-radius: 50% !important;
    padding: 5px;
  }

  .cercle-user-card img{
    border-radius: 50%;
    border: var(--clr-neon) 3px solid;
    background-color: transparent;
    box-shadow: inset 0 0 0.5em 0 var(--clr-neon), 0 0 0.5em 0 var(--clr-neon);
    object-fit: cover;
    width: 60px;
    height: 60px;
  }

  .online,
  .offline
  {
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