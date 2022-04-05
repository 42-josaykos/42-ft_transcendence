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
				canvas: { w: 1000, h: 600 }, // à voir pour mettre juste un ratio et faire réactive
				paddle: {},
				bound: 25,
				player_L: {},
				player_R: {},
				ball: {},

				gameplay: false,
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
				this.ball.speed = 15;
				this.ball.velocityX = 15;
				this.ball.velocityY = 15; //velocity = speed & dir
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
			let leftPlayer = this.getPlayerL;
			let rightPlayer = this.getPlayerR;
			let gameBall = this.getBall;

			this.render();
			// this.launch(leftPlayer, rightPlayer);
			this.launch();

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
			launch: function() {
				if (this.gameplay == false) {
					this.gameplay = true;
				}
				setInterval(this.game, 2000);
			},
			game: function() {
				this.update();
				// this.render();
				return ;
			},

			update: function()
			{
				this.runWild();
				return ;
			},
			render: function() {
				console.log("Good morning!");
				this.drawPlayerLeft(this.getPaddle);
				this.drawPlayerRight(this.getPaddle);
				this.drawBall();
        this.drawScore(this.player_L, this.player_R);
				return ;
			},
			drawPlayerLeft: function(paddle) {
				let canvas = document.getElementById('Pong');
				if (canvas.getContext) {
					let context = canvas.getContext('2d');
					context.fillStyle = this.player_L.color;
					context.fillRect(this.player_L.x, this.player_L.y, paddle.w, paddle.h);
				}
				return ;
			},
			drawPlayerRight: function(paddle) {
				let canvas = document.getElementById('Pong');
				if (canvas.getContext) {
					let context = canvas.getContext('2d');
					context.fillStyle = this.player_R.color;
					context.fillRect(this.player_R.x, this.player_R.y, paddle.w, paddle.h);
				}
				return ;
			},
			// drawPlayer: function(player, paddle) {
			// 	let canvas = document.getElementById('Pong');
			// 	if (canvas.getContext) {
			// 		let context = canvas.getContext('2d');
			// 		context.fillStyle = player.color;
			// 		context.fillRect(player.x, player.y, paddle.w, paddle.h);
			// 	}
			// },
			drawBall: function() {
				let canvas = document.getElementById('Pong');
				if (canvas.getContext) {
					let context = canvas.getContext('2d');
					context.fillStyle = "yellow";
					context.arc(this.ball.x, this.ball.y, this.ball.size, 0, Math.PI*2, false);
					context.fill();
				}
				return ;
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
				return ;
			},
			moveRight: function() {
				let oldY = this.player_L.y; // ne recourvir que le paddle ?
				if (this.player_L.y + this.paddle.h + 5 <= this.canvas.h) {
					this.player_L.y += 5;
				}
				let canvas = document.getElementById('Pong');
				if (canvas.getContext) {
					let context = canvas.getContext('2d');
					// context.clearRect(0, 0, this.canvas.w, this.canvas.h);
					context.clearRect(this.player_L.x, oldY, this.paddle.w, this.paddle.h);
					this.drawPlayerLeft(this.paddle);
					// this.render();
				}
				return ;
			},
			moveLeft: function() {
				let oldY = this.player_L.y;
				if (this.player_L.y - 5 >= 0) {
					this.player_L.y -= 5;
				}
				let canvas = document.getElementById('Pong');
				if (canvas.getContext) {
					let context = canvas.getContext('2d');
					// context.clearRect(0, 0, this.canvas.w, this.canvas.h);
					context.clearRect(this.player_L.x, oldY, this.paddle.w, this.paddle.h);
					this.drawPlayerLeft(this.paddle);
					// this.render();
				}
				return ;
			},
			runWild: function() {
				this.ball.x += this.ball.velocityX;
				this.ball.y += this.ball.velocityY;
			
				let canvas = document.getElementById('Pong');
				if (canvas.getContext) {
					let context = canvas.getContext('2d');
					// context.clearRect(0, 0, this.canvas.w, this.canvas.h);
					// this.render();
				}
				return ;
			},
		},
	}
</script>

<template>
	<div class=PongGame>
				<!-- {{ revelePlay }} -->
		<canvas ref="Pong" class="Pong" id="Pong" :width="canvas.w" :height="canvas.h"> </canvas>
		<!-- <canvas ref="Pong" class="Pong" id="Pong" :width="canvas.w" :height="canvas.h" v-on:click="launch"> </canvas> -->
		
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

