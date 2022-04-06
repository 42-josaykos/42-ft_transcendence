<script setup lang="ts">

  const props = defineProps({
      user: Object
  })

</script>

<template>    
  <div class="">
    <div class="row no-gutters">
      <div class="col-md-4 cercle-user-card">
        <img v-bind:src=props.user?.avatar alt="Avatar" class="card-img">
      </div>
      <div class="col-md-8 infos">
      <div>
        <div class="info" >
          {{props.user?.username}}
        </div>
        <div class="info">
          <small class="text-muted">Online/Offline</small>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>

  .infos {
    display: flex;
    align-items: center;
    padding-left: 10px !important;
  }

  .info {
    text-align: left;
  }

  .cercle-user-card{
    border-radius: 50%;
    padding: 5px;
  }

  .cercle-user-card img{
    border-radius: 50%;
    border: var(--clr-neon) 3px solid;
    background-color: transparent;
    box-shadow: inset 0 0 0.5em 0 var(--clr-neon), 0 0 0.5em 0 var(--clr-neon);
  }

</style>