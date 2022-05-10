<script setup lang="ts">
import { ref } from 'vue';
import TeamProfil from './TeamProfil.vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import Ladder from './profile/Ladder.vue';
import Navbar from './Navbar.vue';

const profil_vmoreau = ref(false);
const profil_mabriand = ref(false);
const profil_josaykos = ref(false);
const profil_lchapren = ref(false);
const profil_adupuy = ref(false);

const userStore = useUserStore();
const { isAuthenticated, loggedUser } = storeToRefs(userStore);
</script>

<template>
  <Navbar :isAuthenticated="isAuthenticated" :loggedUser="loggedUser" />
  <div class="container-flex" style="position: relative">
    <div id="HomePage" class="full-height">
      <div class="container">
        <div class="row pb-5">
          <div class="col-lg-6">
            <div class="text-center mb-3 d-block d-lg-none">
              <h1 class="neonText display-1" style="font-size: 10vw">
                <b>Space Pong</b>
              </h1>
            </div>
            <br />
            <h1 class="neon-typo" style="float: left"><u>What is Pong?</u></h1>
            <br /><br /><br />

            <div class="container-fluid p-0">
              <div class="row">
                <div
                  class="col-lg-8 watch_player"
                  style="color: white; text-align: start"
                >
                  Pong is a table tennis–themed twitch arcade sports video game.
                  manufactured by Atari and originally released in 1972. It was
                  one of the earliest arcade video games.
                  <br /><br />
                  It was created by Allan Alcorn as a training exercise assigned
                  to him by Atari co-founder Nolan Bushnell, but Bushnell and
                  Atari co-founder Ted Dabney were surprised by the quality of
                  Alcorn's work and decided to manufacture the game.
                </div>
                <div class="col-lg-4 d-flex align-items-center">
                  <img
                    src="../assets/home/pong_gameplay.gif"
                    alt="PongGameplay"
                    style="width: 100%"
                  />
                </div>
              </div>
            </div>
            <br /><br /><br />
            <div class="container-fluid p-0">
              <div class="row">
                <Ladder />
                <!-- <div
                  class="col-lg-7 pb-3 watch_player"
                  style="color: white; text-align: start"
                >
                  Pong was the first commercially successful video game, and it
                  helped to establish the video game industry along with the
                  Magnavox Odyssey. Soon after its release, several companies
                  began producing games that closely mimicked its gameplay.
                  <br /><br />
                  Pong is a two-dimensional sports game that simulates table
                  tennis. The player controls an in-game paddle by moving it
                  vertically across the left or right side of the screen. They
                  can compete against another player controlling a second paddle
                  on the opposing side. Players use the paddles to hit a ball
                  back and forth. The goal is for each player to reach eleven
                  points before the opponent; points are earned when one fails
                  to return the ball to the other.
                </div> -->
                <!-- <div class="col-lg-5 d-flex align-items-center">
                  <img
                    src="../assets/home/Arcade-pong.jpeg"
                    alt="BorneArcade"
                    style="width: 100%"
                  />
                </div> -->
              </div>
            </div>
          </div>
          <div class="col-1" style="min-height: 50px" />
          <div class="col-lg-5">
            <div class="text-center mb-3 d-none d-lg-block">
              <div class="GameName neon-typo" style="font-size: 4vw">
                <b>SPACE PONG</b>
              </div>
            </div>

            <div class="infoGame mb-5">
              <div class="req neon-typo" v-if="!isAuthenticated">
                Log in to access
              </div>
              <div class="cont">
                <div
                  class="neon-typo pt-4"
                  style="font-size: xx-large; font-weight: bold"
                >
                  Live Game
                </div>
                <hr />
                <br />
                <table style="width: 90%; table-layout: fixed; margin-left: 5%">
                  <tr>
                    <th class="watch_player">Josaykos</th>
                    <td class="neon-typo versus">VS</td>
                    <th class="watch_player">Lchapren</th>
                    <td><i class="fa-solid fa-eye fa-xl action_icon"></i></td>
                  </tr>
                  <tr>
                    <th class="watch_player">Vmoreau</th>
                    <td class="neon-typo versus">VS</td>
                    <th class="watch_player">Adupuy</th>
                    <td><i class="fa-solid fa-eye fa-xl action_icon"></i></td>
                  </tr>
                  <tr>
                    <th class="watch_player">Mabriand</th>
                    <td class="neon-typo versus">VS</td>
                    <th class="watch_player">Josaykos</th>
                    <td><i class="fa-solid fa-eye fa-xl action_icon"></i></td>
                  </tr>
                  <tr>
                    <th class="watch_player">Adupuy</th>
                    <td class="neon-typo versus">VS</td>
                    <th class="watch_player">Lchapren</th>
                    <td><i class="fa-solid fa-eye fa-xl action_icon"></i></td>
                  </tr>
                  <tr>
                    <th class="watch_player">Dicayne Dicayne Dicayne</th>
                    <td class="neon-typo versus">VS</td>
                    <th class="watch_player">Mabriand Mabriand Mabriand</th>
                    <td><i class="fa-solid fa-eye fa-xl action_icon"></i></td>
                  </tr>
                </table>
              </div>
            </div>
            <div class="infoGame">
              <div class="req neon-typo" v-if="!isAuthenticated">
                Log in to access
              </div>
              <div class="cont">
                <div
                  class="neon-typo pt-4"
                  style="font-size: xx-large; font-weight: bold"
                >
                  Online Player
                </div>
                <hr />
                <br />
                <table style="width: 90%; table-layout: fixed; margin-left: 5%">
                  <tr>
                    <th class="watch_player">Mabriand</th>
                    <td>
                      <i
                        class="fa-solid fa-circle"
                        style="color: greenyellow"
                      ></i>
                    </td>
                    <td>
                      <i class="fa-solid fa-comment-dots fa-xl action_icon"></i>
                    </td>
                    <td>
                      <i class="fa-solid fa-gamepad fa-xl action_icon"></i>
                    </td>
                    <td>
                      <i
                        class="fa-solid fa-ellipsis-vertical fa-xl action_icon"
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <th class="watch_player">Adupuy</th>
                    <td>
                      <i class="fa-solid fa-circle" style="color: red"></i>
                    </td>
                    <td>
                      <i class="fa-solid fa-comment-dots fa-xl action_icon"></i>
                    </td>
                    <td>
                      <i class="fa-solid fa-gamepad fa-xl action_icon"></i>
                    </td>
                    <td>
                      <i
                        class="fa-solid fa-ellipsis-vertical fa-xl action_icon"
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <th class="watch_player">Lchapren</th>
                    <td>
                      <i class="fa-solid fa-circle" style="color: red"></i>
                    </td>
                    <td>
                      <i class="fa-solid fa-comment-dots fa-xl action_icon"></i>
                    </td>
                    <td>
                      <i class="fa-solid fa-gamepad fa-xl action_icon"></i>
                    </td>
                    <td>
                      <i
                        class="fa-solid fa-ellipsis-vertical fa-xl action_icon"
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <th class="watch_player">Josaykos</th>
                    <td>
                      <i
                        class="fa-solid fa-circle"
                        style="color: greenyellow"
                      ></i>
                    </td>
                    <td>
                      <i class="fa-solid fa-comment-dots fa-xl action_icon"></i>
                    </td>
                    <td>
                      <i class="fa-solid fa-gamepad fa-xl action_icon"></i>
                    </td>
                    <td>
                      <i
                        class="fa-solid fa-ellipsis-vertical fa-xl action_icon"
                      ></i>
                    </td>
                  </tr>
                  <tr>
                    <th class="watch_player">
                      Vmoreau Vmoreau Vmoreau Vmoreau Vmoreau
                    </th>
                    <td>
                      <i class="fa-solid fa-circle" style="color: red"></i>
                    </td>
                    <td>
                      <i class="fa-solid fa-comment-dots fa-xl action_icon"></i>
                    </td>
                    <td>
                      <i class="fa-solid fa-gamepad fa-xl action_icon"></i>
                    </td>
                    <td>
                      <i
                        class="fa-solid fa-ellipsis-vertical fa-xl action_icon"
                      ></i>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div id="Contact" class="p-4 ps-4">
      <h2 class="neon-typo pb-4"><u>Team Contact</u></h2>
      <div class="row">
        <div class="col-lg p-2">
          <button @click="profil_mabriand = true" class="team_btn">
            <b>Mabriand</b> <i class="fa-solid fa-user fa-lg"></i>
          </button>
        </div>
        <div class="col-lg p-2">
          <button @click="profil_josaykos = true" class="team_btn">
            <b>Josaykos</b> <i class="fa-solid fa-user fa-lg"></i>
          </button>
        </div>
        <div class="col-lg p-2">
          <button @click="profil_adupuy = true" class="team_btn">
            <b>Adupuy</b> <i class="fa-solid fa-user fa-lg"></i>
          </button>
        </div>
        <div class="col-lg p-2">
          <button @click="profil_vmoreau = true" class="team_btn">
            <b>Vmoreau</b> <i class="fa-solid fa-user fa-lg"></i>
          </button>
        </div>
        <div class="col-lg p-2">
          <button @click="profil_lchapren = true" class="team_btn">
            <b>Lchapren</b> <i class="fa-solid fa-user fa-lg"></i>
          </button>
        </div>
      </div>
      <TeamProfil
        :profil_vmoreau="profil_vmoreau"
        @close_vm="profil_vmoreau = !profil_vmoreau"
        :profil_mabriand="profil_mabriand"
        @close_mb="profil_mabriand = !profil_mabriand"
        :profil_josaykos="profil_josaykos"
        @close_js="profil_josaykos = !profil_josaykos"
        :profil_lchapren="profil_lchapren"
        @close_lc="profil_lchapren = !profil_lchapren"
        :profil_adupuy="profil_adupuy"
        @close_ad="profil_adupuy = !profil_adupuy"
      />
    </div>

    <div id="Footer" class="p-2">
      <footer class="text-light p-4">
        <a
          href="https://github.com/josayko/ft_transcendence"
          target="_blank"
          class="text-warning"
          >Repository Github</a
        >
        |
        <a
          href="https://drive.google.com/file/d/1Mhwe1aza_2WibGanoNNLryHTwAhgEg3I/view?usp=sharing"
          target="_blank"
          class="text-warning"
          >Subject</a
        >
        <br />
        <small>&copy; 2022, Ft_Transcendence 42</small>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.infoGame {
  display: grid;

  background-color: rgba(0, 0, 0, 0.4);
  padding-bottom: 4vh;
  min-height: 400px;
  max-height: 400px;
  overflow-y: scroll;
  border-radius: 30px;
  box-shadow: 0px 0px 10px 2px white, inset 0px 0px 4px 2px white;
}

