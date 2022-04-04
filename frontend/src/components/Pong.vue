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
				canvas: { width: 750, height: 500 },
				paddle: { width: 15, height: 100 },
				bound: 25,
				
				leftPos: {},
				rightPos: {},
				ballPos: {},

				paddle: {},
				leftPlayer: {},
				rightPlayer: {},
				ball: {},
			}
		},
		
		computed: {
			getPaddle: function() {
				this.paddle.height = 0.2*this.canvas.height;
				this.paddle.width = 0.15*this.paddle.height;
				return this.paddle;
			},
			getLeftPos: function() {
				this.leftPos.x = this.bound;
				this.leftPos.y = 0;
				return this.leftPos;
			},
			getRightPos: function() {
				this.rightPos.x = this.canvas.width - this.bound - this.paddle.width;
				this.rightPos.y = 0;
				return this.rightPos;
			},
			getBallPos: function() {
				this.ballPos.x = this.canvas.width / 2 - this.paddle.width / 2;
				this.ballPos.y = this.canvas.height / 2 - this.paddle.width / 2;
				return this.ballPos;
			},
			getLeftPlayer: function() {
				this.leftPlayer.paddle = this.getPaddle;
				this.leftPlayer.xBound = this.bound;
				this.leftPlayer.color = "red";
				this.leftPlayer.position = this.getLeftPos;
				this.leftPlayer.score = 0;
				return this.leftPlayer;
			},
			getRightPlayer: function() {
				this.rightPlayer.paddle = this.getPaddle;
				this.rightPlayer.xBound = 710;
				this.rightPlayer.color = "red";
				this.rightPlayer.position = this.getRightPos;
				this.rightPlayer.score = 0;
				return this.rightPlayer;
			},
			getBall: function() {
				this.ball.size = this.paddle.width;
				this.ball.color = "yellow";
				this.ball.position = this.getBallPos;
				return this.ball;
			},
		},


		created() {
			window.addEventListener('keydown', this.doCommand); //keypress does not work for arrows
		},
		mounted() {
			this.draw();
		},
		destroyed() {
			window.removeEventListener('keydown', this.doCommand);
		},





		methods: {
			doCommand(e) {
				if (e.keyCode == 37)
				{
					console.log("37 leeeeeft");
					this.moveLeft();
				}
				else if (e.keyCode == 39)
				{   
					console.log("39 riiiight");   
					this.moveRight();
				}
			},
			draw: function() {
				console.log("HEM ???");
				this.drawLeftPlayer();
				this.drawRightPlayer();
				this.drawBall();
			},
			drawBall: function() {
				var canvas = document.getElementById('Pong');
				if (canvas.getContext) {
					var context = canvas.getContext('2d');
					context.fillStyle="yellow";
					context.arc(this.getBall.position.x, this.getBall.position.y, this.getBall.size, 0, Math.PI*2, false);
					context.fill();
				}
			},
			drawLeftPlayer: function() {
				var canvas = document.getElementById('Pong');
				if (canvas.getContext) {
					var context = canvas.getContext('2d');
					context.fillStyle="red";
					context.fillRect(this.getLeftPlayer.position.x, this.getLeftPlayer.position.y, this.getLeftPlayer.paddle.width, this.getLeftPlayer.paddle.height);
				}
			},
			drawRightPlayer: function() {
				var canvas = document.getElementById('Pong');
				if (canvas.getContext) {
					var context = canvas.getContext('2d');
					context.fillStyle="pink";
					context.fillRect(this.getRightPlayer.position.x, this.getRightPlayer.position.y, this.getRightPlayer.paddle.width, this.getRightPlayer.paddle.height);
				}
			},
			moveRight: function() {
				if (this.rightPlayer.position.y + this.rightPlayer.paddle.height + 5 <= this.canvas.height)
					this.rightPlayer.position.y += 5;

				var canvas = document.getElementById('Pong');
				if (canvas.getContext) {
					var context = canvas.getContext('2d');
					context.fillStyle="pink";
					context.clearRect(0, 0, this.canvas.width, this.canvas.height);
					context.fillRect(this.rightPlayer.position.x, this.rightPlayer.position.y, this.rightPlayer.paddle.width, this.rightPlayer.paddle.height);
					this.drawLeftPlayer();
					this.drawBall();
				}
			},
			moveLeft: function() {
				if (this.rightPlayer.position.y - 5 >= 0)
					this.rightPlayer.position.y -= 5;

				var canvas = document.getElementById('Pong');
				if (canvas.getContext) {
					var context = canvas.getContext('2d');
					context.fillStyle="pink";
					context.clearRect(0, 0, this.canvas.width, this.canvas.height);
					context.fillRect(this.rightPlayer.position.x, this.rightPlayer.position.y, this.rightPlayer.paddle.width, this.rightPlayer.paddle.height);
					this.drawLeftPlayer();
					this.drawBall();
				}
			},
		},
	}
</script>

<template>
	<div class=PongGame>
				<!-- {{ revelePlay }} -->
		<canvas ref="Pong" class="Pong" id="Pong" :width="canvas.width" :height="canvas.height" v-on:click="draw"> </canvas>
				<!-- <input v-on:keyup.enter="draw()"> -->
				<!-- <canvas ref="Pong" class="Pong" id="Pong" :width=750 :height=500 v-on:click="draw"> {{ revelPlay }} </canvas> -->
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

