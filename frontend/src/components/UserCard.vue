<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const { usersOnline } = storeToRefs(userStore);

  const props = defineProps({
      user: Object
  })

const emit = defineEmits(['open'])
const open = () => {
    emit('open');
}
const isOnlineBool = ref<boolean>(false)

const isOnline = computed(() => {
  if (usersOnline.value.findIndex((el: Number) => el == props.user?.id) == -1) {
    isOnlineBool.value = false
    return 'Offline';
  }
  isOnlineBool.value = true
  return 'Online';
});

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
            <div class="status d-flex">
              <div  v-if="isOnlineBool == true" >
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