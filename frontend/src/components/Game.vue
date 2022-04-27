<script>
import ModaleSettings from './ModaleSettings.vue'
import Pong from './Pong.vue'
export default {
	name: 'Game',
	components: {
		'modalesettings': ModaleSettings,
		'pong': Pong,
	},
	data() {
		return {
			revelePlay: false,
			paddleSize: {},
			ballSpeed: {},
		}
	},
	created() {
	},
	methods: {
		toggleModaleSettings: function(){
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
<section class="game">
	<h2>Game</h2>
		<section class=pong-game>
			<modalesettings class="modale-settings" v-bind:revelePlay="revelePlay" v-bind:toggleModaleSettings="toggleModaleSettings" @paddleSizeChange="updatePaddleSize" @ballSpeedChange="updateBallSpeed" />
			<pong v-bind:revelePlay="revelePlay" v-bind:paddleSize="paddleSize" v-bind:ballSpeed="ballSpeed" />
		</section>
</section>
</template>

<style>
</style>
