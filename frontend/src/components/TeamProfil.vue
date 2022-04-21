<script setup lang="ts">

	defineProps < {
		profil_vmoreau: boolean;
		profil_mabriand: boolean;
		profil_josaykos: boolean;
		profil_lchapren: boolean;
		profil_adupuy: boolean;
	} > ();

	const emit = defineEmits (["close_vm", "close_mb", "close_js", "close_lc", "close_ad"])

</script>

<template>
	<div class="bloc_modale" v-if="profil_vmoreau">
		<div class="overlay" @click="$emit('close_vm')"></div>
		<div class="modale card"  style="min-width: 40vw;">
			<div class="container-fluid">
				<div class="row">
					<div class="col-md-6"><img src="../assets/vmoreau.jpeg" width="200" style="border-radius: 30%;" alt="vmoreau"></div>
					<div class="col-md-6 ml-auto">
						<h2>Victor Moreau</h2>
						<br>
						<button class="mod-btn mod-btn-blue" style="margin: -10px 0 10px;" onclick=" window.open('https://profile.intra.42.fr/users/vmoreau','_blank')">
							<img src="../assets/42_Logo.svg" style="color: black; width: 30px;"/> Intra vmoreau
						</button>
						<br>
						<button class="mod-btn mod-btn-cyan" style="margin: 10px 0 -10px;" onclick=" window.open('https://github.com/Dicayne','_blank')">
							<i class="fa-brands fa-github" style="color: black;"></i> Github Dicayne
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="bloc_modale" v-if="profil_mabriand">
		<div class="overlay" @click="$emit('close_mb')"></div>
		<div class="modale card"  style="min-width: 40vw;">
			<div class="container-fluid">
				<div class="row">
					<div class="col-md-6"><img src="../assets/default-avatar.jpeg" width="200" style="border-radius: 30%;" alt="vmoreau"></div>
					<div class="col-md-6 ml-auto">
						<h2>Marie Briand</h2>
						<br>
						<button class="mod-btn mod-btn-blue" style="margin: -10px 0 10px;" onclick=" window.open('https://profile.intra.42.fr/users/mabriand','_blank')">
							<img src="../assets/42_Logo.svg" style="color: black; width: 30px;"/> Intra mabriand
						</button>
						<br>
						<button class="mod-btn mod-btn-cyan" style="margin: 10px 0 -10px;" onclick=" window.open('https://github.com/mabriand-42','_blank')">
							<i class="fa-brands fa-github" style="color: black;"></i> Github mabriand-42
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="bloc_modale" v-if="profil_josaykos">
		<div class="overlay" @click="$emit('close_js')"></div>
		<div class="modale card"  style="min-width: 40vw;">
			<div class="container-fluid">
				<div class="row">
					<div class="col-md-6"><img src="../assets/default-avatar.jpeg" width="200" style="border-radius: 30%;" alt="vmoreau"></div>
					<div class="col-md-6 ml-auto">
						<h2>Johnny Saykos</h2>
						<br>
						<button class="mod-btn mod-btn-blue" style="margin: -10px 0 10px;" onclick=" window.open('https://profile.intra.42.fr/users/josaykos','_blank')">
							<img src="../assets/42_Logo.svg" style="color: black; width: 30px;"/> Intra josaykos
						</button>
						<br>
						<button class="mod-btn mod-btn-cyan" style="margin: 10px 0 -10px;" onclick=" window.open('https://github.com/josayko','_blank')">
							<i class="fa-brands fa-github" style="color: black;"></i> Github josayko
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="bloc_modale" v-if="profil_lchapren">
		<div class="overlay" @click="$emit('close_lc')"></div>
		<div class="modale card" style="min-width: 40vw;">
			<div class="container-fluid">
				<div class="row">
					<div class="col-md-6"><img src="../assets/default-avatar.jpeg" width="200" style="border-radius: 30%;" alt="vmoreau"></div>
					<div class="col-md-6 ml-auto">
						<h2>Lena Chapren</h2>
						<br>
						<button class="mod-btn mod-btn-blue" style="margin: -10px 0 10px;" onclick=" window.open('https://profile.intra.42.fr/users/lchapren','_blank')">
							<img src="../assets/42_Logo.svg" style="color: black; width: 30px;"/> Intra lchapren
						</button>
						<br>
						<button class="mod-btn mod-btn-cyan" style="margin: 10px 0 -10px;" onclick=" window.open('https://github.com/Ourobore','_blank')">
							<i class="fa-brands fa-github" style="color: black;"></i> Github Ourobore
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="bloc_modale" v-if="profil_adupuy">
		<div class="overlay" @click="$emit('close_ad')"></div>
		<div class="modale card"  style="min-width: 40vw;">
			<div class="container-fluid">
				<div class="row">
					<div class="col-md-6"><img src="../assets/default-avatar.jpeg" width="200" style="border-radius: 30%;" alt="vmoreau"></div>
					<div class="col-md-6 ml-auto">
						<h2>Athenais Dupuy</h2>
						<br>
						<button class="mod-btn mod-btn-blue" style="margin: -10px 0 10px;" onclick=" window.open('https://profile.intra.42.fr/users/adupuy','_blank')">
							<img src="../assets/42_Logo.svg" style="color: black; width: 30px;"/> Intra adupuy
						</button>
						<br>
						<button class="mod-btn mod-btn-cyan" style="margin: 10px 0 -10px;" onclick=" window.open('https://github.com/AtheDev','_blank')">
							<i class="fa-brands fa-github" style="color: black;"></i> Github AtheDev
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
