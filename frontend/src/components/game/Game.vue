<!-- <script>
import ModaleSettings from "./ModaleSettings.vue";
import Pong from "./Pong.vue";
import { storeToRefs, mapState } from 'pinia';
import { useUserStore } from "@/stores/user";

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
  computed: {
    ...mapState(useUserStore, ["loggedUser", "userClick"]),
  },
  methods: {
    toggleModaleSettings: function () {
      if (this.revelePlay == true) {
        this.revelePlay = !this.revelePlay
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
</script> -->

<script setup lang="ts">
import ModaleSettings from "./ModaleSettings.vue";
import Pong from "./Pong.vue";
import { storeToRefs, mapState } from 'pinia';
import { ref } from "vue";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const { userClick } = storeToRefs(userStore);

  let revelePlay = ref<boolean>(true);
  let paddleSize =  ref<any>();
  let ballSpeed = ref<any>();

  const toggleModaleSettings = () => {
            console.log("1 toggle")
      if (revelePlay.value == true) {
        console.log("2 toggle")
        revelePlay.value = !revelePlay.value
      };
      return;
  }

  const updatePaddleSize = (variable) => {
      paddleSize.value = variable;
      $emit("paddleSizeChange", paddleSize.value);
  }

  const updateBallSpeed = (variable) => {
      ballSpeed.value = variable;
      $emit("ballSpeedChange", ballSpeed.value);
  }

</script>

<template>{{userClick}}
  <div class="container-fluid">
    <div class="game">
      <pong
        v-bind:revelePlay="revelePlay"
        v-bind:paddleSize="2"
        v-bind:ballSpeed="3"
      />
    </div>
  </div>
  <ModaleSettings v-if="revelePlay"
    @close="toggleModaleSettings"
    :revelePlay="revelePlay"
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
