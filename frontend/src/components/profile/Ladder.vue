<script setup lang="ts">
import { Get } from '@/services/requests';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const userStore = useUserStore();
const { userClick, setting_open } = storeToRefs(userStore);

const players = ref();

async function getPlayersStats() {
  let response;
  try {
    response = await Get('/stats');
    if (response.status === 200) {
      players.value = response.data;
      getLadder();
    }
  } catch (error: any) {}
}

function getLadder() {
  players.value = players.value.sort((a: any, b: any) => {
    if (a.ratio > b.ratio) return -1;
    else if (a.ratio < b.ratio) return 1;
    else {
      if (a.played > b.played) return -1;
      else if (a.played < b.played) return 1;
    }
  });
}

getPlayersStats();
</script>

<template>
  <div class="leaderBoard mb-5">
    <div class="cont">
      <div
        class="neon-typo pt-4"
        style="font-size: xx-large; font-weight: bold"
      >
        LeaderBoard
      </div>
    <hr />
    <br />
    <table style="width: 90%; table-layout: fixed; margin-left: 5%">
      <thead style="border-bottom: 20px solid rgba(0, 0, 0, 0)">
        <tr>
          <th class="table_title" scope="col">Rank</th>
          <th class="table_title" scope="col">UserName</th>
          <th class="table_title" scope="col">Winrate</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(player, index) in players?.slice(0, 20)">
          <!-- Print top 20 of the leaderboard -->
          <th
            v-bind:class="{
              first: index + 1 === 1,
              second: index + 1 === 2,
              third: index + 1 === 3
            }"
          >
            {{ index + 1 }}
          </th>
          <td>
            <button class="user_btn" @click="userClick = player.user; setting_open = true">
              {{ player.user.username }}
            </button>
          </td>
          <td>{{ player.ratio * 100 }} %</td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>

<style scoped>
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

.cont {
  z-index: 1;
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
  /* overflow: hidden; */
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
  margin-top: 2vh;
}

th {
  white-space: nowrap;
  width: 40%;
}
</style>
