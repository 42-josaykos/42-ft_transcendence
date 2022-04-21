<script>
	let id = 0

	import Feature from './Feature.vue'

	export default {
		components: {
			Feature
		},

		data() {
			return {
				features: [
					{ id: id++, featureName: 'paddle size' },
					{ id: id++, featureName: 'ball speed' },
					{ id: id++, featureName: 'number of balls' },
				]
			}
		},
	}
	
</script>

<template>
	<section class="Powerups">
		<header>
			<ul class=PowerUps_List>
				<li v-for="feature in features" :key="feature.id">
					<Feature :name="feature.featureName" />
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