.req,
.cont {
  grid-area: 1 / 1;
}
.req {
  font-size: xx-large;
  font-weight: bold;
  background-color: rgba(0, 0, 0, 0.89);
  min-height: 400px;
  text-align: center;
  align-items: center;
  z-index: 2;
  display: grid;
}

.cont {
  z-index: 1;
}

#Footer {
  background-color: rgba(0, 0, 0, 0.65);
}

#Contact {
  background-color: rgba(255, 255, 255, 0.137);
}
.team_btn {
  position: relative;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  font-size: x-large;
  border-radius: 10px;
  border: none;
  transition: 0.4s;
  margin-left: 5px;
  background-color: #fffdbf;
  color: var(--sidebar-icon-color);
  box-shadow: 0px 0px 10px 2px #fff700;
}
.team_btn:hover {
  transform: scale(1.3);
  box-shadow: 0px 0px 10px #fff961, 0px 0px 15px 5px #fff961;
}

p {
  margin-left: auto;
  margin-right: auto;
  width: 6em;
}

.neon-typo {
  color: #ffffff;
  text-shadow: 0px 4px 15px white, 0px 0px 10px white;
}
.GameName {
  font-family: 'Vibure', cursive;
  font-style: normal;
}

.infoGame {
  overflow: hidden;
}

.infoGame hr {
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

.versus {
  font-size: large;
  font-weight: bold;
}
.watch_player {
  font-size: large;
  overflow-x: hidden;
}

.action_icon {
  color: var(--sidebar-icon-color);
}

.action_icon:hover {
  transform: scale(1.5);
  transition: 0.4s;
  cursor: pointer;
}

th {
  padding: 5px;
}
</style>
