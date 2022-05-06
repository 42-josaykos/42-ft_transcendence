<script>
import ModaleSettings from "./ModaleSettings.vue";
import Pong from "./Pong.vue";
export default {
  name: "Game",
  components: {
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
  methods: {
    toggleModaleSettings: function () {
      if (this.revelePlay == true) this.revelePlay = !this.revelePlay;
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
  <!-- <section class="game">
    <h2>Game</h2>
    <section class="pong-game">
      <modalesettings
        class="modale-settings"
        v-bind:revelePlay="revelePlay"
        v-bind:toggleModaleSettings="toggleModaleSettings"
        @paddleSizeChange="updatePaddleSize"
        @ballSpeedChange="updateBallSpeed"
      />
      <pong
        v-bind:revelePlay="revelePlay"
        v-bind:paddleSize="2"
        v-bind:ballSpeed="3"
      />
    </section>
  </section> -->

  <div class="container-fluid">
    <div class="game">
      <pong
        v-bind:revelePlay="revelePlay"
        v-bind:paddleSize="2"
        v-bind:ballSpeed="3"
      />
    </div>
  </div>
  <modalesettings v-if="revelePlay"
    v-bind:revelePlay="revelePlay"
    v-bind:toggleModaleSettings="toggleModaleSettings"
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
