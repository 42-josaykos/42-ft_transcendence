<script>
export default {
	name: 'Pong',
	props: ['revelePlay', 'msg', 'paddleSize', 'ballSpeed'],
	data: function() {
		return {
			rcv_paddleSize: 1,
			rcv_ballSpeed: 1,

			canvas: { w: 1000, h: 600 },
			paddle: {},
			bound: 25,
			player_L: {},
			player_R: {},
			ball: {},

			gameplay: false,
			newround: false,
			newpause: true,
			newgame: true,
			endgame: false,
			startTime: {},
			sounds: {},		
		}
	},
	computed: {
		getPaddle: function () {
			this.paddle.h = (0.2 + ((this.rcv_paddleSize - 1) * 0.05)) * this.canvas.h;
			this.paddle.w = 0.2 * 0.2 * this.canvas.h;
			this.paddle.speed = 0.05 * ((this.canvas.h / 2) - (this.paddle.h / 2));

			return (this.paddle);
		},
		getPlayerL: function() {
			this.player_L.x = this.bound;
			this.player_L.y = (this.canvas.h / 2) - (this.paddle.h / 2);
			this.player_L.color = "blue";
			this.player_L.score = 0;
			return (this.player_L);
		},
		getPlayerR: function() {
			this.player_R.x = this.canvas.w - this.bound - this.paddle.w;
			this.player_R.y = (this.canvas.h / 2) - (this.paddle.h / 2);
			this.player_R.color = "pink";
			this.player_R.score = 0;
			return (this.player_R);
		},
		getBall: function() {
			this.ball.x = this.canvas.w / 2;
			this.ball.y = this.canvas.h / 2;
			this.ball.size = this.paddle.w / 2;
			this.ball.color = "yellow";
			this.ball.speed = 5 * ( 1 + (this.rcv_ballSpeed * 2 / 10));
			this.ball.velocityX = 1 * this.ball.speed;
			this.ball.velocityY = 1 * this.ball.speed;	//	Velocity = Speed & Direction
			return (this.ball);
		},
		getSounds: function() {
			this.sounds.hit = new Audio("./src/components/sounds/hit.wav");
			this.sounds.hit.volume = 0.1;
			this.sounds.wall = new Audio("./src/components/sounds/wall.wav");
			this.sounds.wall.volume = 0.1;
			this.sounds.score = new Audio("./src/components/sounds/score.wav");
			this.sounds.score.volume = 0.1;
			this.sounds.win = new Audio("./src/components/sounds/win.wav");
			this.sounds.win.volume = 0.1;
			this.sounds.loose = new Audio("./src/components/sounds/loose.wav");
			this.sounds.loose.volume = 0.1;
			return (this.sounds);
		},
		getPaddleSize: function() {
			this.rcv_paddleSize = this.paddleSize;
			return (this.rcv_paddleSize);
		},
		getBallSpeed: function() {
			this.rcv_ballSpeed = this.ballSpeed;
			return (this.rcv_ballSpeed);
		},
	},
	created() {
		window.addEventListener('keydown', this.move);
		return ;	//	Keypress does not work for arrows
	},
	mounted() {
		let gamePaddle = this.getPaddle;
		let leftPlayer = this.getPlayerL;
		let rightPlayer = this.getPlayerR;
		let sounds = this.getSounds;
		this.launch();
		return ;
	},
	destroyed() {
		window.removeEventListener('keydown', this.move);
		return ;
	},
	methods: {
		// GAME LOOP
		launch: function() {
			const framePerSec = 50;
			setInterval(this.game, 1000/framePerSec);
			return ;
		},
		game: function() {
			if (this.revelePlay == true) {
				this.rcv_paddleSize = this.paddleSize;
				this.rcv_ballSpeed = this.ballSpeed;
				let gameBall = this.getBall;
				this.gameplay = true;
			}
			if (this.gameplay == true && this.endgame == false) {
				if (this.newgame == false)
					this.runWild();
				if (this.newround == true) {
					if (this.newpause == true) {
						this.startTime = new Date().getTime();
						this.newpause = false;
					}
					var end = new Date().getTime();
					if (end < this.startTime + 1500) {
						this.ball.x = this.canvas.w / 2;
						this.ball.y = this.canvas.h / 2;
						this.ball.Xmin = this.ball.x - this.ball.size;
						this.ball.Xmax = this.ball.x + this.ball.size;
						this.ball.Ymin = this.ball.y - this.ball.size;
						this.ball.Ymax = this.ball.y + this.ball.size;
					}
					else
						this.newround = false;
				}
				this.update();
				this.clearCanvas();
				this.render();
				if (this.gameplay == true) {
					if (this.newgame ==  true) {	
						this.countdown();
						this.player_L.x = this.bound;
						this.player_L.y = (this.canvas.h / 2) - (this.paddle.h / 2);
						this.player_R.x = this.canvas.w - this.bound - this.paddle.w;
						this.player_R.y = (this.canvas.h / 2) - (this.paddle.h / 2);
					}
				}
			}
			return ;
		},
		countdown: function() {
			let canvas = document.getElementById('pong');
			if (canvas.getContext) {
				let context = canvas.getContext('2d');
				context.clearRect(0, 0, this.canvas.w, this.canvas.h);

				let size = 0.65 * this.canvas.h;
				context.font = size + "px Impact";
				let x = this.canvas.w / 2 - size / 4;
				let y = this.canvas.h * 3 / 4;

				context.fillStyle = "red";
				if (this.newpause == true) {
					this.startTime = new Date().getTime();
					this.newpause = false;
				}
				var end = new Date().getTime();
				this.ball.x = this.canvas.w / 2;
				this.ball.y = this.canvas.h / 2;

				if (end < this.startTime + 1500)
					context.fillText("3", x, y);
				else if (end >= this.startTime + 1500 && end < this.startTime + 3000)
					context.fillText("2", x, y);
				else if (end >=  this.startTime + 3000 && end < this.startTime + 4500)
					context.fillText("1", x, y);
				else
					this.newgame = false;
			}
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
			let canvas = document.getElementById('pong');
			if (canvas.getContext) {
				let context = canvas.getContext('2d');
				context.fillStyle = this.player_L.color;
				context.fillRect(this.player_L.x, this.player_L.y, paddle.w, paddle.h);
			}
			return ;
		},
		drawPlayerRight: function(paddle) {
			let canvas = document.getElementById('pong');
			if (canvas.getContext) {
				let context = canvas.getContext('2d');
				context.fillStyle = this.player_R.color;
				context.fillRect(this.player_R.x, this.player_R.y, paddle.w, paddle.h);
			}
			return ;
		},
		drawBall: function() {
			let canvas = document.getElementById('pong');
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
		clearCanvas: function() {
			let canvas = document.getElementById('pong');
			if (canvas.getContext) {
				let context = canvas.getContext('2d');
				context.clearRect(0, 0, this.canvas.w, this.canvas.h);
			}
			return ;
		},
		drawScore: function(leftPlayer, rightPlayer) {
			let canvas = document.getElementById('pong');
			if (canvas.getContext) {
				let context = canvas.getContext('2d');
				let size = 0.2 * this.canvas.h;
				context.font = size + "px Impact";
				let xLeft = this.canvas.w/4;
				let xRight = 3 * this.canvas.w/4 - (size/2);

				context.fillStyle = "yellow";
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
			let res = this.player_L.y + this.paddle.speed + this.paddle.h;
			console.log("mooving right: " + res);
			if (this.player_L.y + this.paddle.h + this.paddle.speed <= this.canvas.h) {
				this.player_L.y += this.paddle.speed;
			}
			return ;
		},
		moveLeft: function() {
			let res = this.player_L.y - this.paddle.speed;
			console.log("mooving left: " + res);
			if (this.player_L.y - this.paddle.speed >= 0) {
				this.player_L.y -= this.paddle.speed;
			}
			return ;
		},
		// UPDATING DATA AND ADJUSTING
		update: function() {
			if ((this.ball.Xmin - 50) > this.canvas.w || (this.ball.Xmax + 50) < 0)
				this.updateScore();
			if (this.ball.Ymax >= this.canvas.h || this.ball.Ymin <= 0) {
				this.ball.velocityY *= -1;
				this.sounds.wall.play();
			}
			let player = (this.ball.x + this.ball.size < this.canvas.w/2) ? this.player_L : this.player_R;
			if (this.collision(this.ball, player)) {
				this.sounds.hit.play();
				this.updateVelocity(player);
			}
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
		waitForPlayers: function(ms) {
			var start = new Date().getTime();
			var end = start;
			while (end < start + ms) {
				end = new Date().getTime();
			}
			return ;
		},
		updateScore: function() {
			// if (this.newgame == true)
			if (this.ball.Xmax + 10 < 0)
				this.player_R.score++;
			else if ((this.ball.Xmin - 10) > this.canvas.w)
				this.player_L.score++
			if (this.player_R.score == 10 || this.player_L.score == 10) {
				this.gameplay = false;
				this.endgame = true;
				this.sounds.win.play();
				return ;
			}
			this.sounds.score.play();
			this.resetPlay();
			return ;
		},
		resetPlay: function () {
			this.newround = true;
			this.newpause = true;
			this.resetBall();
			return ;
		},	
		resetBall: function() {
			this.ball.x = this.canvas.w / 2;
			this.ball.y = this.canvas.h / 2;
			this.ball.velocityX *= -1;
			return ;
		},
		resetPlayerLeft: function() {
			this.player_L.y = (this.canvas.h / 2) - (this.paddle.h / 2);
			this.player_L.Xmin = this.player_L.x;
					this.player_L.Xmax = this.player_L.x + this.paddle.w;
			this.player_L.Ymin = this.player_L.y;
					this.player_L.Ymax = this.player_L.y + this.paddle.h;
			return ;
		},
		resetPlayerRight: function() {
			this.player_R.y = (this.canvas.h / 2) - (this.paddle.h / 2);
			this.player_R.Xmin = this.player_R.x;
					this.player_R.Xmax = this.player_R.x + this.paddle.w;
			this.player_R.Ymin = this.player_R.y;
					this.player_R.Ymax = this.player_R.y + this.paddle.h;
			return ;
		},
		resetPlayer: function(player) {
			this.player.y = this.canvas.h / 2;
			this.player.Xmin = this.player.x;
			this.player.Xmax = this.player.x + this.paddle.w;
			this.player.Ymin = this.player.y;
			this.player.Ymax = this.player.y + this.paddle.h;
			return ;
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
	<div class=pong-game>
		<canvas ref="pong" class="pong" id="pong" :width="canvas.w" :height="canvas.h"> </canvas>
	</div>
</template>

<style scoped>
.pong-game {
	align-items: center;
	justify-content: center;

}
.pong {
	background: #0C2039;
	border: 7.5px solid #FFF961;
	/* justify-content: center; */
}
</style>

