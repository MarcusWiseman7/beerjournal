<template>
  <div>
    <v-container v-if="$store.state.auth.loggedIn">
      <v-layout wrap>
        <h3>hi, {{ $store.state.auth.user.name }}!</h3>
        <v-spacer></v-spacer>
        <v-btn @click.native="$store.commit('toggleAddBeer')">Add Beer</v-btn>
      </v-layout>
    </v-container>
    <add-beer
      v-if="$store.state.addBeer"
      class="mb-3"
    />
    <edit-profile
      v-if="$store.state.editProfile"
      class="mb-3"
    />
    <change-password
      v-if="$store.state.changePassword"
      class="mb-3"
    />
    <beer-review
      v-if="$store.state.beerReview"
      class="mb-3"
    />
    <beer-table />
  </div>
</template>

<script>
import AddBeer from '~/components/Views/AddBeer'
import EditProfile from '~/components/Views/EditProfile'
import ChangePassword from '~/components/Views/ChangePassword'
import BeerTable from '~/components/Views/BeerTable'
import BeerReview from '~/components/Views/BeerReview'

export default {
  auth: false,
  components: {
    AddBeer,
    EditProfile,
    ChangePassword,
    BeerTable,
    BeerReview
  }
}
</script>
