<script>
    import ModalePlay from './ModalePlay.vue'

    export default {
        name: 'Pong',
        props: {
            msg: String,
            revelePlay: Boolean,
        },
        data() {
            return {
                canvas: { width: 750, height: 500 },
                paddle: { width: 15, height: 100 },
                leftPlayer: {
                    paddle: { width: 15, height: 100 },// paddle: this.data().paddle,
                    xBound: 25,
                    color: "red",
                    position : { x: 25, y: 0 }
                },
                rightPlayer: {
                    paddle: { width: 15, height: 100 },
                    xBound: 710,
                    color: "blue",
                    position : { x: 710, y: 0 }
                },
                ball: {
                    size: 50,
                    color: "yellow",
                    position: { x: 25, y: 25 } // { x: this.canvas.width / 2, y: this.canvas.height / 2 }
                },
            }
        },
        components: {
            'modale-play': ModalePlay, 
        },
        methods: {
            draw: function() {
                this.drawBall();
                this.drawLeftPlayer();
                this.drawRightPlayer();
            },
            drawBall: function() {
                // console.log("WTF");
                // if (this.revelePlay == false) {
                    var canvas = document.getElementById('Pong');
                    if (canvas.getContext) {
                        var ctx = canvas.getContext('2d');
                        ctx.fillStyle="yellow";
                        ctx.fillRect(this.ball.size, this.ball.size, this.ball.position.x, this.ball.position.y);
                    }
                // }
            },
            drawLeftPlayer: function() {
                // console.log("WTF");
                // if (this.revelePlay == false) {
                    var canvas = document.getElementById('Pong');
                    if (canvas.getContext) {
                        var ctx = canvas.getContext('2d');
                        ctx.fillStyle="red";
                        ctx.fillRect(this.leftPlayer.position.x, this.leftPlayer.position.y, this.leftPlayer.paddle.width, this.leftPlayer.paddle.height);
                    }
                // }
            },
            drawRightPlayer: function() {
                // console.log("WTF");
                // if (this.revelePlay == false) {
                    var canvas = document.getElementById('Pong');
                    if (canvas.getContext) {
                        var ctx = canvas.getContext('2d');
                        ctx.fillStyle="pink";
                        ctx.fillRect(this.rightPlayer.position.x, this.rightPlayer.position.y, this.rightPlayer.paddle.width, this.rightPlayer.paddle.height);
                    }
                // }
            },
            moveRight: function() {
                if (this.rightPlayer.position.y + this.rightPlayer.paddle.height + 5 <= this.canvas.height)
                    this.rightPlayer.position.y += 5;

                var canvas = document.getElementById('Pong');
                if (canvas.getContext) {
                    var ctx = canvas.getContext('2d');
                    ctx.fillStyle="pink";
                    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    ctx.fillRect(this.rightPlayer.position.x, this.rightPlayer.position.y, this.rightPlayer.paddle.width, this.rightPlayer.paddle.height);
                    this.drawLeftPlayer();
                    this.drawBall();
                }
            },
            moveLeft: function() {
                if (this.rightPlayer.position.y - this.rightPlayer.paddle.height - 5 >= 0)
                    this.rightPlayer.position.y -= 5;

                var canvas = document.getElementById('Pong');
                if (canvas.getContext) {
                    var ctx = canvas.getContext('2d');
                    ctx.fillStyle="pink";
                    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                    ctx.fillRect(this.rightPlayer.position.x, this.rightPlayer.position.y, this.rightPlayer.paddle.width, this.rightPlayer.paddle.height);
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

        <input @keyup.left="moveLeft" style="display: none;">
        <input @keyup.right="moveRight" style="display: none;"> 
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

