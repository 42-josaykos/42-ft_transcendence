<!-- <script>
import PowerUps from "./PowerUps.vue";
export default {
  name: "ModaleSettings",
  components: {
    powerups: PowerUps,
  },
  props: ["revelePlay", "toggleModaleSettings", "launch"],
  emit: ["close"],
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
</script> -->

<script setup lang="ts">
import PowerUps from "./PowerUps.vue";
import { onBeforeMount} from "vue";
import { storeToRefs, mapState } from 'pinia';
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const { userClick } = storeToRefs(userStore);

	defineProps < {
		revelePlay: any;
  	launch: any;
	} > ();

const emit = defineEmits(['close', 'test1', 'test2']);

const close = () => {
    emit('close');
}

// // const test1 = () => {
// //     emit("paddleSizeChange", paddleSize);
// // }

// // const test2 = () => {
// //     emit("ballSpeedChange", ballSpeed);
// }
  // props: ["revelePlay", "toggleModaleSettings", "launch"],
  // emit: ["close"],
  // onBeforeMount(() => {
  //   test1();
  //   test2();
  // }) 
    // $emit("paddleSizeChange", paddleSize);
    // $emit("ballSpeedChange", ballSpeed);
    // return;

  

  const updatePaddleSize = (variable) => {
      paddleSize = variable;
      test1()
      return;
    }

  const updateBallSpeed = (variable) => {
      ballSpeed = variable;
      test2()
      return;
    }


</script>

<template>
  <div class="bloc_modale">
    <div class="overlay"></div>
    <div class="modale card">
       <div
        @click="close(); userClick = undefined; "
        type="button"
        class="btn-close-modale btn"
      >
        <i class="fa-solid fa-xmark fa-2x"></i>
      </div>
      <h2 style="padding-top: 10px">
        <u style="text-shadow: 0 0 0.125em hsl(0 0% 100% / 0.3), 0 0 0.45em currentColor;">Start a game</u>
      </h2>
      <powerups
        @paddleSizeChange="updatePaddleSize"
        @ballSpeedChange="updateBallSpeed"
      />
      <button
        @click=""
        type="button"
        class="mod-btn mod-btn-blue"
      >
        START
      </button>
    </div> 
  </div>
</template>

<style>
</style>
