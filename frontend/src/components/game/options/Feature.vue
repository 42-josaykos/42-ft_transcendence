<script setup lang="ts">
// Props
const props = defineProps({
  name: String,
  levelMin: Number,
  levelMax: Number,
  startNumber: Number,
  increment: Function,
  decrement: Function,
});

let level: number = props.startNumber;

// Determine
const isMin = () => {
  return level === props.levelMin ? true : false;
};

const isMax = () => {
  return level === props.levelMax ? true : false;
};

const levelUp = () => {
  if (props.levelMax && level < props.levelMax) {
    ++level;
    props.increment;
  }
};

const levelDown = () => {
  if (props.levelMin && level > props.levelMin) {
    --level;
    props.decrement;
  }
};
</script>

<template>
  <section class="feature">
    <h3 class="feature-name">{{ props.name }} : {{ level }}</h3>
    <section class="feature-buttons d-flex">
      <button
        class="mod-btn mod-btn-cyan"
        v-on:click="levelDown"
        :disabled="isMin() == true"
      >
        <i class="fa-solid fa-minus mt-2"></i>
      </button>
      <input
        class="level-bar"
        type="range"
        v-model="level"
        :min="props.levelMin"
        :max="props.levelMax"
      />
      <button
        class="mod-btn mod-btn-cyan"
        v-on:click="levelUp"
        :disabled="isMax() == true"
      >
        <i class="fa-solid fa-plus mt-2"></i>
      </button>
    </section>
  </section>
</template>

<style>
.feature {
  margin-top: 5%;
  margin-bottom: 5%;
}
.feature-name {
  color: #db810c;
  margin-bottom: 0;
  margin-left: auto;
  margin-right: auto;
  text-align: center;

  text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3), 0 0 0.45em currentColor;
}
.feature-buttons {
  position: relative;
  text-align: center;
  margin-top: 1.5%;
  align-items: center;
}
.up-and-down {
  -webkit-appearance: none;
  width: 10%;
  background: #fffdc7;
  outline: none;
  border: 5px solid #fff961;
  text-align: center;
  border-radius: 20px;
  align-items: center;

  display: inline-block;
  color: #1a3558;
  text-decoration: none;
  overflow: hidden;
}
.up-and-down:hover {
  background: #fff961;
  box-shadow: 0 0 50px #fff961;
}
.level-bar {
  -webkit-appearance: none;
  width: 300px;
  height: 15px;
  background: transparent;
  outline: none;
  border: 3px solid cyan;
  border-radius: 10px;
  text-align: center;
}

.level-bar::-webkit-slider-thumb {
  -webkit-appearance: none !important;
  width: 20px;
  height: 20px;
  border: none !important;
  border-radius: 10px !important;
  background-color: #0202aa !important;
  box-shadow: 0px 0px 10px 2px #0202aa;
}

.level-bar::-moz-range-thumb {
  -webkit-appearance: none !important;
  width: 20px;
  height: 20px;
  border: none !important;
  border-radius: 10px !important;
  background-color: #0202aa !important;
  box-shadow: 0px 0px 10px 2px #0202aa;
}

.level-bar::-ms-thumb {
  -webkit-appearance: none !important;
  width: 20px;
  height: 20px;
  border: none !important;
  border-radius: 10px !important;
  background-color: #0202aa !important;
  box-shadow: 0px 0px 10px 2px #0202aa;
}
</style>
