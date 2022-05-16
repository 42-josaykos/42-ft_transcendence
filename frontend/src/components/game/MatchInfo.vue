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
      <h1 v-if="you_lead">
        <img
            class="circular--square icon_navbar"
            style="width: 60px; height: 60px; object-fit: cover"
            v-bind:src="this.loggedUser?.avatar"
            alt="Avatar"
        />
        YOU
      </h1>
      <h1 v-else> 
        <img
          class="circular--square icon_navbar"
          style="width: 60px; height: 60px; object-fit: cover"
          v-bind:src="this.opponent?.avatar"
          alt="Avatar"
        />
        {{ this.opponent.username }} </h1>
    </div>
    <div class="p2">
      <h1 v-if="!you_lead"> 
        YOU 
        <img
          class="circular--square icon_navbar"
          style="width: 60px; height: 60px; object-fit: cover"
          v-bind:src="this.loggedUser?.avatar"
          alt="Avatar"
        />
      </h1>
      <h1 v-else>
        {{ this.opponent.username }}
        <img
          class="circular--square icon_navbar"
          style="width: 60px; height: 60px; object-fit: cover"
          v-bind:src="this.opponent?.avatar"
          alt="Avatar"
        />
      </h1>
    </div>
  </div>
</template>
 
<style scoped>
 
.fb-player_name{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-bottom: 10px;
}
 
.p1 {
  font-weight: bold;
  font-size: 40px;
  order: 1;
  color: #ffffff;
  text-shadow: 0px 4px 15px #5ecef8, 0px 0px 10px #5ecef8;
  max-width: 50%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 20px;
  padding-right: 20px;
}

.p2 {
  font-weight: bold;
  font-size: 40px;
  order: 2;
  color: #ffffff;
  text-shadow: 0px 4px 15px #ff83ba, 0px 0px 10px #ff83ba;
  max-width: 50%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 20px;
  padding-right: 20px;
}
 
</style>