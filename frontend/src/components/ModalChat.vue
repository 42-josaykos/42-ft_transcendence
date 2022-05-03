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
      <div @click="close()" type="button" class="btn-close-modale btn"><i class="fa-solid fa-xmark fa-2x" ></i></div>
      <slot name="header"></slot>
      <div class="modal-body">
        <slot name="body"></slot>
      </div>
      <slot name="footer"></slot>
    </div>
  </div>

</template>

<style>
.my-modal-header {
  display: flex;
  padding: 1rem;
}

[type=button], [type=reset], [type=submit], button {
-webkit-appearance: none !important;
}

</style>

