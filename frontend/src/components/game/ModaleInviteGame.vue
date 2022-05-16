<script>
import ModaleSettings from "./ModaleSettings.vue";
import Pong from "./Pong.vue";
import { storeToRefs, mapState, mapActions  } from 'pinia';
import { useUserStore } from "@/stores/user";

export default {
  name: "Game",
  components: {
    ModaleSettings,
  },
  data() {
    return {
      revelePlay: true,
      paddleSize: {},
      ballSpeed: {},
    };
  },
  emit: ["close"],
  created() {},
  methods: {
    ...mapActions(useUserStore, ['initUserClick']),
    updatePaddleSize: function (variable) {
      this.paddleSize = variable;
      this.$emit("paddleSizeChange", this.paddleSize);
    },
    updateBallSpeed: function (variable) {
      this.ballSpeed = variable;
      this.$emit("ballSpeedChange", this.ballSpeed);
    },
    close: function () {
      this.initUserClick();
      this.$emit("close");
    }
  },
};
</script>

<template>
  <ModaleSettings
    @close="close"
    @paddleSizeChange="updatePaddleSize"
    @ballSpeedChange="updateBallSpeed"
  />
</template>

<style>
</style>