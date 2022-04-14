<script setup lang="ts">

  const props = defineProps({
      user: Object,
      isOnline: Boolean
  })

const emit = defineEmits(['open'])
const open = () => {
    emit('open');
}

</script>

<template>    

  <button  @click="open()" type="button" class="btn-user-card">
    <div class="row no-gutters">
      <div class="col-md-4 cercle-user-card">
        <img v-bind:src=props.user?.avatar alt="Avatar" class="card-img">
      </div>
      <div class="col-md-8 infos">
        <div class="text-truncate">
          <div class="info" >
            {{props.user?.username}}
          </div>
          <div class="info">
            <div class="status">
              <i class="fa fa-circle" :class="{'online': isOnline, 'offline': isOnline == false}"></i>
              <small class="text-muted">{{isOnline ? 'Online' : 'Offline'}}</small>
            </div>
          </div>
          </div>
      </div>
    </div>
  </button>
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

  .online,
  .offline
  {
    margin-right: 2px;
    font-size: 8px;
    vertical-align: middle
  }

  .online {
    color: #86c541
  }

  .offline {
    color: #e47297
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