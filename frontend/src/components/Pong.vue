<script>
	import ModalePlay from './ModalePlay.vue'

	export default {
		name: 'Pong',

		props: {
			msg: String,
			revelePlay: Boolean,
		},

		components: {
			'modale-play': ModalePlay, 
		},

		data: function() {
			return {
				canvas: { w: 1000, h: 600}, // à voir pour mettre juste un ratio et faire réactive
				paddle: {},
				bound: 25,
				player_L: {},
				player_R: {},
				ball: {},
			}
		},
		/*
		** 
		*/
		computed: {
			getPaddle: function () {
				this.paddle.h = 0.2 * this.canvas.h;
				this.paddle.w = 0.2 * this.paddle.h;
				// this.paddle.speed = 5;
				return (this.paddle);
			},
			getPlayerL: function() {
				this.player_L.x = this.bound;
				this.player_L.y = 0;
        this.player_L.Xmin = this.player_L.x
        this.player_L.Xmax = this.player_L.x + this.paddle.w;
				this.player_L.Ymin = this.player_L.y;
				this.player_L.Ymax = this.player_L.y + this.paddle.h;
				this.player_L.color = "blue";
				this.player_L.score = 0;
				return (this.player_L);
			},
			getPlayerR: function() {
				this.player_R.x = this.canvas.w - this.bound - this.paddle.w;
				this.player_R.y = 0;
				this.player_R.Xmin = this.player_R.x
        this.player_R.Xmax = this.player_R.x + this.paddle.w;
				this.player_R.Ymin = this.player_R.y;
				this.player_R.Ymax = this.player_R.y + this.paddle.h;
				this.player_R.color = "pink";
				this.player_R.score = 0;
				return (this.player_R);
			},
			getBall: function() {
				this.ball.x = this.canvas.w / 2;
				this.ball.y = this.canvas.h / 2;
				this.ball.Xmin = this.ball.x
        this.ball.Xmax = this.ball.x + this.paddle.w;
				this.ball.Ymin = this.ball.y;
				this.ball.Ymax = this.ball.y + this.paddle.w;
				this.ball.size = this.paddle.w;
				this.ball.color = "yellow";
				this.ball.speed = 5;
				this.ball.velocityX = 5;
				this.ball.velocityY = 5; //velocity = speed & dir
				return (this.ball);
			},
		},
		/*
		** 
		*/
		created() {
			window.addEventListener('keydown', this.move); //keypress does not work for arrows
		},
		mounted() {
			let gamePaddle = this.getPaddle;
			let playerLeft = this.getPlayerL;
			let playerRight = this.getPlayerR;
			let gameBall = this.getBall;

			this.render(playerLeft, playerRight);
		},
		destroyed() {
			window.removeEventListener('keydown', this.move);
		},
		/*
		** 
		*/
		methods: {
			move(e) {
				if (e.keyCode == 37)
					this.moveLeft();
				else if (e.keyCode == 39)
					this.moveRight();
			},
			game: function() {
				this.render(this.getPlayerL, this.getPlayerR);
			},
			launch: function() {
				setInterval(this.game(), 1000/50)
				// this.game();
			},
			render: function(leftPlayer, rightPlayer) {
				this.drawPlayer(leftPlayer, this.getPaddle);
				this.drawPlayer(rightPlayer, this.getPaddle);
				// this.drawPlayer(this.getPlayerL, this.getPaddle);
				// this.drawPlayer(this.getPlayerR, this.getPaddle);
				this.drawBall(this.getBall);
        this.drawScore(leftPlayer, rightPlayer);
			},
			// update: function() {
			// 		// this.$set(this.getBall.x, 10);
			// 		// this.getBall.x += this.getBall.velocityX;
			// 		// this.getBall.y += this.getBall.velocityY;
			// 		// if (this.getBall.y + this.getBall.size > this.canvas.h ||
			// 		// 		this.getBall.y - this.getBall.size < 0)
			// 		// this.getBall.velocityY *= -1;
			// 		// console.log("UPDATE x: " + this.getBall.pos.x + " y: " + this.getBall.pos.y);
			// },
			// collision: function() {
			// 	if (this.ball.ballPos.x < (this.canvas.w / 2)) { //left player collision

			// 	}
			// 	else

					
			// },

			drawPlayer: function(player, paddle) {
				let canvas = document.getElementById('Pong');
				if (canvas.getContext) {
					let context = canvas.getContext('2d');
					context.fillStyle = player.color;
					context.fillRect(player.x, player.y, paddle.w, paddle.h);
				}
			},
			drawBall: function() {
				let canvas = document.getElementById('Pong');
				if (canvas.getContext) {
					let context = canvas.getContext('2d');
					context.fillStyle="yellow";
					context.arc(this.ball.x, this.ball.y, this.ball.size, 0, Math.PI*2, false);
					context.fill();
				}
			},
			drawScore: function(leftPlayer, rightPlayer) {
				let canvas = document.getElementById('Pong');
				if (canvas.getContext) {
					let context = canvas.getContext('2d');
					context.fillStyle = "yellow";
					let size = 0.2 * this.canvas.h; // diff let/var
					context.font = size + "px Impact";
					let xLeft = this.canvas.w/4;
					let xRight = 3 * this.canvas.w/4 - (size/2);
					context.fillText(leftPlayer.score, xLeft, this.canvas.h/5);
					context.fillText(rightPlayer.score, xRight, this.canvas.h/5);
				}
			},
			moveRight: function() {
				if (this.player_L.y + this.paddle.h + 5 <= this.canvas.h) {
					this.player_L.y += 5;
				}
				let canvas = document.getElementById('Pong');
				if (canvas.getContext) {
					let context = canvas.getContext('2d');
					// context.fillStyle = "blue";
					context.clearRect(0, 0, this.canvas.w, this.canvas.h);
					this.render(this.player_L, this.player_R);
				}
			},
			moveLeft: function() {
				if (this.player_L.y - 5 >= 0) {
					this.player_L.y -= 5;
				}
				let canvas = document.getElementById('Pong');
				if (canvas.getContext) {
					let context = canvas.getContext('2d');
					// context.fillStyle = "blue";
					context.clearRect(0, 0, this.canvas.w, this.canvas.h);
					this.render(this.player_L, this.player_R);
				}
			},
		},
	}
</script>

<template>
	<div class=PongGame>
				<!-- {{ revelePlay }} -->
		<canvas ref="Pong" class="Pong" id="Pong" :width="canvas.w" :height="canvas.h" v-on:click="launch"> </canvas>
				<!-- <input v-on:keyup.enter="draw()"> -->
				<!-- <canvas ref="Pong" class="Pong" id="Pong" :w=750 :h=500 v-on:click="draw"> {{ revelPlay }} </canvas> -->
				<!-- <button v-on:click="moveLeft"> P2: Left </button> -->
				<!-- <button v-on:click="moveRight"> P2: Right </button> -->

				<!-- <input @keyup.left="moveLeft" style="display: none;">
				<input @keyup.right="moveRight" style="display: none;">  -->
				<!-- 
				-->
<!--       

				<button class="UpAndDown" v-on:click="draw"> - </button> -->
	</div>
</template>

<style scoped>
.PongGame {
	align-items: center;
	justify-content: center;

}
.Pong {
	background: #0C2039;
	border: 7.5px solid #FFF961;
	margin: 
	/* justify-content: center; */
}
</style>

