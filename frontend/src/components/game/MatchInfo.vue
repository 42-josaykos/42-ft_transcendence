<script>
import { mapState } from "pinia";
import { useUserStore } from "@/stores/user";
export default {
	name: "MatchInfo",
	data: function () {
		return {
			duo: {}, //duo[0] is LEFT, duo[1] is RIGHT
			you_lead: {},
      opponent: {},
		};
	},
	computed: {
		...mapState(useUserStore, ["loggedUser", "playersDuo"]),
		isYouLead: function () {
			console.log("this.duo in isYouLead: ",this.duo);
			if (this.duo[0].username == this.loggedUser.username)
			  this.you_lead = true;
			else
        this.you_lead = false;
			return (this.you_lead);
		},
    getOpponent: function () {
			if (this.duo[0].username == this.loggedUser.username)
        this.opponent = this.duo[1];
			else
        this.opponent = this.duo[0];
			return (this.opponent);
		},
	},
	created() {
		this.duo = this.playersDuo;
		console.log("this.duo in created: ",this.duo);
		this.isYouLead;
    this.getOpponent;
		return ;
	},
};
</script>

<template>
	<div>
		<!-- {{ this.loggedUser.username }} -->
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