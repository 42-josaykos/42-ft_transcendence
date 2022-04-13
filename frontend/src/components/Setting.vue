<script setup lang="ts">

import  { isMeteor }  from "../App.vue"
import { setting_open } from "./Modale.vue"
import Toggle from '@vueform/toggle'

</script>

<template>
	<div class="btn-close-modale btn"  @click="setting_open = false"><i class="fa-solid fa-xmark fa-2x"></i></div>
  <h2 style="margin: 0px 40px 20px;"><b>Settings</b></h2>
	<span class="element-set">
		Meteor:
    <Toggle
      v-model="isMeteor"
      on-label="On"
      off-label="Off"
      class="toggle-style"
    />
	</span>
</template>

<style src="@vueform/toggle/themes/default.css"></style>
<style>

.toggle-style{

  --toggle-bg-on: var(--sidebar-icon-color);
  --toggle-border-on: var(--sidebar-icon-color);
  --toggle-ring-width: 0;
}

.element-set{
  margin-bottom: 10px;
  font-size: large;
}
</style>
