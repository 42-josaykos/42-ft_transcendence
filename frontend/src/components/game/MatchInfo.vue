<script>
import { mapState } from "pinia";
import { useUserStore } from "@/stores/user";
export default {
	name: "MatchInfo",
	data: function () {
		return {
			duo: {},
			L_player: {},
			R_player: {},
			you_lead: {},
      opponent: {},
		};
	},
	computed: {
		...mapState(useUserStore, ["loggedUser", "playersDuo"]),
		isYouLead: function () {
			if (this.L_player.username == this.loggedUser.username)
			  this.you_lead = true;
			else
        this.you_lead = false;
			return (this.you_lead);
		},
    isOpponent: function () {
			if (this.L_player.username == this.loggedUser.username)
        this.opponent = this.R_player;
			else
        this.opponent = this.L_player;
			return (this.opponent);
		},
	},
	created() {
		this.duo = this.playersDuo;
		this.L_player = this.duo[0];
		this.R_player = this.duo[1];
		this.isYouLead;
    this.isOpponent;
		return ;
	},
};
</script>

<template>
	<div>
    <div class="left-player">
		  <h1 v-if="you_lead"> YOU </h1>
      <h1 v-else> {{ this.opponent.username }} </h1>
    </div>
    <div class="right-player">
		  <h1 v-if="!you_lead"> YOU </h1>
		  <h1 v-else> {{ this.opponent.username }} </h1>
    </div>

	</div>
</template>

<style>
/* .left-player {
  
} */
</style>