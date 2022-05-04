<script setup lang="ts">
	import Modale, { setting_open, login_open} from "./Modale.vue"

	defineProps < {
		isAuthenticated: boolean;
		loggedUser: any;
	} > ();

</script>

<script lang="ts">
</script>

<style>
	/* @import url("../assets/sidebarStyles.css"); */
</style>

<template>
	<div class="dropdown navbar_concat">
		<button class="btn_navbar" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="true">
			<i id="menu_icon" class="fa-solid fa-bars fa-2x"></i>
		</button>
		<ul class="dropdown-menu animation slideDownIn m-2" aria-labelledby="dropdownMenuButton1">
			<li>
				<router-link to="/" style="text-decoration: none; color: inherit;">
					<div class="container-fluid">
						<div class="row">
							<div class="col-5"><i class="fa-solid fa-house fa-2x p-2 icon_navbar"></i></div>
							<div class="col-5 pt-3 text-center"><span class="text_navbar"><b>Home</b></span></div>
						</div>
					</div>
				</router-link>
			</li>
			<li>
				<router-link to="/toto" style="text-decoration: none; color: inherit;">
					<div class="container-fluid">
						<div class="row">
							<div class="col-5"><i class="fa-solid fa-screwdriver-wrench fa-2x p-2 icon_navbar"></i></div>
							<div class="col-5 pt-3 text-center"><span class="text_navbar"><b>Toto</b></span></div>
						</div>
					</div>
				</router-link>
			</li>
			<li>
				<div v-if="!isAuthenticated" @click="login_open = !login_open">
					<div class="container-fluid">
						<div class="row">
							<div class="col-5"><i class="fa-solid fa-gamepad fa-2x p-2 icon_navbar"></i></div>
							<div class="col-5 pt-3 text-center"><span class="text_navbar"><b>Game</b></span></div>
						</div>
					</div>
				</div>
				<router-link v-else to="/game" style="text-decoration: none; color: inherit;">
					<div class="container-fluid">
						<div class="row">
							<div class="col-5"><i class="fa-solid fa-gamepad fa-2x p-2 icon_navbar"></i></div>
							<div class="col-5 pt-3 text-center"><span class="text_navbar"><b><b>Game</b></b></span></div>
						</div>
					</div>
				</router-link>
			</li>
			<li>
				<div v-if="!isAuthenticated" @click="login_open = !login_open">
					<div class="container-fluid">
						<div class="row">
							<div class="col-5"><i class="fa-solid fa-cat fa-2x p-2 icon_navbar"></i></div>
							<div class="col-5 pt-3 text-center"><span class="text_navbar"><b><b>Chat</b></b></span></div>
						</div>
					</div>
				</div>
				<router-link v-else to="/chat" style="text-decoration: none; color: inherit;">
					<div class="container-fluid">
						<div class="row">
							<div class="col-5"><i class="fa-solid fa-cat fa-2x p-2 icon_navbar"></i></div>
							<div class="col-5 pt-3 text-center"><span class="text_navbar"><b><b>Chat</b></b></span></div>
						</div>
					</div>
				</router-link>
			</li>
			<li>
				<router-link to="/debug" style="text-decoration: none; color: inherit;">
					<div class="container-fluid">
						<div class="row">
							<div class="col-5"><i class="fa-solid fa-bug fa-2x p-2 icon_navbar"></i></div>
							<div class="col-5 pt-3 text-center"><span class="text_navbar"><b>Debug</b></span></div>
						</div>
					</div>
				</router-link>
			</li>
			<li>
				<div v-if="!isAuthenticated" @click="login_open = !login_open">
					<div class="container-fluid">
						<div class="row">
							<div class="col-5"><i class="fa-solid fa-door-open fa-2x p-2 icon_navbar"></i></div>
							<div class="col-5 pt-3 text-center"><span class="text_navbar"><b><b>Login</b></b></span></div>
						</div>
					</div>
				</div>
				<div v-else @click="setting_open = !setting_open">
					<div class="container-fluid">
						<div class="row">
							<div class="col-5"><img class="circular--square icon_navbar" style="width: 50px;" v-bind:src=loggedUser.avatar alt="Avatar" /></div>
							<div class="col-5 pt-3 text-center"><span class="text_navbar"><b><b>Settings</b></b></span></div>
						</div>
					</div>
				</div>
			</li>
		</ul>
	</div>
	<Modale :isAuthenticated="isAuthenticated" :loggedUser="loggedUser"/>
</template>

<style scoped>
.navbar_concat{
	position: fixed;
	top: 5px;
	left: 5px;
	display: flex;
	z-index: 9999;
}
.btn_navbar{
	position: fixed;
	border: 0;
	border-radius: 25%;
	background-color: var(--sidebar-icon-color);
	min-height: 40px;
	min-width: 40px;
}

li .row .icon_navbar{
	transition: 0.4s;
}
li .row:hover .icon_navbar{
	transform: scale(1.3);
	color: #fffed4;
	filter:drop-shadow(0px 0px 5px #FFF961);
}


.animation {
  animation-duration: 0.1s;
  animation-fill-mode: both;
}
@keyframes slideDownIn {
  0% {
    transform: translateY(-20px);
	opacity: 0%;
  }
  100% {
    transform: translateY(40px);
	opacity: 100%;
  }
  0% {
    transform: translateY(-20px);
  }
}
.slideDownIn {
  animation-name: slideDownIn;
}

.dropdown-menu{
	background: radial-gradient(ellipse at top, #1b2735 0%, #080e21 95%);
	box-shadow: 0px 0px 10px 2px #fff961, inset 0px 0px 4px 2px #fff961;
	border: none;
	border-radius: 20px;
	overflow-y: auto;
	color: var(--sidebar-icon-color);
}

.text_navbar{
	font-family: "Vibure", cursive;
	color: white;
}

.navbar_concat ul li{
	cursor: pointer;
}
</style>

