<script setup lang="ts">
import { Get } from "@/services/requests";
import { useGameStore } from "@/stores/game";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const userStore = useUserStore();
const { userClick, setting_open, leaderboard, socketChat } =
  storeToRefs(userStore);

const gameStore = useGameStore();
const { gameSocket } = storeToRefs(gameStore);

// Listen and ask stats updates
gameSocket.value?.on("askStatsUpdate", (data: any) => {
  socketChat.value?.emit("getStats");
});
socketChat.value?.on("receiveStatsUpdate", (data: any) => {
  leaderboard.value = data;
  getLadder();
});

async function getPlayersStats() {
  let response;
  try {
    response = await Get("/stats");
    if (response.status === 200) {
      leaderboard.value = response.data;
      getLadder();
    }
  } catch (error: any) {}
}

function getLadder() {
  if (leaderboard.value) {
    leaderboard.value = leaderboard.value.sort((a: any, b: any) => {
      if (a.ratio > b.ratio) return -1;
      else if (a.ratio < b.ratio) return 1;
      else {
        if (a.played > b.played) return -1;
        else if (a.played < b.played) return 1;
      }
    });
  }
}

getPlayersStats();
</script>

<template>
  <div class="leaderBoard" style="overflow-y:hidden">
    <div class="cont">
      <div
        class="neon-typo pt-4"
        style="font-size: xx-large; font-weight: bold"
      >
        LeaderBoard
      </div>
      <hr />
      <br />
      <table style="width: 98%; table-layout: fixed; margin-top: 15px;">
        <thead style="border-bottom: 20px solid rgba(0, 0, 0, 0)">
          <tr>
            <th class="table_title" scope="col">Rank</th>
            <th class="table_title" scope="col">Player</th>
            <th class="table_title" scope="col">Win</th>
            <th class="table_title" scope="col">Lose</th>
            <th class="table_title" scope="col">Played</th>
            <th class="table_title" scope="col">Winrate</th>
          </tr>
        </thead>
      </table>
      <div  class="scrollspy-example4">
        <table style="width: 98%; table-layout: fixed;">
          <thead style="border-bottom: 20px solid rgba(0, 0, 0, 0)">
            <tr v-for="(player, index) in leaderboard?.slice(0, 20)">
              <th
                v-bind:class="{
                  first: index + 1 === 1,
                  second: index + 1 === 2,
                  third: index + 1 === 3,
                }"
              >
                {{ index + 1 }}
              </th>
              <th class="" scope="col">
                <span class="item">
                  <img class="circular--square" style="width: 25px" v-bind:src="player?.user?.avatar" />
                </span>
                <button
                  class="item player user_btn"
                  @click="
                    userClick = player.user;
                    setting_open = true;
                  "
                >
                  {{ player?.user?.username }}
                </button>
              </th>
              <th class="" scope="col">{{ player?.win }}</th>
              <th class="" scope="col">{{ player?.lose }}</th>
              <th class="" scope="col">{{ player?.played }}</th>
              <th class="" scope="col">{{ (player?.ratio * 100).toFixed(2) }} %</th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scrollspy-example4 {
  position: relative;
  max-height: 200px;
  min-height: 200px;
  overflow: auto;
  scrollbar-width: none;
}
.scrollspy-example4::-webkit-scrollbar {
  display: none;
}
.scrollspy-example4::-webkit-scrollbar-track {
  background: transparent;
}
.scrollspy-example4::-webkit-scrollbar-thumb {
  background-color: transparent;
}
.item.player{
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: -webkit-fill-available;
  width: -moz-available;
  text-align: start;
}
.item.player:hover{
  overflow: visible;
  white-space: normal;
  width: 100px;
  text-decoration: underline;
}
.user_btn {
  border: none;
  background-color: rgba(0, 0, 0, 0);
  color: inherit;
  transition: 0.2s;
}

.user_btn:hover {
  color: var(--sidebar-icon-color);
  transform: scale(1.2);
  font-weight: bold;
}
.table_title {
  font-size: large;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: -webkit-fill-available;
  width: -moz-available;
}
.first {
  /* color: #D5AD6D; */
  background: -webkit-linear-gradient(transparent, transparent),
    -webkit-linear-gradient(top, rgb(233, 189, 119) 0%, rgb(223, 181, 113) 26%, rgb(
            247,
            202,
            131
          )
          35%, rgb(189, 150, 87) 45%, rgb(167, 130, 72) 61%, rgb(228, 187, 120)
          100%);
  background: -o-linear-gradient(transparent, transparent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: x-large;
}

.second {
  /* color: silver; */
  background: -webkit-linear-gradient(transparent, transparent),
    -webkit-linear-gradient(top, rgb(212, 212, 212) 0%, rgb(209, 209, 209) 26%, rgb(
            185,
            185,
            185
          )
          35%, rgb(158, 158, 158) 45%, rgb(97, 97, 97) 61%, rgb(180, 180, 180)
          100%);
  background: -o-linear-gradient(transparent, transparent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: x-large;
}

.third {
  /* color: brown; */
  background: -webkit-linear-gradient(transparent, transparent),
    -webkit-linear-gradient(top, rgb(255, 149, 99) 0%, rgb(213, 173, 109) 26%, rgb(
            226,
            186,
            120
          )
          35%, rgb(255, 177, 74) 45%, rgb(250, 142, 0) 61%, rgb(213, 173, 109)
          100%);
  background: -o-linear-gradient(transparent, transparent);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-size: x-large;
}
.neon-typo {
  color: #ffffff;
  text-shadow: 0px 4px 15px white, 0px 0px 10px white;
}
.leaderBoard {
  display: grid;

  background-color: rgba(0, 0, 0, 0.4);
  padding-bottom: 4vh;
  min-height: 400px;
  max-height: 400px;
  border-radius: 30px;
  box-shadow: 0px 0px 10px 2px white, inset 0px 0px 4px 2px white;
  overflow-y: scroll;
}

.leaderBoard hr {
  display: block;
  position: relative;
  height: 2px;
  box-shadow: 0px 0px 10px white, 0px 0px 15px 5px white;
  opacity: 1;
  width: 90%;
  color: #fffed9;
  margin: auto;
  margin-top: 10px;
}

th {
  white-space: nowrap;
  width: 40%;
}

.cont {
  grid-area: 1 / 1;
}

.cont {
  z-index: 1;
}
</style>
