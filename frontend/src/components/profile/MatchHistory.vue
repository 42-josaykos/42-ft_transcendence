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
  <h4>
    <b><u>Match history</u></b>
  </h4>
  <div class="match_history">
    <table style="width: 90%; table-layout: fixed; margin-top: 15px; margin-left: auto; margin-right: auto;">
      <thead style="border-bottom: 20px solid rgba(0, 0, 0, 0)">
          <tr>
        <th class="table_title" scope="col">Player 1</th>
        <th class="table_title" scope="col">Player 2</th>
        <th class="table_title" scope="col">Score</th>
        </tr>
      </thead>
    </table>
    <div  class="scrollspy-example4">
      <table style="width: 90%; table-layout: fixed; margin-left: auto; margin-right: auto;">
        <thead style="border-bottom: 20px solid rgba(0, 0, 0, 0)">
          <tr v-for="(match, index) in matches" :key="match.id">
            <th v-bind:class="{'mePlayer' : loggedUser?.id === match.players[0].id}" class="player">
              <div class="box" style="gap: 5px; padding-left: 1vw;">
                <div class="item"><img class="circular--square" style="width: 25px" v-bind:src="match.players[0].avatar" /></div>
                <a
                  class="item player"
                  href="javascript:void();"
                  @click="
                    userClick = match.players[0];
                    getMatchHistory();
                  "
                  >{{ match.players[0].username }}</a
                >
              </div>
            </th>
            <th v-bind:class="{'mePlayer' : loggedUser?.id === match.players[1].id}" class="player">
              <div class="box" style="gap: 5px; margin-left: -10px;">
                <div class="item"><img class="circular--square" style="width: 25px" v-bind:src="match.players[1].avatar" /></div>
                <a
                  class="item player"
                  href="javascript:void();"
                  @click="
                    userClick = match.players[1];
                    getMatchHistory();
                  "
                  >{{ match.players[1].username }}</a
                >
              </div>
            </th>
            <th class="d-flex" scope="col">
              <div class="item" v-bind:style= "match.score[0] === 5 ? 'color: #1e9c61;' :'' ">{{ match.score[0] }}</div>
              <div class="item"> - </div>
              <div class="item" v-bind:style= "match.score[1] === 5 ? 'color: #1e9c61;' :'' ">{{ match.score[1] }}</div>
            </th>
          </tr>
        </thead>
      </table>
    </div>
  </div>
</template>

<style scoped>
.box{
  display: flex;
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
  min-width: 400px;
}

.scrollspy-example4 {
  position: relative;
  max-height: 200px;
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
  width: 100px;
  text-align: start;
}
.item.player:hover{
  overflow: visible;
  white-space: normal;
  width: 100px;
  text-decoration: underline;
}
.table_title {
  font-size: large;
}

th {
  white-space: nowrap;
  width: 40%;
}
</style>