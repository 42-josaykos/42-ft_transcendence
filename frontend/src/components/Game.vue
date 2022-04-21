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
				// reveleSettings: false,
				revelePlay: false,
				paddleSize: 0, // pas sure de mettre 0, faut voir une valeur par défaut mais la même que dans la barre
				ballSpeed: 0,
			}
		},
		components: {
			'powerups': PowerUps,
			'modale-settings': ModaleSettings,
			'pong': Pong,
			'modale-play': ModalePlay,
		},
		methods: {
			toggleModaleSettings_2: function(){
				// console.log("here: " + this.reveleSettings);
				this.reveleSettings = !this.reveleSettings;
				// console.log(" became: " + this.reveleSettings);
				return ;
			},
			toggleModaleSettings_1: function(){
				// console.log("this.revelePlay in Game.vue : " + this.revelePlay);
				if (this.revelePlay == false)
					this.revelePlay = !this.revelePlay;
				// console.log("THEN this.revelePlay in Game.vue : " + this.revelePlay);
				return ;
			},
			updatePaddleSize: function(variable) {
				this.paddleSize = variable;
				
                // console.log("Game updated");
                // console.log("paddleSize : " + this.paddleSize);
				this.$emit('paddleSizeChange', this.paddleSize);
			},
            updateBallSpeed: function(variable) {
				this.ballSpeed = variable; 

				// console.log("Game updated");
				// console.log("ballSpeed : " + this.ballSpeed);
				this.$emit('ballSpeedChange', this.ballSpeed);
			},
			// toggleModalePlay: function(){
			// 	console.log("this.revelePlay in Game.vue : " + this.revelePlay);
			// 	if (this.revelePlay == false)
			// 		this.revelePlay = !this.revelePlay;
			// 	console.log("THEN this.revelePlay in Game.vue : " + this.revelePlay);
			// 	return ;
			// },
		},
	}
</script>

<template>
	<div class="Game">
		<h2>Game</h2>
			<!-- <div>
				<modale-settings class="ModaleSettings" v-bind:reveleSettings="reveleSettings" v-bind:toggleModaleSettings="toggleModaleSettings">X</modale-settings>
				<div v-on:click="toggleModaleSettings" class="btn btn-success">OUVRE LA MODALE YOLO LA VIE</div>
			</div> -->
			<div class=PongGame>
				<modale-settings class="ModaleSettings" v-bind:revelePlay="revelePlay" v-bind:toggleModaleSettings_1="toggleModaleSettings_1" @paddleSizeChange="updatePaddleSize" @ballSpeedChange="updateBallSpeed"></modale-settings>
				<pong v-bind:revelePlay="revelePlay" v-bind:paddleSize="paddleSize" v-bind:ballSpeed="ballSpeed"></pong>
			</div>
			<!-- <div class=PongGame>
				<modale-play class="ModalePlay" v-bind:revelePlay="revelePlay" v-bind:toggleModalePlay="toggleModalePlay"></modale-play>
				<pong v-bind:revelePlay="revelePlay"></pong>
			</div> -->
	</div>
</template>

<style>
/* .MenuButtons{

} */
</style>
