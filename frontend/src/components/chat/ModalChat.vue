<script setup lang="ts">

const emit = defineEmits(['close'])
const close = () => {
    emit('close');
}

</script>


<template>

  <div class="bloc_modale" >
    <div class="overlay"></div>
    <div class="modale card">
      <div @click="close()" type="button" class="btn-close-modale btn me-3 mt-2"><i class="fa-solid fa-xmark fa-2x" ></i></div>
      <slot name="header"></slot>
      <div class="modal-body">
        <slot name="body"></slot>
      </div>
      <slot name="footer"></slot>
    </div>
  </div>

</template>

<style>

[type=button], [type=reset], [type=submit], button {
-webkit-appearance: none !important;
}

</style>

