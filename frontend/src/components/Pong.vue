<script>
import { io } from "socket.io-client";
import { storeToRefs, mapState } from "pinia";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";
import { Player } from "src/../../backend/src/game/game.class.ts";

export default {
  name: "Pong",
  props: ["revelePlay", "msg", "paddleSize", "ballSpeed"],
  data: function () {
    return {
      rcv_paddleSize: 2,
      rcv_ballSpeed: 3,

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

      intervalID: {},
      keyState: {},

      router: {},
    };
  },
  computed: {
    ...mapState(useUserStore, ["gameSocket", "loggedUser"]),
    //	Compute respectively the values of the component attributes that depend on data and props, sets some others to
    //	default, and returns them (Paddle, PlayerL, PlayeR, Ball, Sounds).
    getPaddle: function () {
      this.paddle.h = (0.2 + (this.rcv_paddleSize - 1) * 0.05) * this.canvas.h;
      this.paddle.w = 0.2 * 0.2 * this.canvas.h;
      this.paddle.speed = 0.05 * (this.canvas.h / 2 - this.paddle.h / 2);
      return this.paddle;
    },
    //	Sets the middle of the player's paddle halfway up the canvas. Its (x,y) being the paddle's up-left corner.
    getPlayerL: function () {
      this.player_L.x = this.bound;
      this.player_L.y = this.canvas.h / 2 - this.paddle.h / 2;
      this.player_L.color = "blue";
      this.player_L.score = 0;
      return this.player_L;
    },
    getPlayerR: function () {
      this.player_R.x = this.canvas.w - this.bound - this.paddle.w;
      this.player_R.y = this.canvas.h / 2 - this.paddle.h / 2;
      this.player_R.color = "pink";
      this.player_R.score = 0;
      return this.player_R;
    },
    getBall: function () {
      this.ball.x = this.canvas.w / 2;
      this.ball.y = this.canvas.h / 2;
      this.ball.size = this.paddle.w / 2;
      this.ball.color = "yellow";
      this.ball.speed = 5 * (1 + (this.rcv_ballSpeed * 2) / 10);
      this.ball.velocityX = 1 * this.ball.speed;
      this.ball.velocityY = 1 * this.ball.speed; //	Velocity = Speed & Direction
      return this.ball;
    },
    getSounds: function () {
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
      return this.sounds;
    },
    getPaddleSize: function () {
      this.rcv_paddleSize = this.paddleSize;
      return this.rcv_paddleSize;
    },
    getBallSpeed: function () {
      this.rcv_ballSpeed = this.ballSpeed;
      return this.rcv_ballSpeed;
    },
  },
  created() {
    window.addEventListener("keydown", this.getKeyDown, true); //	Keypress does not work for arrows
    window.addEventListener("keyup", this.getKeyUp, true);
    return;
  },
  mounted() {
    let gamePaddle = this.getPaddle;
    let leftPlayer = this.getPlayerL;
    let rightPlayer = this.getPlayerR;
    let sounds = this.getSounds;

    this.router = useRouter();

    // Socket Events
    //##########################################################################
    this.gameSocket.on("gameUpdate", (data) => {
      // console.log("gameUpdate: ", data);
      this.updateGame(data);
    });
    this.gameSocket.on("endGame", () => {
      console.log("in endGame event");
      this.router.push("/debug");
    });
    //  ##########################################################################
    this.launch();
    return;
  },
  destroyed() {
    window.removeEventListener("keydown", this.getKeyDown);
    window.removeEventListener("keyup", this.getKeyUp);
    return;
  },
  methods: {
    //  Game Loop
    //  ##########################################################################
    launch: function () {
      const framePerSec = 50;
      this.intervalID = setInterval(this.game, 1000 / 60);
      return;
    },
    game: function () {
      // if (this.revelePlay == true) this.updateSettings();
      // if (this.gameplay == true && this.endgame == false) {
      // if (this.newgame == false) this.runWild();
      // if (this.newround == true) this.pauseRound();
      //  Loops over the classical pattern: checks for a key event, updates, clears and render the new positions on
      //  the virgin canvas and then
      this.move();
      // this.update();
      this.clearCanvas();
      this.render();
      // if (this.gameplay == true) {
      //  If it is the very beggining of the game (and not just a new round), fixes both player positions so that
      //  users cannot moove without seing their paddle and before the game starts.
      // if (this.newgame == true) this.pauseGame();
      // }

      // When the game is finished
      // else {
      //   clearInterval(this.intervalID);
      //   this.gameSocket.emit("endGame", {
      //     user: this.loggedUser,
      //     score: [this.player_L.score, this.player_R.score],
      //   });
      // }
      return;
    },
    updateGame: function (data) {
      this.player_L.x = data.playerOne.x;
      this.player_L.y = data.playerOne.y;
      this.player_R.x = data.playerTwo.x;
      this.player_R.y = data.playerTwo.y;
      this.player_L.score = data.playerOne.score;
      this.player_R.score = data.playerTwo.score;
      this.ball.x = data.ball.x;
      this.ball.y = data.ball.y;
      this.ball.size = data.ball.size;
    },
    updateSettings: function () {
      //  Both rcv_ are updated here because the props 'revelPlay' is set at true, meaning the user is done modifying
      //  the game settings.
      this.rcv_paddleSize = this.paddleSize;
      this.rcv_ballSpeed = this.ballSpeed;
      //  Calls getBall to update its attributes, then set the boolean gameplay at true so that the game can properly
      //  start now that all is up to date.
      let gameBall = this.getBall;
      this.gameplay = true;
      return;
    },
    pauseRound: function () {
      //  Sets the ball at is default position each time the current time does not equal the amount chosen, creating
      //  a pause from when the point is scored to when the game carries on.
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
      } else this.newround = false;
      return;
    },
    pauseGame: function () {
      this.countdown();
      this.player_L.x = this.bound;
      this.player_L.y = this.canvas.h / 2 - this.paddle.h / 2;
      this.player_R.x = this.canvas.w - this.bound - this.paddle.w;
      this.player_R.y = this.canvas.h / 2 - this.paddle.h / 2;
      return;
    },
    countdown: function () {
      let canvas = document.getElementById("pong");
      if (canvas.getContext) {
        let context = canvas.getContext("2d");
        context.clearRect(0, 0, this.canvas.w, this.canvas.h);

        //	Computes the position (x, y) of the countdown's digits
        let size = 0.65 * this.canvas.h;
        context.font = size + "px Impact";
        let x = this.canvas.w / 2 - size / 4;
        let y = (this.canvas.h * 3) / 4;

        context.fillStyle = "red";
        if (this.newpause == true) {
          this.startTime = new Date().getTime();
          this.newpause = false;
        }
        var end = new Date().getTime();
        //	Renders the appropriate digit given the amout of time that has passed since the begining of the countdown.
        if (end < this.startTime + 1500) context.fillText("3", x, y);
        else if (end >= this.startTime + 1500 && end < this.startTime + 3000)
          context.fillText("2", x, y);
        else if (end >= this.startTime + 3000 && end < this.startTime + 4500)
          context.fillText("1", x, y);
        else this.newgame = false;
      }
      return;
    },
    //  Elements Rendering
    //  ##########################################################################
    render: function () {
      this.drawPlayerLeft(this.getPaddle);
      this.drawPlayerRight(this.getPaddle);
      this.drawBall();
      this.drawScore(this.player_L, this.player_R);
      return;
    },
    drawPlayerLeft: function (paddle) {
      let canvas = document.getElementById("pong");
      if (canvas.getContext) {
        let context = canvas.getContext("2d");
        context.fillStyle = this.player_L.color;
        context.fillRect(this.player_L.x, this.player_L.y, paddle.w, paddle.h);
      }
      return;
    },
    drawPlayerRight: function (paddle) {
      let canvas = document.getElementById("pong");
      if (canvas.getContext) {
        let context = canvas.getContext("2d");
        context.fillStyle = this.player_R.color;
        context.fillRect(this.player_R.x, this.player_R.y, paddle.w, paddle.h);
      }
      return;
    },
    drawBall: function () {
      let canvas = document.getElementById("pong");
      if (canvas.getContext) {
        let context = canvas.getContext("2d");
        context.fillStyle = "yellow";
        context.beginPath();
        context.arc(
          this.ball.x,
          this.ball.y,
          this.ball.size,
          0,
          Math.PI * 2,
          false
        );
        context.closePath();
        context.fill();
      }
      return;
    },
    clearCanvas: function () {
      let canvas = document.getElementById("pong");
      if (canvas.getContext) {
        let context = canvas.getContext("2d");
        context.clearRect(0, 0, this.canvas.w, this.canvas.h);
      }
      return;
    },
    drawScore: function (leftPlayer, rightPlayer) {
      let canvas = document.getElementById("pong");
      if (canvas.getContext) {
        let context = canvas.getContext("2d");
        let size = 0.2 * this.canvas.h;
        context.font = size + "px Impact";
        let xLeft = this.canvas.w / 4;
        let xRight = (3 * this.canvas.w) / 4 - size / 2;

        context.fillStyle = "yellow";
        context.fillText(leftPlayer.score, xLeft, this.canvas.h / 5);
        context.fillText(rightPlayer.score, xRight, this.canvas.h / 5);
      }
      return;
    },
    //  Keyboard Event Management
    //  ##########################################################################
    getKeyDown: function (e) {
      this.keyState[e.keyCode || e.which] = true;
    },
    getKeyUp: function (e) {
      this.keyState[e.keyCode || e.which] = false;
    },
    move() {
      if (this.keyState[37]) this.gameSocket.emit("moveLeft", this.loggedUser);
      else if (this.keyState[39])
        this.gameSocket.emit("moveRight", this.loggedUser);
      return;
    },
    //  Updating Data and Adjusting
    //  ##########################################################################
    update: function () {
      //	Checks whether the ball passed throught the canvas boundaries by the left or by the right (the extra 50 pixels
      //	make the rendering smoother).
      if (this.ball.Xmin - 50 > this.canvas.w || this.ball.Xmax + 50 < 0)
        this.updateScore();
      // Checks if the ball passed has hit one of the canvas boundaries by the top or by the bottom. If so, it bounces.
      if (this.ball.Ymax >= this.canvas.h || this.ball.Ymin <= 0) {
        this.ball.velocityY *= -1;
        this.sounds.wall.play();
      }
      //	Checks in which part of the canvas the ball is in order to send the appropriate player to collision() that'll
      //	return true if such event occurs.
      let player =
        this.ball.x + this.ball.size < this.canvas.w / 2
          ? this.player_L
          : this.player_R;
      if (this.collision(this.ball, player)) {
        this.sounds.hit.play();
        this.updateVelocity(player);
      }
      return;
    },
    collision: function (ball, player) {
      //	Defines the values of the paddle sides' positions and then the ball sides's position given their respective
      //	position: Xmin = left side, Xmax = right side, Ymin = top, Ymax = bottom
      player.Xmin = player.x;
      player.Xmax = player.x + this.paddle.w;
      player.Ymin = player.y;
      player.Ymax = player.y + this.paddle.h;
      ball.Xmax = ball.x + ball.size;
      ball.Ymin = ball.y - ball.size;
      ball.Ymax = ball.y + ball.size;
      //	Returns 1 or 0 given if there is a collision or not.
      return (
        player.Xmin < ball.Xmax &&
        player.Ymin < ball.Ymax &&
        player.Xmax > ball.Xmin &&
        player.Ymax > ball.Ymin
      );
    },
    updateVelocity: function (player) {
      let middleY = player.y + this.paddle.h / 2; //	Y value of the middle of the paddle
      let collisionPoint = this.ball.y - middleY; //	Computes where the ball hits the paddle
      collisionPoint /= this.paddle.h / 2; //	Normalizing the number : to have something between -1 and 1

      let angleRad = (Math.PI / 4) * collisionPoint; // PI/4 = 45° is arbitrary, I could have chose another angle!
      let direction = this.ball.x + this.ball.size < this.canvas.w / 2 ? 1 : -1;

      this.ball.velocityX = direction * this.ball.speed * Math.cos(angleRad);
      this.ball.velocityY = this.ball.speed * Math.sin(angleRad);
      return;
    },
    waitForPlayers: function (ms) {
      var start = new Date().getTime();
      var end = start;
      while (end < start + ms) {
        end = new Date().getTime();
      }
      return;
    },
    updateScore: function () {
      //  Checks whether the ball passed throught the canvas boundaries by the left or by the right (the extra 10 pixels
      //  make it visually smoother: the ball has time to cross before it is sent to its default position) and given the
      //  the score is updated.
      if (this.ball.Xmax + 10 < 0) this.player_R.score++;
      else if (this.ball.Xmin - 10 > this.canvas.w) this.player_L.score++;
      //  Ends game if one of the two players reached 10.
      if (this.player_R.score == 10 || this.player_L.score == 10) {
        this.gameplay = false;
        this.endgame = true;
        this.sounds.win.play();
        return;
      }
      //  Else, the new score is rendered and the ball is sent at its default position for a new round.
      this.sounds.score.play();
      this.resetPlay();
      return;
    },
    resetPlay: function () {
      //  Booleans to true for a pause between rounds when game() is called again.
      this.newround = true;
      this.newpause = true;
      this.resetBall();
      return;
    },
    resetBall: function () {
      // Sets the ball at the middle of the canvas.
      this.ball.x = this.canvas.w / 2;
      this.ball.y = this.canvas.h / 2;
      this.ball.velocityX *= -1; // So that each player receives the ball one at a time.
      return;
    },
    runWild: function () {
      this.ball.x += this.ball.velocityX;
      this.ball.y += this.ball.velocityY;
      this.ball.Xmin = this.ball.x - this.ball.size;
      this.ball.Xmax = this.ball.x + this.ball.size;
      this.ball.Ymin = this.ball.y - this.ball.size;
      this.ball.Ymax = this.ball.y + this.ball.size;
      return;
    },
  },
};
</script>

<template>
  <div class="pong-game">
    <canvas
      ref="pong"
      class="pong"
      id="pong"
      :width="canvas.w"
      :height="canvas.h"
    >
    </canvas>
  </div>
</template>

<style scoped>
.pong-game {
  align-items: center;
  justify-content: center;
}
.pong {
  background: #0c2039;
  border: 7.5px solid #fff961;
}
</style>
