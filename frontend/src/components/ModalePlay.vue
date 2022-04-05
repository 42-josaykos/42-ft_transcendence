<script>
    export default {
        name: 'ModalePlay',
        props: ['revelePlay', 'toggleModalePlay', 'launch']
    }
</script>

<template>
    <div class="bloc-modale" v-if="revelePlay" v-on:click="toggleModalePlay">
        <div class="overlay" v-on:click="toggleModalePlay"></div> <!-- canvas ? -->
            <div class="modale card">
            <div class=Modale_Header>
                <h1> Press anywhere to play</h1>
            </div>
        </div>
    </div>

</template>

<style>

</style>