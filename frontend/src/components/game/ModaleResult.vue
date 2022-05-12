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
	created() {
		this.duo = this.playersDuo;
		this.getResult;
		return ;
	},
}
</script>

<template>
	
	<div>
		
	</div>

</template>

<style>
</style>