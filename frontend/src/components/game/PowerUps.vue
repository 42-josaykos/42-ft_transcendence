<script>
let id = 0;
import Feature from "./Feature.vue";
import { storeToRefs, mapState } from 'pinia';
import { useUserStore } from "@/stores/user";
export default {

  name: "PowerUps",
  components: {
    feature: Feature,
  },
  data() {
    return {
      paddleSize: {},
      ballSpeed: {},
      features: [
        {
          id: id++,
          featureName: "Paddle size",
          min: 1,
          max: 3,
          updateFunc: this.updatePaddleSize,
        },
        {
          id: id++,
          featureName: "Ball speed",
          min: 1,
          max: 5,
          updateFunc: this.updateBallSpeed,
        },
      ],
    };
  },
  computed: {
    ...mapState(useUserStore, ["loggedUser", "userClick"]),
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
<div class="d-flex">
  <section class="powerups">
    <header>
      <ul class="powerups-list">
        <li v-for="feature in features" :key="feature.id">
          <feature
            :name="feature.featureName"
            :levelMin="feature.min"
            :levelMax="feature.max"
            :startLevel="(feature.max + 1) / 2"
            @levelChange="feature.updateFunc"
          />
        </li>
      </ul>
    </header>
  </section>
  <section class="feature">
    <h3 class="feature-name">Playing opponent :</h3>
		<div style="padding-top: 20px">
      <div v-if="userClick != undefined">
				<img class="circular--square icon_navbar" style="width: auto; max-width: 150px;" v-bind:src=userClick?.avatar alt="Avatar" />
				<div class="userName neon-typo"><b>{{ userClick?.username }}</b></div>
      </div>
      <div v-else class="wrapper-icon-random">
        <i class="fa-solid fa-question fa-10x"></i>
				<div class="userName neon-typo"><b>Random player</b></div>
      </div>
		</div>
  </section>
</div>
</template>

<style>
.powerups-list {
  padding: 10px;
  margin: 0;
  list-style-type: none;
}
.wrapper-icon-random {
  color: #b90000;
}
</style>
