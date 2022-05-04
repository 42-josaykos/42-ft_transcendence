<script>
export default {
	name: 'Feature',
	data() {
		return {	//	Each feature is measurable thanks to is level. It then has a minimum and a maximum level it can reach.
			level: {},
			min: {},
			max: {},
		}
	},
	props: ['name', 'levelMin', 'levelMax', 'startLevel'],	//	Props are read-only!
	computed: {	//	Interesting in order to have cached data and for complex logic that includes reactive data.
		getLevel: function() {
			this.level = this.startLevel;
			return (this.level);
		},
	},
	beforeCreate() {},	//	Runs at the component's initialization: data has not been made reactive and
											//	events have not been set up yet.
	created() { //	Runs before the templates and the Virtual DOM have been mounted or rendered: you're able to access
							//	reactive data and events that are active.
		this.$emit('levelChange', this.startLevel); //	and events that are active.
		return ;
	},  
	beforeMount() {},	//	Runs right before the initial render and after the template/render functions have been compiled.
	mounted() {	//	You have full access to the reactive component, templates, and rendered DOM (via this.$el).
							//	You can use it to modify the DOM, particularly when integrating non-Vue libraries.
		let l = this.getLevel;
	},
	beforeUpdate() {},	//	This hook runs after data changes on your component and the update cycle begins, right before
											//	the DOM is patched and re-rendered. You can use it if you need to get the new state of any
											//	reactive data on your component before it gets rendered.
	updated() {},	//	This hook runs after data changes on your component and the DOM re-renders. 
								//	You can use it if you need to access the DOM after a property change.
	beforeUnmount() {}, 
	unmounted() {},
	destroyed() {},
	methods: {
		isMin: function() {
			return ((this.level == this.levelMin)? true : false);
		},
		isMax: function() {
			return ((this.level == this.levelMax)? true : false);
		},
		levelUp: function() {
			if (this.level < this.levelMax) 
					this.level++;
			this.$emit('levelChange', this.level);
			return ;
		},
		levelDown: function() {
			if (this.level > this.levelMin)
				this.level--;
			this.$emit('levelChange', this.level);
			return ;
		},
	}
}
</script>

<template>
<section class=feature>
	<h2 class="feature-name"> {{ name }} : {{ level }} </h2>
	<section class=feature-buttons>
		<button class="up-and-down" v-on:click="levelDown" :disabled="isMin == true"> - </button>
		<input class="level-bar" type="range" v-model="level" :min=levelMin :max=levelMax>
		<button class="up-and-down" v-on:click="levelUp" :disabled="isMax == true"> + </button>
	</section>
</section>
</template>

<style>
.feature {
		/* margin-left: 0; */
		margin-top: 5%;
		margin-bottom: 5%;
}
.feature-name {
		color: #FFF961;
		margin-bottom: 0;
		font-family: helvetica;
		font-size: 35px;
		font-style: normal;
		letter-spacing: 1px;
		position: relative;
		width: 50%;
		margin-left: auto;
		margin-right: auto; 
		text-align: center;
}
.feature-buttons {
		position: relative;
		width: 50%;
		margin-left: auto;
		margin-right: auto; 
		text-align: center;
		margin-top: 1.5%;
}
.up-and-down{
		/* display: inline-flexbox; */
		-webkit-appearance: none;
		width: 10%;
		background: #fffdc7;
		outline: none;
		border: 5px solid #FFF961;
		/* border-radius: 10px;
		margin: 1.5%; */
		text-align: center;
		border-radius: 20px;
		align-items: center;


		display: inline-block;
		color: #1A3558;
		/* letter-spacing: 2px; */
		/* text-transform: uppercase; */
		text-decoration: none;
		/* font-size: 3em; */
		overflow: hidden;
		/* vertical-align: center; */
}
.up-and-down:hover {
		/* color: #111; */
		background: #FFF961;
		box-shadow: 0 0 50px #FFF961;
}
.level-bar {
		-webkit-appearance: none;
		width: 65%;
		height: 20px;
		background: #fffdc7;
		outline: none;
		border: 5px solid #FFF961;
		border-radius: 10px;
		text-align: center;
}
.level-bar:hover {
		/* color: #111; */
		background: #FFF961;
		box-shadow: 0px 0px 50px #FFF961;
}
/* for chrome and safari: */
/* .LevelBar::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 20px;
		height: 60px;
		background: #000000;
		cursor: pointer;
		border: 5px solid lawngreen;
		border-radius: 4px;
} */

/* for firefox */
/* .LevelBar::-moz-range-thumb {
		width: 20px;
		height: 60px;
		background: #000000;
		cursor: pointer;
		border: 5px solid lawngreen;
		border-radius: 4px;
} */
</style>
