<script>
let id = 0;
import Feature from './Feature.vue'
export default {
	name: 'PowerUps',
	components: {
		'feature': Feature,
	},
	data() {
		return {
			//	paddleSize and ballSpeed are only declared as they depend on the value emitted by the component 'Feature'.
			paddleSize: {},
			ballSpeed: {},
			features: [
				{ id: id++, featureName: 'paddle size', min: 1, max: 3, updateFunc: this.updatePaddleSize},
				{ id: id++, featureName: 'ball speed', min: 1, max: 5, updateFunc: this.updateBallSpeed },
			],
		}
	},
	methods: {
		updatePaddleSize: function(variable) {
			this.paddleSize = variable; 
			this.$emit('paddleSizeChange', this.paddleSize);
			return ;
		},
		updateBallSpeed: function(variable) {
			this.ballSpeed = variable;
			this.$emit('ballSpeedChange', this.ballSpeed);
			return ;
		},
	},
}
</script>

<template>
<section class="powerups">
	<header>
		<ul class=powerups-list>
			<li v-for="feature in features" :key="feature.id">
				<feature :name="feature.featureName" :levelMin="feature.min" :levelMax="feature.max" 
				:startLevel="(feature.max + 1)/2" @levelChange="feature.updateFunc" />
			</li>
		</ul>
	</header>
</section>
</template>

<style>
.powerups-list {
	padding: 10px;
	margin: 0;
		list-style-type: none;
}
</style>