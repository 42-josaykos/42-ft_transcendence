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
		// COMPUTED DATA
		computed: {
			getPaddle: function () {
				this.paddle.h = 0.2 * this.canvas.h;
				this.paddle.w = 0.2 * this.paddle.h;
				this.paddle.speed = 10;
				return (this.paddle);
			},
			getPlayerL: function() {
				this.player_L.x = this.bound;
				this.player_L.y = 0;
				this.player_L.color = "blue";
				this.player_L.score = 0;
				return (this.player_L);
			},
			getPlayerR: function() {
				this.player_R.x = this.canvas.w - this.bound - this.paddle.w;
				this.player_R.y = 0;
				this.player_R.color = "pink";
				this.player_R.score = 0;
				return (this.player_R);
			},
			getBall: function() {
				this.ball.x = this.canvas.w / 2;
				this.ball.y = this.canvas.h / 2;
				this.ball.size = this.paddle.w;
				this.ball.color = "yellow";
				this.ball.speed = 7;
				this.ball.velocityX = 1 * this.ball.speed;
				this.ball.velocityY = 1 * this.ball.speed; //velocity = speed & dir
				return (this.ball);
			},
		},
		// LIFECYCLE HOOKS
		created() {
			window.addEventListener('keydown', this.move);
			return ; //keypress does not work for arrows
		},
		mounted() {
			let gamePaddle = this.getPaddle;
			let leftPlayer = this.getPlayerL;
			let rightPlayer = this.getPlayerR;
			let gameBall = this.getBall;
			this.render();
			this.launch();
			return ;
		},
		destroyed() {
			window.removeEventListener('keydown', this.move);
			return ;
		},
		// METHODS
		methods: {
			launch: function() {
				const framePerSec = 50;
				if (this.gameplay == false) {
					this.gameplay = true;
				}
				setInterval(this.game, 1000/framePerSec);
				return ;
			},
			game: function() {
				this.update();
				let canvas = document.getElementById('Pong');
				if (canvas.getContext) {
					let context = canvas.getContext('2d');
					context.clearRect(0, 0, this.canvas.w, this.canvas.h);
				}
				this.render();
				return ;
			},
			// ELEMENTS RENDERING
			render: function() {
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
			drawBall: function() {
				let canvas = document.getElementById('Pong');
				if (canvas.getContext) {
					let context = canvas.getContext('2d');
					context.fillStyle = "yellow";
					context.beginPath();
					context.arc(this.ball.x, this.ball.y, this.ball.size, 0, Math.PI*2, false);
					context.closePath();
					context.fill();
				}
				return ;
			},
			drawScore: function(leftPlayer, rightPlayer) {
				let canvas = document.getElementById('Pong');
				if (canvas.getContext) {
					let context = canvas.getContext('2d');
					let size = 0.2 * this.canvas.h;
					context.font = size + "px Impact";
					let xLeft = this.canvas.w/4;
					let xRight = 3 * this.canvas.w/4 - (size/2);

					context.fillStyle = "green";
					context.fillText(leftPlayer.score, xLeft, this.canvas.h/5);
					context.fillText(rightPlayer.score, xRight, this.canvas.h/5);
				}
				return ;
			},
			// KEYBOARD EVENT MANAGEMENT
			move(event) {
				if (event.keyCode == 37)
					this.moveLeft();
				else if (event.keyCode == 39)
					this.moveRight();
				return ;
			},
			moveRight: function() {
				let oldY = this.player_L.y;
				if (this.player_L.y + this.paddle.h + this.paddle.speed <= this.canvas.h) {
					this.player_L.y += this.paddle.speed;
				}
				return ;
			},
			moveLeft: function() {
				let oldY = this.player_L.y;
				if (this.player_L.y - this.paddle.speed >= 0) {
					this.player_L.y -= this.paddle.speed;
				}
				return ;
			},
			// UPDATING DATA AND ADJUSTING
			update: function() {
				this.runWild();

				if (this.ball.Xmax >= this.canvas.w || this.ball.Xmin <= 0)
					this.updateScore();
				if (this.ball.Ymax >= this.canvas.h || this.ball.Ymin <= 0)
					this.ball.velocityY *= -1;

				let player = (this.ball.x + this.ball.size < this.canvas.w/2) ? this.player_L : this.player_R;
				if (this.collision(this.ball, player))
					this.updateVelocity(player);
				return ;
			},
			updateVelocity: function(player) {
				let collisionPoint = (this.ball.y - (player.y + this.paddle.h/2));
				collisionPoint = collisionPoint / (this.paddle.h/2);
			
				let angleRad = (Math.PI/4) * collisionPoint;
				let direction = (this.ball.x + this.ball.size < this.canvas.w/2) ? 1 : -1;
				
				this.ball.velocityX = direction * this.ball.speed * Math.cos(angleRad);
				this.ball.velocityY = this.ball.speed * Math.sin(angleRad);
				return ;
			},
			updateScore: function() {
				if (this.ball.Xmin <= 0)
					this.player_R.score++;
				else
					this.player_L.score++;
				this.resetBall();
				return ;
			},
			resetBall: function() {
				this.ball.x = this.canvas.w / 2;
				this.ball.y = this.canvas.h / 2;
				this.ball.velocityX *= -1;				

			},
			runWild: function() {
				this.ball.x += this.ball.velocityX;
				this.ball.y += this.ball.velocityY;

				this.ball.Xmin = this.ball.x - this.ball.size;
				this.ball.Xmax = this.ball.x + this.ball.size;
				this.ball.Ymin = this.ball.y - this.ball.size;
				this.ball.Ymax = this.ball.y + this.ball.size;
				return ;
			},
			collision: function (ball, player){
				player.Xmin = player.x;
      	player.Xmax = player.x + this.paddle.w;
				player.Ymin = player.y;
				player.Ymax = player.y + this.paddle.h;

				ball.Xmin = ball.x - ball.size;
				ball.Xmax = ball.x + ball.size;
				ball.Ymin = ball.y - ball.size;
				ball.Ymax = ball.y + ball.size;

				return (player.Xmin < ball.Xmax && player.Ymin < ball.Ymax && player.Xmax > ball.Xmin && player.Ymax > ball.Ymin);
			},
		}
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

