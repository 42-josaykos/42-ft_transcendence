```<script>
import { mapState } from "pinia";
import { useUserStore } from "@/stores/user";
export default {
  name: "MatchInfo",
  props: ["player_L", "player_R"],
  computed: {
    ...mapState(useUserStore, ["loggedUser"]),
  },
};
</script>

<template>
  <template v-if="this.player_L && this.player_R">
    <div class="fb-player_name">
      <div class="p1">
        <img
          class="circular--square icon_navbar"
          style="width: 60px; height: 60px; object-fit: cover"
          v-bind:src="this.player_L.avatar"
          alt="Avatar"
        />{{ this.player_L.username }}
        <template v-if="this.player_L.id == this.loggedUser.id">(You)</template>
      </div>
      <div class="p2">
        <template v-if="this.player_R.id == this.loggedUser.id">(You)</template>
        {{ this.player_R.username }}
        <img
          class="circular--square icon_navbar"
          style="width: 60px; height: 60px; object-fit: cover"
          v-bind:src="this.player_R.avatar"
          alt="Avatar"
        />
      </div>
    </div>
  </template>
</template>

<style scoped>
.fb-player_name {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-bottom: 10px;
}

/* .fb-player_score{
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  margin-bottom: 10px;
} */
/* .info1 {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  margin-bottom: 10px;

} */
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

/* .s1 {
  font-weight: bold;
  font-size: 100px;
  order: 1;
  color: #ffffff;
  text-shadow: 0px 4px 15px #5ecef8, 0px 0px 10px #5ecef8;
  max-width: 50%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 50px;
  padding-right: 50px;
}

.s2 {
  font-weight: bold;
  font-size: 100px;
  order: 2;
  color: #ffffff;
  text-shadow: 0px 4px 15px #ff83ba, 0px 0px 10px #ff83ba;
  max-width: 50%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 50px;
  padding-right: 50px;
} */
</style>
```