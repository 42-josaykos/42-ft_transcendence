<script setup lang="ts">
//import type { User } from '@/models/user.model';

const props = defineProps({
    user: Object
})
</script>

<template>
    <div>
        <h2>COUCOU</h2>
        <p>{{props.user}}</p>

        
<div class="card mb-3" style="max-width: 540px;">
  <div class="row no-gutters">
    <div class="col-md-4">
      <img src="..." class="card-img" alt="...">
    </div>
    <div class="col-md-8">
      <div class="card-body">
        <h5 class="card-title">Card title</h5>
        <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
        <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
      </div>
    </div>
  </div>
</div>


    </div>
</template>

<style>

</style>