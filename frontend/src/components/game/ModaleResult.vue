<script>
import { mapState } from "pinia";
import { useUserStore } from "@/stores/user";
export default {
	name: "ModaleResult",
	data: function () {
		return {
			result: {},
			duo: {}, //duo[0] is LEFT, duo[1] is RIGHT
		};
	},
	props: ["player_L"],
	computed: {
		...mapState(useUserStore, ["loggedUser", "playersDuo"]),
		getResult: function() {
			if (this.loggedUser.username == this.duo[0].username && this.player_L.score == 10)
				return (this.result = true);
			return (this.result = false);
		},
	},
	created() {
		console.log("HERE");
		console.log(this.endgame);
		this.duo = this.playersDuo;
		this.getResult;
		console.log("HERE");
		return ;
	},
};
</script>

<template>
  <div class="bloc_modale">
    <div class="overlay"></div>
    <div class="modale card">
      <h1 v-if="this.result">WIN</h1>
			<h1 v-else>LOOSE</h1>
    </div> 
  </div>
</template>

<!-- <template>
	<div>
		<h1 v-if="this.result">WIN</h1>
		<h1 v-else>LOOSE</h1>
	</div>
</template> -->

<style>
</style>