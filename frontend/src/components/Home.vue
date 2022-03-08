<script setup lang="ts">
import Login from './Login.vue';
</script>

<template>
  <div class="containers-fluid">
    <div class="d-flex justify-content-center align-items-center pong">
      PONG 42
    </div>
    <div>
      <p>Expliquer l'appli Pong + image ??</p>
    </div>
    <div>
      <p>
        Match en cours sous forme de tableau ou de carte + boutons pour
        visualiser la partie
      </p>
    </div>
    <div>
      Login avec 42 API pour accèder aux autres pages
      <Login />
    </div>
  </div>
</template>

<style>
.pong {
  font-size: 100px;
  color: black;
  text-align: center;
}

p.pong {
  margin-left: auto;
  margin-right: auto;
  width: 6em;
}
</style>
