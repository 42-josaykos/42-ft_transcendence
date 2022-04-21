<script>
    import PowerUps from './PowerUps.vue'
    
    export default {
        name: 'ModaleSettings',
        // data() {
        //     return {
        //     }
        // },
		components: {
			'powerups': PowerUps,
		},
        // props: ['reveleSettings', 'toggleModaleSettings'],
        props: ['revelePlay', 'toggleModaleSettings_1', 'launch'],
        methods: {
			updatePaddleSize: function(variable) {
				this.paddleSize = variable;
				
                // console.log("ModaleSettings updated, now emitting from ModaleSettings to parent Game");
                // console.log("paddleSize : " + this.paddleSize);
				this.$emit('paddleSizeChange', this.paddleSize);
			},
            updateBallSpeed: function(variable) {
				this.ballSpeed = variable; 

				// console.log("ModaleSettings updated, now emitting from ModaleSettings to parent Game");
				// console.log("ballSpeed : " + this.ballSpeed);
				this.$emit('ballSpeedChange', this.ballSpeed);
			}
		},
    }
</script>

<template>
<div>
    <!-- <div class="bloc-modale" v-if="reveleSettings">
        <div class="overlay" v-on:click="toggleModaleSettings"></div> -->
    <!-- <div class="bloc-modale" v-if="!revelePlay" v-on:click="toggleModaleSettings_1"> -->
    <div class="bloc-modale" v-if="!revelePlay">
        <!-- <div class="overlay" v-on:click="toggleModaleSettings_1"></div> -->
        <div class="overlay"></div> <!-- canvas ? -->
        <div class="modale card">
            <div class=Modale_Header>
                <div class="btn-modale btn btn-danger" v-on:click="toggleModaleSettings_1">X</div>
                <h1> Choose your features... </h1>
            </div>  
            <powerups class=Powerups @paddleSizeChange="updatePaddleSize" @ballSpeedChange="updateBallSpeed"></powerups>
        </div>
    </div>
</div>
</template>

<style>
.Powerups {
    width: 100%
}
.bloc-modale {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    /* width: 100%;
    height: 100%; pose pas pb noramelemnt vu qu'avec top, bottom etc on lui a deja dit de prendre toute la place */
    display: flex;
    justify-content: center;
    align-items: center;
}

.overlay {
    background: rgba(0,0,0,0.5);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

.modale {
    background: #f1f1f1;
    color: #333;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0px;
    position: fixed;
    top: 0%;
}

.card {
  padding: 0;
}

.btn-modale {
    position: absolute;
    top: 10px;
    right: 10px;
}

.Modale_Header {
    font-size: 10px;
    font-size-adjust: none;
}
</style>