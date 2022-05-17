<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import Feature from "./Feature.vue";

// Stores
const userStore = useUserStore();
const { userClick } = storeToRefs(userStore);

const emit = defineEmits([
  "decrementPaddleSize",
  "incrementPaddleSize",
  "decrementBallSpeed",
  "incrementBallSpeed",
]);

const decrementPaddleSize: Function = () => {
  emit("decrementPaddleSize");
};
const incrementPaddleSize: Function = () => {
  emit("incrementPaddleSize");
};
const decrementBallSpeed: Function = () => {
  emit("decrementBallSpeed");
};
const incrementBallSpeed: Function = () => {
  emit("incrementBallSpeed");
};

let id = 0;
const features = [
  {
    id: id++,
    featureName: "Paddle size",
    min: 1,
    max: 3,
    decrement: decrementPaddleSize(),
    increment: incrementPaddleSize(),
  },
  {
    id: id++,
    featureName: "Ball speed",
    min: 1,
    max: 5,
    decrement: decrementBallSpeed(),
    increment: incrementBallSpeed(),
  },
];

// let id = 0;
// import Feature from "./Feature.vue";
// import { storeToRefs, mapState } from 'pinia';
// import { useUserStore } from "@/stores/user";
// export default {

//   name: "PowerUps",
//   components: {
//     feature: Feature,
//   },
//   data() {
//     return {
//       paddleSize: {},
//       ballSpeed: {},
//       features: [
//         {
//           id: id++,
//           featureName: "Paddle size",
//           min: 1,
//           max: 3,
//           updateFunc: this.updatePaddleSize,
//         },
//         {
//           id: id++,
//           featureName: "Ball speed",
//           min: 1,
//           max: 5,
//           updateFunc: this.updateBallSpeed,
//         },
//       ],
//     };
//   },
//   computed: {
//     ...mapState(useUserStore, ["loggedUser", "userClick"]),
//   },
//   methods: {
//     updatePaddleSize: function (variable) {
//       this.paddleSize = variable;
//       this.$emit("paddleSizeChange", this.paddleSize);
//       return;
//     },
//     updateBallSpeed: function (variable) {
//       this.ballSpeed = variable;
//       this.$emit("ballSpeedChange", this.ballSpeed);
//       return;
//     },
//   },
// };
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
              :decrement="feature.decrement"
              :increment="feature.increment"
            />
          </li>
        </ul>
      </header>
    </section>
    <section class="feature">
      <h3 class="feature-name">Playing opponent :</h3>
      <div style="padding-top: 20px">
        <div v-if="userClick != undefined">
          <img
            class="circular--square icon_navbar img-player"
            v-bind:src="userClick?.avatar"
            alt="Avatar"
          />
          <div class="userName neon-typo pt-2">
            <b>{{ userClick?.username }}</b>
          </div>
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
.img-player {
  object-fit: cover;
  width: 150px;
  height: 150px;
}
</style>
