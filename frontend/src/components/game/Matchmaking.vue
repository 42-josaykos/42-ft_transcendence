<script>
import Pong from "./Pong.vue";
export default {
  name: "Matchmaking",
  components: {
    pong: Pong,
  },
  data() {
    return {
      revelePlay: true,
      paddleSize: 2,
      ballSpeed: 3,
    };
  },
  created() {},
  methods: {},
};
props: ["revelePlay", "toggleModaleSettings", "launch"]
</script>

<template>
  <section class="matchmaking">
    <h2>Matchmaking</h2>
    <section class="pong-game">
      <pong
        v-bind:revelePlay="revelePlay"
        v-bind:paddleSize="paddleSize"
        v-bind:ballSpeed="ballSpeed"
      />
    </section>
  </section>
</template>

<style></style>
