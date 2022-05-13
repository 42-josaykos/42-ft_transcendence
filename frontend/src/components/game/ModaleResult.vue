<script>
import { mapState } from "pinia";
import { useUserStore } from "@/stores/user";
export default {
	name: "ModaleResult",
	data: function () {
		return {
			result: {},
			duo: {}, //duo[0] is LEFT, duo[1] is RIGHT
		};
	},
	props: ["player_L", "player_R"],
	computed: {
		...mapState(useUserStore, ["loggedUser", "playersDuo"]),
		getResult: function() {
			if (this.loggedUser.username == this.duo[0].username) { // loggedUser est a gauche
				
				if (this.player_L.score == 10)
					this.result = true;
				else
					this.result = false;
			}
			else {
				if (this.player_R.score == 10)
					this.result = true;
				else
					this.result = false;
			}
			return (this.result);
		},
	},
	created() {
		console.log("HERE");
		console.log(this.endgame);
		this.duo = this.playersDuo;
		this.getResult;
		console.log("HERE");
		return ;
	},
};
</script>

<template>
    <!-- <div v-if="active_result"> -->
        <div class="bloc_modale_result">
            <div class="overlay_result" @click="active_result = false"></div>
            <div class="modale_result card" @click="active_result = false">
                <span v-if="this.result" class="shiny">
                    <span class="inner-shiny">YOU WIN</span>
                </span>
                <p v-else class="glitch">
                    <span aria-hidden="true">YOU LOOSE</span>
                    YOU LOOSE
                    <span aria-hidden="true">YOU LOOSE</span>
                </p>
            </div>
        </div>
    <!-- </div> -->
</template>
 
<style scoped>
.shiny
{
    color: #F5C21B;
    background: -webkit-gradient(linear, left top, left bottom, from(#F5C21B), to(#D17000));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    display: inline-block;
    font-family: "Source Sans Pro", sans-serif;
    font-size: 8rem;
    font-weight: 900;
    position: relative;
    text-transform: uppercase;
}
 
.shiny::before
{
    background-position: -180px;
    -webkit-animation: flare 5s infinite;
    -webkit-animation-timing-function: linear;
    background-image: linear-gradient(65deg, transparent 20%, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.3) 27%, transparent 27%, transparent 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    /* content: "YOU WIN"; */
    white-space: pre-line;
    color: #FFF;
    display: block;
    padding-right: 140px;
    position: absolute;
}
 
.shiny::after
{
    /* content: "YOU WIN"; */
    color: #FFF;
    display: block;
    position: absolute;
    text-shadow: 0 1px #6E4414, 0 2px #6E4414, 0 3px #6E4414, 0 4px #6E4414, 0 5px #6E4414, 0 6px #6E4414, 0 7px #6E4414, 0 8px #6E4414, 0 9px #6E4414, 0 10px #6E4414;
    top: 0;
    z-index: -1;
}
 
.inner-shiny::after, .inner-shiny::before
{
    -webkit-animation: sparkle 2s infinite;
    -webkit-animation-timing-function: linear;
    background: #FFF;
    border-radius: 100%;
    box-shadow: 0 0 5px #FFF, 0 0 10px #FFF, 0 0 15px #FFF, 0 0 20px #FFF, 0 0 25px #FFF, 0 0 30px #FFF, 0 0 35px #FFF;
    content: "";
    display: block;
    height: 10px;
    opacity: 0.7;
    position: absolute;
    width: 10px;
}
 
.inner-shiny::before
{
    -webkit-animation-delay: 0.2s;
    height: 7px;
    left: 0.12em;
    top: 0.8em;
    width: 7px;
}
 
.inner-shiny::after
{
    top: 0.32em;
    right: -5px;
}
 
@-webkit-keyframes flare
{
    0%   { background-position: -180px; }
    30% { background-position: 500px; }
    100% { background-position: 500px; }
}
 
@-webkit-keyframes sparkle
{
    0%   { opacity: 0; }
    30% { opacity: 0; }
    40% { opacity: 0.8; }
    60% { opacity: 0; }
    100% { opacity: 0; }
}
.glitch{
    color: white;
        font-size: 7rem;
        font-weight: bold;
        text-transform: uppercase;
        position: relative;
 
        text-shadow:
                0.05em 0 0 rgba(0, 0, 255, 0.75),
                -0.025em -0.05em 0 #FFF961,
                0.025em 0.05em 0 #FF83BA;
 
        animation: glitch 500ms infinite;
}
 
.glitch span{
        position: absolute;
        top: 0;
        left: 0;
}
 
.glitch span:first-child{
        animation: glitch 650ms infinite;
        clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
        transform: translate(-.05em, -0.0125em);
        opacity: 0.8;
}
.glitch span:last-child{
        animation: glitch 375ms infinite;
        clip-path: polygon(0 60%, 100% 60%, 100% 100%, 0 100%);
        transform: translate(0.0125em, 0.025em);
        opacity: 0.8;
}
 
@keyframes glitch{
        0%{
                text-shadow:
                0.05em 0 0 rgba(0, 0, 255, 0.75),
                -0.05em -0.025em 0 #FFF961,
                -0.025em 0.05em 0 #FF83BA;
        }
        14%{
                text-shadow:
                0.05em 0 0 rgba(0, 0, 255, 0.75),
                -0.05em -0.025em 0 #FFF961,
                -0.025em 0.05em 0 #FF83BA;
        }
        15%{
                text-shadow:
                -0.05em -0.025em 0 rgba(0, 0, 255, 0.75),
                0.025em 0.025em 0 #FFF961,
                -0.05em -0.05em 0 #FF83BA;
        }
        49%{
                text-shadow:
                -0.05em -0.025em 0 rgba(0, 0, 255, 0.75),
                0.025em 0.025em 0 #FFF961,
                -0.05em -0.05em 0 #FF83BA;
        }
        50%{
                text-shadow:
                0.025em 0.05em 0 rgba(0, 0, 255, 0.75),
                0.05em 0 0 #FFF961,
                0 -0.05em 0 #FF83BA;
        }
        99%{
                text-shadow:
                0.025em 0.05em 0 rgba(0, 0, 255, 0.75),
                0.05em 0 0 #FFF961,
                0 -0.05em 0 #FF83BA;
        }
        100%{
                text-shadow:
                -0.025em 0 0 rgba(0, 0, 255, 0.75),
                -0.025em -0.025em 0 #FFF961,
                -0.025em -0.05em 0 #FF83BA;
        }
}
 
@media (prefers-reduced-motion: reduce) {
        *,::before, ::after{
                animation-delay: -1ms !important;
                animation-duration: 1ms !important;
                animation-iteration-count: 1 !important;
                background-attachment: initial !important;
                scroll-behavior: auto !important;
                transition-duration: 0s !important;
                transition-delay: 0s !important;
        }
}
.test_btn{
    width: 200px;
    height: 100px;
    border-radius: 10px;
    font-size: 40px;
}
 
.bloc_modale_result {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    animation: fadeInAnimation ease 1s;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
}
 
.bloc_modale_result .overlay_result {
    background-color: rgba(0, 0, 0, 0.5);
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 1;
}
 
.bloc_modale_result .modale_result {
    background: rgba(0, 0, 0, 0);
    border: none;
    padding: 30px;
    position: fixed;
    opacity: 1;
}
 
@keyframes fadeInAnimation {
    0% {
    opacity: 0;
    }
    100% {
    opacity: 1;
    }
}
</style>