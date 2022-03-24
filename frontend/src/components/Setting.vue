<script setup lang="ts">

import  { isMeteor }  from "../App.vue"

</script>

<template>
	<h2>
		Settings
	</h2>
	<span>
		Meteor:
	<label class="switch" >
		<input type="checkbox" @click="isMeteor = !isMeteor">
		<span class="slider round">
			<div class="switchOFF" v-if="isMeteor">on</div>
			<div v-else class="switchON">off</div>
		</span>
	</label>
	</span>
</template>

<style>

.switchON{
	font-size: 2vh;
	transform: translateX(1vh);
}
.switchOFF{
	font-size: 2vh;
	transform: translateX(-1vh);
}
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 6vh;
  height: 3vh;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;

  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 2vh;
  width: 2vh;
  left: 0.4vh;
  bottom: 0.5vh;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #1d508f;
}

input:focus + .slider {
  box-shadow: 0 0 1px #1d508f;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(3.2vh);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
