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
  <div class="fb-player_name">
    <div class="p1">
      <h1 v-if="you_lead"> YOU </h1>
      <h1 v-else> {{ this.opponent.username }} </h1>
    </div>
    <div class="p2">
      <h1 v-if="!you_lead"> YOU </h1>
      <h1 v-else> {{ this.opponent.username }} </h1>
    </div>
  </div>
</template>

<!-- <template>
    <button @click="switch_name = !switch_name" style="position: absolute; top: 0;">Switch</button>
    <div style="position: absolute; top: 15%; left: 25%; max-width: 800px; max-height:500px;">
        <div v-if="switch_name" class="fb-player_name">
            <div class="p1">
                Player 1
            </div>
            <div class="p2">
                Player 2
            </div>
        </div>
        <div style="width:800px;height:500px;border:1px solid #000; background-color: burlywood; color: #000;">
            GAME
        </div>
    </div>
</template> -->
 
<style scoped>
 
.fb-player_name{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-bottom: 10px;
}
 
.p1{
  font-weight: bold;
  font-size: 40px;
  order: 1;
  color: #FFFFFF;
  text-shadow: 0px 4px 15px #5ECEF8, 0px 0px 10px #5ECEF8;
  max-width: 40%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
 
.p2{
  font-weight: bold;
  font-size: 40px;
  order: 2;
  color: #FFFFFF;
  text-shadow: 0px 4px 15px #FF83BA, 0px 0px 10px #FF83BA;
  max-width: 40%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
 
</style>



<style>
/* .left-player {
  
} */
</style>