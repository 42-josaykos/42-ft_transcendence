<script setup lang="ts">
import { Get } from '@/services/requests';
import { useUserStore } from '@/stores/user';
import { useMatchStore } from '@/stores/match';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';

const { userClick, loggedUser } = storeToRefs(useUserStore());
const { matches } = storeToRefs(useMatchStore());



async function getMatchHistory() {
  let response;
  try {
    response = await Get(`/users/${userClick.value?.id}/matches/played`);
    if (response.status === 200) {
      matches.value = response.data.reverse();
    }
  } catch (error: any) {}
}



onMounted(() => {
  // Get('/auth/jwt-status').then(res => {
  //   loggedUser.value = res.data;

  // });
  getMatchHistory();
});
const test = false;
</script>

<template>
  <h4>
    <b><u>Match history</u></b>
  </h4>
  <div class="match_history">
    <table style="table-layout: fixed;">
      <thead style="border-bottom: 10px solid rgba(0, 0, 0, 0);">
        <tr>
          <!-- <th scope="col">#</th> -->
          <th class="table_title" scope="col">Player 1</th>
          <th class="table_title" scope="col">Player 2</th>
          <th class="table_title" scope="col">Score</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(match, index) in matches" :key="match.id">
          <td style="" v-bind:class="{'mePlayer' : loggedUser?.id === match.players[0].id }" class="player">
            <div class="box" style="gap: 5px;">
              <div class="item"><img class="circular--square" style="width: 25px" v-bind:src="match.players[0].avatar" /></div>
              <div class="item player">{{ match.players[0].username }}</div>
            </div>
          </td>
          <td v-bind:class="{'mePlayer' : loggedUser?.id === match.players[1].id}" class="player">
            <div class="box" style="gap: 5px;">
              <div class="item"><img class="circular--square" style="width: 25px" v-bind:src="match.players[1].avatar" /></div>
              <div class="item player">{{ match.players[1].username }}</div>
            </div>
          </td>
          <td>
            <div class="box">
              <div class="item" v-bind:style= "match.score[0] === 10 ? 'color: #1e9c61;' :'' ">{{ match.score[0] }} </div>
              <div class="item">-</div>
              <div class="item" v-bind:style= "match.score[1] === 10 ? 'color: #1e9c61;' :'' ">{{ match.score[1] }} </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>

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
}
.mePlayer{
  color: #1e579c;
}

.match_history {
  display: grid;
}

.table_title{
  font-size: large;
}
</style>
