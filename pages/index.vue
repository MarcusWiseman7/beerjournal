<template>
  <v-container class="my-container">
    <v-btn @click="renameKey()">renameKey</v-btn>
    <!-- <div v-if="$store.state.auth.loggedIn">
      <h3 class="my-3 text-xs-center">Hi, {{ $store.state.auth.user.name }}!</h3>
      <beer-table
        v-if="this.$store.state.myBeerList"
        :key="$store.state.counter"
        class="mb-3"
        title="My Beers"
      />
      <beer-table
        v-if="me"
        class="mb-3"
        title="Temp Beers"
      />
      <edit-profile-dialog />
      <change-password-dialog />
      <add-beer-dialog v-if="me" />
      <add-brewery-dialog v-if="me" />
      <beer-review-dialog />
      <edit-beer-dialog v-if="me" />
      <v-btn
        v-if="me"
        @click.native="$store.commit('toggle', 'addBreweryDialog')"
      >Add Brewery</v-btn>
    </div>
    <beer-table
      :key="$store.state.counter1"
      title="Beers"
    /> -->
  </v-container>
</template>

<script>
// import AddBeerDialog from '~/components/Dialogs/AddBeerDialog'
// import EditProfileDialog from '~/components/Dialogs/EditProfileDialog'
// import ChangePasswordDialog from '~/components/Dialogs/ChangePasswordDialog'
// import BeerTable from '~/components/Views/BeerTable'
// import BeerReviewDialog from '~/components/Dialogs/BeerReviewDialog'
// import EditBeerDialog from '~/components/Dialogs/EditBeerDialog'
// import AddBreweryDialog from '~/components/Dialogs/AddBreweryDialog'

export default {
  name: 'Index',
  auth: false,
  // components: {
  //   AddBeerDialog,
  //   EditProfileDialog,
  //   ChangePasswordDialog,
  //   BeerTable,
  //   BeerReviewDialog,
  //   EditBeerDialog,
  //   AddBreweryDialog
  // },
  computed: {
    me() {
      const id = this.$store.state.auth.user._id
        ? this.$store.state.auth.user._id
        : ''
      return id === '5caf07e843926a0f4899ce31' || id === '5cb4e10a80b6f075eefbf3e9'
    }
  },
  methods: {
    renameKey() {
      this.$axios.get('/beers/renameKey')
    }
  }
}
</script>

<style lang="stylus" scoped>
@media only screen and (max-width: 600px) {
  .my-container {
    padding: 0;
  }
}
</style>
