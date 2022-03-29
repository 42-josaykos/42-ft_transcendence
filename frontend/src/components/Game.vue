<!-- <script setup lang="ts"></script> -->

<script>
	import PowerUps from './PowerUps.vue'
	import ModaleSettings from './ModaleSettings.vue'
	import Pong from './Pong.vue'
	import ModalePlay from './ModalePlay.vue'

	export default {
		name: 'Contenu',
		data() {
			return {
				reveleSettings: false,
				revelePlay: true,
			}
		},
		components: {
			'powerups': PowerUps,
			'modale-settings': ModaleSettings,
			'pong': Pong,
			'modale-play': ModalePlay,
		},
		methods: {
			toggleModaleSettings: function(){
				console.log("here: " + this.reveleSettings);
				this.reveleSettings = !this.reveleSettings;
				console.log(" became: " + this.reveleSettings);
			},
			toggleModalePlay: function(){
				if (this.revelePlay == true)
					this.revelePlay = !this.revelePlay;
			},
		},
	}
</script>

<template>
	<div class="Game">
		<h2>Game</h2>
			<div>
				<modale-settings class="ModaleSettings" v-bind:reveleSettings="reveleSettings" v-bind:toggleModaleSettings="toggleModaleSettings">X</modale-settings>
				<div v-on:click="toggleModaleSettings" class="btn btn-success">OUVRE LA MODALE YOLO LA VIE</div>
			</div>
			<div class=PongGame>
				<modale-play class="ModalePlay" v-bind:revelePlay="revelePlay" v-bind:toggleModalePlay="toggleModalePlay"></modale-play>
				<pong v-bind:revelePlay="revelePlay"></pong>
				<!-- <pong></pong> -->
			</div>
	</div>
</template>

<style>
/* .MenuButtons{

} */
</style>
