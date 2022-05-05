<script>
import ModaleNotif1 from './ModaleNotif.vue';
import ModaleNotif from "./ModaleNotif.vue";
import ModaleSettings from './ModaleSettings.vue';
export default {
  name: "Notification",
  components: {
    modalenotif: ModaleNotif,
  },
  data() {
    return {
      notifBool: false,
      firstTime: true,
    };
  },
  methods: {
    turnOnModaleNotif: function () {
      if (this.notifBool == true)
        this.firstTime = false; 
      this.notifBool = true;
      console.log(this.notifBool);
      return ;
    },
    turnOffModaleNotif: function () {
      this.notifBool = false;
      console.log(this.notifBool);
      return ;
    },
  },
};
</script>

<template>
  <div>
      <!-- <button @click="match">Start a new match!</button> -->
      <button @click="turnOnModaleNotif">Start a new match!(testing modale)</button>
      <!-- <button>Start a new match!</button> -->
      <!-- <ModaleNotif/> -->
      <modalenotif
        v-bind:notifBool="notifBool"
        v-bind:firstTime="firstTime"
        v-bind:turnOffModaleNotif="turnOffModaleNotif"
        ></modalenotif>
        
</div>
</template>