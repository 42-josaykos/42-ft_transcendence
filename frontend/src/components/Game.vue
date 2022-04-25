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
				revelePlay: false,
				paddleSize: {},
				ballSpeed: {},
			}
		},
		components: {
			'powerups': PowerUps,
			'modale-settings': ModaleSettings,
			'pong': Pong,
			'modale-play': ModalePlay,
		},
		created() {
		},
		methods: {
			toggleModaleSettings_2: function(){
				this.reveleSettings = !this.reveleSettings;
				return ;
			},
			toggleModaleSettings_1: function(){
				if (this.revelePlay == false)
					this.revelePlay = !this.revelePlay;
				return ;
			},
			updatePaddleSize: function(variable) {
				this.paddleSize = variable;
				this.$emit('paddleSizeChange', this.paddleSize);
			},
            updateBallSpeed: function(variable) {
				this.ballSpeed = variable; 
				this.$emit('ballSpeedChange', this.ballSpeed);
			},
		},
	}
</script>

<template>
	<div class="Game">
		<h2>Game</h2>
			<div class=PongGame>
				<modale-settings class="ModaleSettings" v-bind:revelePlay="revelePlay" v-bind:toggleModaleSettings_1="toggleModaleSettings_1" @paddleSizeChange="updatePaddleSize" @ballSpeedChange="updateBallSpeed"></modale-settings>
				<pong v-bind:revelePlay="revelePlay" v-bind:paddleSize="paddleSize" v-bind:ballSpeed="ballSpeed"></pong>
			</div>
	</div>
</template>

<style>
</style>
