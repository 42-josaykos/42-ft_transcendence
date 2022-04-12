<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import TeamProfil from './TeamProfil.vue';

  const profil_vmoreau = ref(false)
  const profil_mabriand = ref(false)
  const profil_josaykos = ref(false)
  const profil_lchapren = ref(false)
  const profil_adupuy = ref(false)

</script>

<template>
<div class="container-flex pt-4" style="position: relative;">

    <div id="HomePage" class="full-height pt-4 ">
      <div class="container">
        <div class="row pb-5">
          <div class="col-lg-6">
            <div class="text-center mb-3 d-block d-lg-none">
              <h1 class="GameName neon-typo" style="font-size: 10vw;"><b>SPACE PONG</b></h1>
            </div>
            <br>
            <h1 class="neon-typo" style="float: left;"><u>What is Pong?</u></h1>
            <br><br><br>

            <div class="container-fluid p-0">
              <div class="row">
                <div class="col-lg-8 watch_player" style="color:white; text-align: start;">
                    Pong is a table tennis–themed twitch arcade sports video game. manufactured by Atari and originally released in 1972. It was one of the earliest arcade video games.
                    <br><br>
                    It was created by Allan Alcorn as a training exercise assigned to him by Atari co-founder Nolan Bushnell, but Bushnell and Atari co-founder Ted Dabney were surprised by the quality of Alcorn's work and decided to manufacture the game.
                </div>
                <div class="col-lg-4 d-flex align-items-center">
                  <img src="../assets/home/pong_gameplay.gif" alt="PongGameplay" style="width: 100%">
                </div>
              </div>
            </div>
            <br><br><br>
            <div class="container-fluid p-0">
              <div class="row">
                <div class="col-lg-7 d-flex align-items-center pb-3 watch_player" style="color:white; text-align: start;">
                  Pong was the first commercially successful video game, and it helped to establish the video game industry along with the Magnavox Odyssey. Soon after its release, several companies began producing games that closely mimicked its gameplay.
                  <br><br>

                </div>
                <div class="col-lg-5">
                  <img src="../assets/home/Arcade-pong.jpeg" alt="BorneArcade" style="width: 100%">
                </div>
              </div>
            </div>
          </div>
          <div class="col-1" style="min-height: 50px;"/>
          <div class="col-lg-5">
            <div class="text-center mb-3 d-none d-lg-block">
              <div class="GameName neon-typo" style="font-size: 4vw;"><b>SPACE PONG</b></div>
            </div>
            <div class="liveGame">
              <div class="neon-typo pt-4" style="font-size: xx-large; font-weight: bold;">Live Game</div>
              <hr>
              <br>
                <table style="width: 95%; table-layout: fixed;">
                  <tr>
                    <th class="watch_player">Josaykos</th>
                    <td class="neon-typo versus">VS</td>
                    <th class="watch_player">Lchapren</th>
                    <td><i class="fa-solid fa-eye fa-xl watch_icon"></i></td>
                  </tr>
                  <tr>
                    <th class="watch_player">Vmoreau</th>
                    <td class="neon-typo versus" >VS</td>
                    <th class="watch_player">Adupuy</th>
                    <td><i class="fa-solid fa-eye fa-xl watch_icon"></i></td>
                  </tr>
                  <tr>
                    <th class="watch_player">Mabriand</th>
                    <td class="neon-typo versus">VS</td>
                    <th class="watch_player">Josaykos</th>
                    <td><i class="fa-solid fa-eye fa-xl watch_icon"></i></td>
                  </tr>
                  <tr>
                    <th class="watch_player">Adupuy</th>
                    <td class="neon-typo versus">VS</td>
                    <th class="watch_player">Lchapren</th>
                    <td><i class="fa-solid fa-eye fa-xl watch_icon"></i></td>
                  </tr>
                  <tr>
                    <th class="watch_player">Dicayne Dicayne Dicayne</th>
                    <td class="neon-typo versus">VS</td>
                    <th class="watch_player">Mabriand Mabriand Mabriand</th>
                    <td><i class="fa-solid fa-eye fa-xl watch_icon"></i></td>
                  </tr>
                </table>
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
        :profil_vmoreau="profil_vmoreau"   @close_vm="profil_vmoreau = !profil_vmoreau"
        :profil_mabriand="profil_mabriand" @close_mb="profil_mabriand = !profil_mabriand"
        :profil_josaykos="profil_josaykos" @close_js="profil_josaykos = !profil_josaykos"
        :profil_lchapren="profil_lchapren" @close_lc="profil_lchapren = !profil_lchapren"
        :profil_adupuy="profil_adupuy"     @close_ad="profil_adupuy = !profil_adupuy"
      />
    </div>

    <div id="Footer" class="p-2">
      <footer class="text-light p-4">
        <a href="https://github.com/josayko/ft_transcendence" target="_blank" class="text-warning">Repository Github</a> |
        <a href="https://drive.google.com/file/d/1Mhwe1aza_2WibGanoNNLryHTwAhgEg3I/view?usp=sharing" target="_blank" class="text-warning">Subject</a>
        <br>
        <small>&copy; 2022, Ft_Transcendence 42</small>
      </footer>
    </div>
</div>
</template>

<style scoped>

.liveGame{
  background-color: rgba(0, 0, 0, 0.397);
  padding-bottom: 4vh;
  min-height: 400px;
  border-radius: 30px;
  box-shadow: 0px 0px 10px 2px #fff961, inset 0px 0px 4px 2px #fff961;
}

#Footer {
  background-color: rgba(0, 0, 0, 0.65);
}

#Contact{
  background-color: rgba(255, 255, 255, 0.137);
}
.team_btn {
  position: relative;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
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

.neon-typo{
  color: #FFFFFF;
  text-shadow: 0px 4px 15px #FFF961, 0px 0px 10px #FFF961;
}
.GameName{
  font-family: "Vibure", cursive;
  font-style: normal;
}

.liveGame hr{
  display: block;
  position: relative;
  height: 2px;
  box-shadow: 0px 0px 10px #fff961, 0px 0px 15px 5px #fff961;
  opacity: 1;
  width: 90%;
  color: #fffed9;
  margin: auto;
  margin-top: 2vh;
}

th{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  width: 40%;
}

.versus{
  font-size: large;
  font-weight: bold;
}
.watch_player{
  font-size: large;
}

.watch_icon{
  color: var(--sidebar-icon-color);

}
.watch_icon:hover{
  transform: scale(1.5);
  transition: 0.4s;
}

th{
  padding:5px
}
</style>
