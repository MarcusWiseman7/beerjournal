<template>
  <v-container class="my-container">
    <div v-if="$store.state.auth.loggedIn">
      <h3 class="my-3 text-xs-center">Hi, {{ $store.state.auth.user.name }}!</h3>
      <beer-table
        v-if="this.$store.state.myBeerList"
        :key="$store.state.counter"
        class="mb-3"
        title="My Beers"
      />
      <beer-table
        v-if="me && this.$store.state.tempBeersList"
        class="mb-3"
        title="Temp Beers"
      />
      <edit-profile-dialog />
      <change-password-dialog />
      <!-- <add-beer-dialog v-if="me" />
      <add-brewery-dialog v-if="me" />-->
      <edit-beer-dialog v-if="me" />
      <v-btn
        fab
        color="primary"
        large
        fixed
        bottom
        left
        @click.native="toggleBeerReview()"
      >
        <v-icon>add</v-icon>
      </v-btn>
    </div>
    <div v-else>
      <my-auth />
      <v-btn
        v-if="!$store.state.myAuth"
        color="primary"
        fab
        large
        fixed
        bottom
        left
        @click.native="$store.commit('toggle', 'myAuth')"
      >
        <v-icon large>account_box</v-icon>
      </v-btn>
    </div>
    <beer-review-dialog :key="$store.state.counter2" />
    <beer-table
      :key="$store.state.counter1"
      title="Beers"
    />
    <v-layout wrap>
      <v-spacer></v-spacer>
      <v-btn
        v-if="me"
        @click.native="$store.commit('toggle', 'addBreweryDialog')"
      >Add Brewery</v-btn>
      <v-btn
        v-if="me"
        @click.native="$store.commit('toggle', 'addBeerDialog')"
      >Add Beer</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
// import AddBeerDialog from '~/components/Dialogs/AddBeerDialog'
import EditProfileDialog from '~/components/Dialogs/EditProfileDialog'
import ChangePasswordDialog from '~/components/Dialogs/ChangePasswordDialog'
import BeerTable from '~/components/Views/BeerTable'
import BeerReviewDialog from '~/components/Dialogs/BeerReviewDialog'
import EditBeerDialog from '~/components/Dialogs/EditBeerDialog'
// import AddBreweryDialog from '~/components/Dialogs/AddBreweryDialog'
import MyAuth from '~/components/Dialogs/MyAuth'

export default {
  name: 'Index',
  auth: false,
  components: {
    // AddBeerDialog,
    EditProfileDialog,
    ChangePasswordDialog,
    BeerTable,
    BeerReviewDialog,
    EditBeerDialog,
    MyAuth
    // AddBreweryDialog
  },
  computed: {
    me() {
      const id = this.$store.state.auth.loggedIn
        ? this.$store.state.auth.user._id
        : ''
      return (
        id === '5caf07e843926a0f4899ce31' ||
        id === '5cb4e10a80b6f075eefbf3e9' ||
        id === '5ce7eeb60d382008a815c8e1'
      )
    }
  },
  methods: {
    toggleBeerReview() {
      this.$store.commit('resetBeerInfo')
      this.$store.commit('toggle', 'beerReviewDialog')
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
