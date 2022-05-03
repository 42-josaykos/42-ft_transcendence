<script>
import PowerUps from "./PowerUps.vue";
export default {
  name: "ModaleSettings",
  components: {
    powerups: PowerUps,
  },
  props: ["revelePlay", "toggleModaleSettings", "launch"],
  created() {
    this.$emit("paddleSizeChange", this.paddleSize);
    this.$emit("ballSpeedChange", this.ballSpeed);
    return;
  },
  methods: {
    updatePaddleSize: function (variable) {
      this.paddleSize = variable;
      this.$emit("paddleSizeChange", this.paddleSize);
      return;
    },
    updateBallSpeed: function (variable) {
      this.ballSpeed = variable;
      this.$emit("ballSpeedChange", this.ballSpeed);
      return;
    },
  },
};
</script>

<template>
  <section class="bloc-modale" v-if="!revelePlay">
    <section class="overlay"></section>
    <section class="modale card">
      <section class="modale-header">
        <section
          class="btn-modale btn btn-danger"
          v-on:click="toggleModaleSettings"
        >
          X
        </section>
        <h1>Choose your features...</h1>
      </section>
      <powerups
        class="powerups"
        @paddleSizeChange="updatePaddleSize"
        @ballSpeedChange="updateBallSpeed"
      />
    </section>
  </section>
  <!-- </section> -->
</template>

<style scoped>
.powerups {
  width: 100%;
}
.bloc-modale {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  /* width: 100%;
		height: 100%; pose pas pb noramelemnt vu qu'avec top, bottom etc on lui a deja dit de prendre toute la place */
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay {
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.modale {
  background: #f1f1f1;
  color: #333;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0px;
  position: fixed;
  top: 0%;
}

.card {
  padding: 0;
}

.btn-modale {
  position: absolute;
  top: 10px;
  right: 10px;
}

.modale-header {
  font-size: 10px;
  font-size-adjust: none;
}
</style>
