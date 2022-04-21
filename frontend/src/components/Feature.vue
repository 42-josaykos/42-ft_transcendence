<script>
    export default {
        data() {
            return {
                level: 5,
            }
        },
        props: {
            name: String
        },
        /*  Intéressant pour avoir des données en cache */
        computed: {
            levelMin: function()
            {
                if (this.level == 0)
                    return (true);
                return (false);
            },
            levelMax: function()
            {
                if (this.level == 10)
                    return (true);
                return (false);
            }
        },
        methods: {
            levelUp: function()
            {
                if (this.level < 10)
                    this.level++;
                // console.log("levelMin is: " + this.levelMin + " levelMax is: " + this.levelMax + " level is: " + this.level)
            },
            levelDown: function()
            {
                if (this.level > 0)
                    this.level--;
                // console.log("min is: " + this.levelMin + "levelMax is: " + this.levelMax + "level is: " + this.level)
            },
        }
    }

</script>
<template>
    <section class=Feature>
        <h2 class="FeatureName">
            {{ name }} : {{ level }}
        </h2>
        <section class=FeatureButtons>
            <button class="UpAndDown" v-on:click="levelDown" :disabled="levelMin == true"> - </button>
            <input class="LevelBar" type="range" v-model="level" min="0" max="10">
            <button class="UpAndDown" v-on:click="levelUp" :disabled="levelMax == true"> + </button>
        </section>
    </section>
</template>


<style>
.Feature {
    /* margin-left: 0; */
    margin-top: 5%;
    margin-bottom: 5%;
}

.FeatureName {
    color: #FFF961;
    margin-bottom: 0;
    font-family: helvetica;
    font-size: 35px;
    font-style: normal;
    letter-spacing: 1px;
    position: relative;
    width: 50%;
    margin-left: auto;
    margin-right: auto; 
    text-align: center;
}

.FeatureButtons {
    position: relative;
    width: 50%;
    margin-left: auto;
    margin-right: auto; 
    text-align: center;
    margin-top: 1.5%;
}

.UpAndDown{
    /* display: inline-flexbox; */
    -webkit-appearance: none;
    width: 10%;
    background: #fffdc7;
    outline: none;
    border: 5px solid #FFF961;
    /* border-radius: 10px;
    margin: 1.5%; */
    text-align: center;
    border-radius: 20px;
    align-items: center;


    display: inline-block;
    color: #1A3558;
    /* letter-spacing: 2px; */
    /* text-transform: uppercase; */
    text-decoration: none;
    /* font-size: 3em; */
    overflow: hidden;
    /* vertical-align: center; */
}
.UpAndDown:hover {
    /* color: #111; */
    background: #FFF961;
    box-shadow: 0 0 50px #FFF961;
}

.LevelBar {
    -webkit-appearance: none;
    width: 65%;
    height: 20px;
    background: #fffdc7;
    outline: none;
    border: 5px solid #FFF961;
    border-radius: 10px;
    text-align: center;
}
.LevelBar:hover {
    /* color: #111; */
    background: #FFF961;
    box-shadow: 0px 0px 50px #FFF961;
}
/* for chrome and safari: */
/* .LevelBar::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 60px;
    background: #000000;
    cursor: pointer;
    border: 5px solid lawngreen;
    border-radius: 4px;
} */

/* for firefox */
/* .LevelBar::-moz-range-thumb {
    width: 20px;
    height: 60px;
    background: #000000;
    cursor: pointer;
    border: 5px solid lawngreen;
    border-radius: 4px;
} */


</style>



// /*styling background*/
//         body {
//             margin: 0;
//             padding: 0;
//             display: flex;
//             height: 100vh;
//             justify-content: center;
//             align-items: center;
//             background-color: #000;
//             font-family: sans-serif;
//         }
 
//         /* styling the button*/
//         a {
//             padding: 20px 20px;
//             display: inline-block;
//             color: #008000;
//             letter-spacing: 2px;
//             text-transform: uppercase;
//             text-decoration: none;
//             font-size: 3em;
//             overflow: hidden;
//         }
 
//         /*creating animation effect*/
//         a:hover {
//             color: #111;
//             background: #39ff14;
//             box-shadow: 0 0 50px #39ff14;
//         }