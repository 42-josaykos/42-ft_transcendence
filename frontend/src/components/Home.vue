<script setup lang="ts">
import { ref } from 'vue';
import TeamProfil from './TeamProfil.vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import Ladder from './profile/Ladder.vue';
import Navbar from './Navbar.vue';
import LiveGames from './game/LiveGames.vue';
import UserList from './UserList.vue';

const profil_vmoreau = ref(false);
const profil_mabriand = ref(false);
const profil_josaykos = ref(false);
const profil_lchapren = ref(false);
const profil_adupuy = ref(false);

const userStore = useUserStore();
storeToRefs(userStore);
</script>

<template>
  <Navbar componentName="Home" />
  <div class="container-flex" style="position: relative">
    <div id="HomePage">
      <div class="container">
        <div class="row pb-5">
          <div class="col-lg-6">
            <br />
            <h1 class="neon-typo" style="float: left"><u>What is Pong?</u></h1>
            <br /><br /><br />

            <div class="container-fluid p-0">
              <div class="watch_player"
                  style="color: white; text-align: justify">
                <div class="d-flex align-items-center ps-3" style="float: right;">
                  <img
                    src="../assets/home/pong_gameplay.gif"
                    alt="PongGameplay"
                    style="width: 100%"
                  />
                </div>
                Pong is a table tennis–themed twitch arcade sports video game.
                manufactured by Atari and originally released in 1972. It was
                one of the earliest arcade video games.
                <br /><br />
                It was created by Allan Alcorn as a training exercise assigned
                to him by Atari co-founder Nolan Bushnell, but Bushnell and
                Atari co-founder Ted Dabney were surprised by the quality of
                Alcorn's work and decided to manufacture the game.
              </div>
            </div>
            <br /><br /><br />
            <div class="container-fluid p-0">
              <div class="row">
                <Ladder />
              </div>
            </div>
          </div>
          <div class="col-1" style="min-height: 50px" />
          <div class="col-lg-5">
            <LiveGames />
            <UserList />
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

th {
  white-space: nowrap;
  width: 40%;
}

.watch_player {
  font-size: large;
  overflow-x: hidden;
}

th {
  padding: 5px;
}
</style>
