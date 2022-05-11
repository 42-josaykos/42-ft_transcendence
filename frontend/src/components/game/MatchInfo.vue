<script>
import { mapState } from "pinia";
import { useUserStore } from "@/stores/user";
// import MatchInfo from "./MatchInfo.vue";

// import { storeToRefs, mapState } from "pinia";
// import { useUserStore } from "@/stores/user";
export default {
	name: "MatchInfo",
	data: function () {
		return {
		// enemy: {},
			duo: {},
			L_player: {},
			R_player: {},
			you_left: {},
		};
	// },
	},
	computed: {
		...mapState(useUserStore, ["loggedUser", "playersDuo"]),
		isYouLeft: function () {
			// console.log("logged user:", this.loggedUser.username);
			// console.log("player user:", this.givenPlayer.username);
			if (this.L_player.username == this.loggedUser.username)
				this.you_left = true;	
			this.you_left = false;
			return (this.you_left);
		},
	},
	created() {
		this.duo = this.playersDuo;
		this.L_player = this.duo[0];
		this.R_player = this.duo[1];

		this.isYouLeft;
		// console.log("test :", this.L_player.username)
		return ;
	},
	methods:
		// isYouRight: function () {
		// 	console.log("logged user:", this.loggedUser.username);
		// 	console.log("player user:", this.givenPlsayer.username);
		// 	if (this.isSameUser(this.R_player) == true)
		// 		return (true);
		// 	return (false);
		// },
	},
	// assignPlaces: function() {
	// 	// this.L_player = playersDuo.value[0];
	// 	// this.R_player = playersDuo.value[1];
	// 	// console.log("++++++++++++++++++++++++++++++++");
	// 	// console.log(this.L_player);
	// 	// console.log(this.R_player);
	// 	// console.log("++++++++++++++++++++++++++++++++");
	// }
};
</script>

<template>
	<div>
		<h1 v-if="you_left">YOU</h1>
		<h1 v-else> OPPONENT</h1>

		<h1 v-if="!you_left">YOU</h1>
		<h1 v-else> OPPONENT</h1>
		<!-- {{ loggedUser }}
  	{{ playersDuo }}
		----------------------
		{{ loggedUser }}
  	{{ playersDuo[0] }} -->
	</div>
</template>

<style>
</style>