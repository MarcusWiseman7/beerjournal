<template>
  <div>
    <v-container v-if="isAdmin">
      <v-layout justify-center>
        <h3>hi, {{ $store.state.auth.user.name }}!</h3>
      </v-layout>
    </v-container>
    <edit-profile
      v-if="$store.state.editProfile"
      class="mb-3"
    />
    <change-password
      v-if="$store.state.changePassword"
      class="mb-3"
    />
    <beer-table
      v-if="isAdmin"
      :key="$store.state.counter"
      class="mb-3"
      title="My Beers"
    />
    <add-beer
      v-if="$store.state.addBeer"
      class="mb-3"
    />
    <beer-table
      :key="$store.state.counter1"
      title="Beers"
    />
    <beer-review />
  </div>
</template>

<script>
import AddBeer from '~/components/Views/AddBeer'
import EditProfile from '~/components/Views/EditProfile'
import ChangePassword from '~/components/Views/ChangePassword'
import BeerTable from '~/components/Views/BeerTable'
import BeerReview from '~/components/Dialogs/BeerReview'

export default {
  auth: false,
  components: {
    AddBeer,
    EditProfile,
    ChangePassword,
    BeerTable,
    BeerReview
  },
  computed: {
    isAdmin() { return this.$store.state.auth.loggedIn }
  }
}
</script>
