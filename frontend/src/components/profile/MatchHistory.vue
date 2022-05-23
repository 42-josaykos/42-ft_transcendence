<script setup lang="ts">
import { Get } from '@/services/requests';
import { useUserStore } from '@/stores/user';
import { useMatchStore } from '@/stores/match';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

const { userClick, loggedUser } = storeToRefs(useUserStore());
const { matches } = storeToRefs(useMatchStore());
const nbMatches = ref(0)

async function getMatchHistory() {
  let response;
  try {
    response = await Get(`/users/${userClick.value?.id}/matches/played`);
    if (response.status === 200) {
      matches.value = response.data.reverse();
      nbMatches.value = matches.value.length
    }
  } catch (error: any) {}
}

onMounted(() => {
  getMatchHistory();
});
</script>

<template>
  <div v-if="matches.length > 0" class="match_history">
    <div class="scrollspy-example4">
    <table style="table-layout: fixed;">
      <thead style="border-bottom: 10px solid rgba(0, 0, 0, 0);">
        <tr>
          <th class="table_title" scope="col">Player 1</th>
          <th class="table_title" scope="col">Player 2</th>
          <th class="table_title" scope="col">Score</th>
          <th class="table_title" scope="col">Ranked</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(match, index) in matches" :key="match.id">
          <td style="" v-bind:class="{'mePlayer' : loggedUser?.id === match.players[0].id }" class="player">
            <div class="box" style="gap: 5px;">
              <div class="item"><img class="circular--square" style="width: 25px" v-bind:src="match.players[0].avatar" /></div>
              <a
                class="item player"
                href="#"
                @click="
                  userClick = match.players[0];
                  getMatchHistory();
                "
                >{{ match.players[0].username }}</a
              >
            </div>
          </td>
          <td v-bind:class="{'mePlayer' : loggedUser?.id === match.players[1].id}" class="player">
            <div class="box" style="gap: 5px;">
              <div class="item"><img class="circular--square" style="width: 25px" v-bind:src="match.players[1].avatar" /></div>
              <a
                class="item player"
                href="#"
                @click="
                  userClick = match.players[1];
                  getMatchHistory();
                "
                >{{ match.players[1].username }}</a
              >
            </div>
          </td>
          <td>
            <div class="box">
              <div class="item" v-bind:style= "match.score[0] > match.score[1] ? 'color: #1e9c61;' :'' ">{{ match.score[0] }} </div>
              <div class="item">-</div>
              <div class="item" v-bind:style= "match.score[1] > match.score[0] ? 'color: #1e9c61;' :'' ">{{ match.score[1] }} </div>
            </div>
          </td>
          <td>
              {{match.isRankedMatch ? 'Yes' : 'No'}}
          </td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
  <div v-else class="match_history">
    No game history
  </div>
</template>

<style scoped>

.scrollspy-example4 {
  position: relative;
  max-height: 300px;
  min-height: 300px;
  margin-top: 0.5rem;
  overflow: auto;
  scrollbar-width: none;
  min-width: 400px;
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
.box{
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  justify-content: center;
}
.box .item{
  width: 20px;
}
.winScore{
  color: #1e9c61;
}
a.item.player{
  text-decoration: none;
  color: inherit;
}
.item.player{
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  width: 100px;
}
.item.player:hover{
  overflow: visible;
  white-space: normal;
  width: 100px;
  text-decoration: underline;
}
.mePlayer{
  color: #1e579c !important;
}
.match_history {
  display: grid;
}
.table_title{
  font-size: large;
}
</style>