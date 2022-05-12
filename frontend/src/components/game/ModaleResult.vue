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
	props: ["player_L", "endgame"],
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
	
	<div v-if="this.engame">
		<h1 v-if="this.result">WIN</h1>
		<h1 v-else>LOOSE</h1>
	</div>

</template>

<style>
</style>