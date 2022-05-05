<script>
export default {
  name: "ModaleNotif",
  // props: ["notifBool", "firstTime"],
  props: ["notifBool", "firstTime", "turnOffModaleNotif"],
  // methods: {
  //   turnOffModaleNotif: function () {
  //     this.notifBool = false;
  //     console.log(this.notifBool);
  //     return ;
  //   },
  // },
};

</script>

<template>
  <section class="bloc-modale-notif" v-if="notifBool">
    <!-- <section class="overlay"> -->
      <section class="modale card">
        <section class="modale-header">
          <section
            class="btn-modale btn btn-danger"
            @click="turnOffModaleNotif"
          >
            FUCK OFF
          </section>
          <h1 v-if="firstTime">You've been added to the queue...</h1>
          <h1 v-if="!firstTime">Hold on a bit more you're next !</h1>

        </section>
      </section>
    </section>
  <!-- </section> -->
</template>

<style>
  .bloc-modale-notif {
    position: fixed;
    top: 0;
    /* /* bottom: 0;
    left: 0; */
    right: 0;
    /* /* display: flex; */
    justify-content: center;
    align-items: center;
    /* z-index: 9999; */
  }


</style>