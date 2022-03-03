<script setup lang="ts">
</script>

<template>
  <div class="item">
    <i>
      <slot name="icon"></slot>
    </i>
    <h3 class="description">
      <slot name="heading"></slot>
    </h3>
  </div>
</template>

<style>
.item {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.25em;
}

.description {
  margin: 0 auto;
  padding-left: 2px;
  padding-right: 15px;
  color: black;
}
</style>