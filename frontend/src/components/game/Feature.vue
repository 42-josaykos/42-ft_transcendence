<script>
export default {
  name: "Feature",
  data() {
    return {
      //	Each feature is measurable thanks to is level. It then has a minimum and a maximum level it can reach.
      level: {},
      min: {},
      max: {},
    };
  },
  props: ["name", "levelMin", "levelMax", "startLevel"], //	Props are read-only!
  computed: {
    //	Interesting in order to have cached data and for complex logic that includes reactive data.
    getLevel: function () {
      this.level = this.startLevel;
      return this.level;
    },
  },
  beforeCreate() {}, //	Runs at the component's initialization: data has not been made reactive and
  //	events have not been set up yet.
  created() {
    //	Runs before the templates and the Virtual DOM have been mounted or rendered: you're able to access
    //	reactive data and events that are active.
    this.$emit("levelChange", this.startLevel); //	and events that are active.
    return;
  },
  beforeMount() {}, //	Runs right before the initial render and after the template/render functions have been compiled.
  mounted() {
    //	You have full access to the reactive component, templates, and rendered DOM (via this.$el).
    //	You can use it to modify the DOM, particularly when integrating non-Vue libraries.
    let l = this.getLevel;
  },
  beforeUpdate() {}, //	This hook runs after data changes on your component and the update cycle begins, right before
  //	the DOM is patched and re-rendered. You can use it if you need to get the new state of any
  //	reactive data on your component before it gets rendered.
  updated() {}, //	This hook runs after data changes on your component and the DOM re-renders.
  //	You can use it if you need to access the DOM after a property change.
  beforeUnmount() {},
  unmounted() {},
  destroyed() {},
  methods: {
    isMin: function () {
      return this.level == this.levelMin ? true : false;
    },
    isMax: function () {
      return this.level == this.levelMax ? true : false;
    },
    levelUp: function () {
      if (this.level < this.levelMax) this.level++;
      this.$emit("levelChange", this.level);
      return;
    },
    levelDown: function () {
      if (this.level > this.levelMin) this.level--;
      this.$emit("levelChange", this.level);
      return;
    },
  },
};
</script>

<template>
  <section class="feature">
    <h3 class="feature-name">{{ name }} : {{ level }}</h3>
    <section class="feature-buttons d-flex">
      <button
        class="mod-btn mod-btn-cyan"
        v-on:click="levelDown"
        :disabled="isMin == true"
      >
        <i class="fa-solid fa-minus mt-2"></i>
      </button>
      <input
        class="level-bar"
        type="range"
        v-model="level"
        :min="levelMin"
        :max="levelMax"
      />
      <button
        class="mod-btn mod-btn-cyan"
        v-on:click="levelUp"
        :disabled="isMax == true"
      >
        <i class="fa-solid fa-plus mt-2"></i>
      </button>
    </section>
  </section>
</template>

<style>
.feature {
  /* margin-left: 0; */
  margin-top: 5%;
  margin-bottom: 5%;
}
.feature-name {
  color: #db810c;
  margin-bottom: 0;
  /* font-family: helvetica;
  font-size: 35px;
  font-style: normal;
  letter-spacing: 1px;
  position: relative; */
  /* width: 50%; */
  margin-left: auto;
  margin-right: auto;
  text-align: center;

  text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3), 0 0 0.45em currentColor;
}
.feature-buttons {
  position: relative;
  /* width: 50%; */
  /* margin-left: auto;
  margin-right: auto; */
  text-align: center;
  margin-top: 1.5%;
  align-items: center;
}
.up-and-down {
  /* display: inline-flexbox; */
  -webkit-appearance: none;
  width: 10%;
  background: #fffdc7;
  outline: none;
  border: 5px solid #fff961;
  /* border-radius: 10px;
		margin: 1.5%; */
  text-align: center;
  border-radius: 20px;
  align-items: center;

  display: inline-block;
  color: #1a3558;
  /* letter-spacing: 2px; */
  /* text-transform: uppercase; */
  text-decoration: none;
  /* font-size: 3em; */
  overflow: hidden;
  /* vertical-align: center; */
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
  box-shadow: 0px 0px 10px 2px #0202aa ;
}

.level-bar::-moz-range-thumb {

  -webkit-appearance: none !important;
  width: 20px;
  height: 20px;
  border: none !important;
  border-radius: 10px !important;
  background-color: #0202aa !important;
  box-shadow: 0px 0px 10px 2px #0202aa ;
}

.level-bar::-ms-thumb {
  -webkit-appearance: none !important;
  width: 20px;
  height: 20px;
  border: none !important;
  border-radius: 10px !important;
  background-color: #0202aa !important;
  box-shadow: 0px 0px 10px 2px #0202aa ;
}

</style>
