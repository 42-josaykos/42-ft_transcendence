<script>
	let id = 0

	import Feature from './Feature.vue'

	export default {
		components: {
			Feature
		},

		data() {
			return {
				paddleSize: {},
				ballSpeed: {},
				features: [
					{ id: id++, featureName: 'paddle size', min: 1, max: 3, updateFunc: this.updatePaddleSize},
					{ id: id++, featureName: 'ball speed', min: 1, max: 5, updateFunc: this.updateBallSpeed },
					// { id: id++, featureName: 'number of balls' },
				]
			}
		},
		methods: {
			updatePaddleSize: function(variable) {
				this.paddleSize = variable; 

				// console.log("Powerups updated, now emitting from Powerups (paddleSize) to parent Modale-Settings");
				// console.log("paddleSize : " + this.paddleSize);
				this.$emit('paddleSizeChange', this.paddleSize);
			},
			updateBallSpeed: function(variable) {
				this.ballSpeed = variable; 

				// console.log("Powerups updated, now emitting from Powerups (ballSpeed) to parent Modale-Settings");
				// console.log("ballSpeed : " + this.ballSpeed);
				this.$emit('ballSpeedChange', this.ballSpeed);
			}
		},
	}
	
</script>

<template>
	<section class="Powerups">
		<header>
			<ul class=PowerUps_List>
				<li v-for="feature in features" :key="feature.id">
					<Feature :name="feature.featureName" :levelMin="feature.min" :levelMax="feature.max" :startLevel="(feature.max + 1)/2" @levelChange="feature.updateFunc"/>

				</li>
				
			</ul>
	
		</header>
	</section>
</template>

<style>

.PowerUps_List {
	padding: 10px;
	margin: 0;
    list-style-type: none;
}

</style>