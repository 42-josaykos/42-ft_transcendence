<script setup lang="ts">

defineProps < {
	isAuthenticated: boolean;
	loggedUser: any;
} > ();


</script>

<style>
	@import url("../assets/sidebarStyles.css");
</style>

<template>
	<div class="sidebar">
		<li class="list">
			<router-link to="/" >
				<a href="#">
					<span class="icon"><i class="fa-solid fa-house fa-2x"></i></span>
					<span class="text"><b>Home</b></span>
				</a>
			</router-link>
		</li>
		<li class="list">
			<router-link to="/toto" >
				<a href="#">
					<span class="icon"><i class="fa-solid fa-screwdriver-wrench fa-2x"></i></span>
					<span class="text"><b>Toto</b></span>
				</a>
			</router-link>
		</li>
		<li class="list">
			<router-link to="/game" >
				<a href="#">
					<span class="icon"><i class="fa-solid fa-gamepad fa-2x"></i></span>
					<span class="text"><b>Game</b></span>
				</a>
			</router-link>
		</li>
		<li class="list">
			<router-link to="/chat" >
				<a href="#">
					<span class="icon"><i class="fa-solid fa-cat fa-2x"></i></span>
					<span class="text"><b>Chat</b></span>
				</a>
			</router-link>
		</li>
		<li class="list">
			<router-link to="/debug" >
				<a href="#">
					<span class="icon"><i class="fa-solid fa-bug fa-2x"></i></span>
					<span class="text"><b>Debug</b></span>
				</a>
			</router-link>
		</li>
		<li class="list">
			<router-link to="/setting" >
				<a href="#">
					<span class="icon"><i class="fa-solid fa-gear fa-2x"></i></span>
					<span class="text"><b>Setting</b></span>
				</a>
			</router-link>
		</li>
		<li class="list end">
			<router-link to="/login" >
				<a href="#">
					<span class="icon" v-if="!isAuthenticated"><i class="fa-solid fa-door-open fa-2x"></i></span>
					<span class="icon" v-else><img class="circular--square" v-bind:src=loggedUser.avatar alt="Avatar" /></span>

					<span class="text" v-if="!isAuthenticated"><b>Login</b></span>
					<span class="text logout" v-else><b>Logout</b></span>
				</a>
			</router-link>
		</li>
		<div id="indicator" class="indicator"></div>
	</div>
</template>
