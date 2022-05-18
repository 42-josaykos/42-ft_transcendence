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

const decrementPaddleSize = () => {
  // console.log("decrementPaddleSize");
  emit("decrementPaddleSize");
};
const incrementPaddleSize = () => {
  // console.log("incrementPaddleSize");
  emit("incrementPaddleSize");
};
const decrementBallSpeed = () => {
  // console.log("decrementBallSpeed");
  emit("decrementBallSpeed");
};
const incrementBallSpeed = () => {
  // console.log("incrementBallSpeed");
  emit("incrementBallSpeed");
};

let id = 0;
const features = [
  {
    id: id++,
    featureName: "Paddle size",
    min: 1,
    max: 10,
    feature: "paddle",
  },
  {
    id: id++,
    featureName: "Ball speed",
    min: 1,
    max: 10,
    feature: "ball",
  },
];
</script>

<template>
  <div class="d-flex">
    <section class="powerups">
      <header>
        <ul class="powerups-list">
          <li v-for="feature in features" :key="feature.id">
            <Feature
              :name="feature.featureName"
              :levelMin="feature.min"
              :levelMax="feature.max"
              :startLevel="feature.max / 2"
              :feature="feature.feature"
              @decrementPaddleSize="decrementPaddleSize"
              @incrementPaddleSize="incrementPaddleSize"
              @decrementBallSpeed="decrementBallSpeed"
              @incrementBallSpeed="incrementBallSpeed"
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
