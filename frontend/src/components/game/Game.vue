<script>
import ModaleSettings from "./ModaleSettings.vue";
import Pong from "./Pong.vue";
import { storeToRefs, mapState, mapActions  } from 'pinia';
import { useUserStore } from "@/stores/user";
import Navbar from '@/components/Navbar.vue'

export default {
  name: "Game",
  components: {
    Navbar,
    modalesettings: ModaleSettings,
    pong: Pong,
  },
  data() {
    return {
      revelePlay: true,
      paddleSize: {},
      ballSpeed: {},
    };
  },
  created() {},
  computed: {
    ...mapState(useUserStore, ["loggedUser", "isAuthenticated", "userClick"]),
  },
  methods: {
    ...mapActions(useUserStore, ['initUserClick']),
    toggleModaleSettings: function () {
      if (this.revelePlay == true) {
        this.revelePlay = !this.revelePlay
        this.initUserClick()
      };
      return;
    },
    updatePaddleSize: function (variable) {
      this.paddleSize = variable;
      this.$emit("paddleSizeChange", this.paddleSize);
    },
    updateBallSpeed: function (variable) {
      this.ballSpeed = variable;
      this.$emit("ballSpeedChange", this.ballSpeed);
    },
  },
};
</script>

<template>
  <Navbar :isAuthenticated="isAuthenticated" />
  <div class="container-fluid">
    <div class="game">
      <pong
        v-bind:revelePlay="revelePlay"
        v-bind:paddleSize="2"
        v-bind:ballSpeed="3"
      />
    </div>
  </div>
  <modalesettings  v-if="revelePlay"
    @close="toggleModaleSettings"
    @paddleSizeChange="updatePaddleSize"
    @ballSpeedChange="updateBallSpeed"
  />
</template>

<style>
.game {
  padding: 1% !important;
  padding-top: 5% !important;
  padding-bottom: 5% !important;
  --bs-gutter-x: 1.5rem;
  --bs-gutter-y: 0;
  flex-wrap: wrap;
}
</style>