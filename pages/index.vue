<template>
  <div>
    <v-container v-if="$store.state.auth.loggedIn">
      <v-layout justify-center>
        <h3>hi, {{ $store.state.auth.user.name }}!</h3>
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
    <beer-table
      class="mb-3"
      title="My Beers"
    />
    <beer-table title="Beers" />
  </div>
</template>

<script>
import AddBeer from '~/components/Views/AddBeer'
import EditProfile from '~/components/Views/EditProfile'
import ChangePassword from '~/components/Views/ChangePassword'
import BeerTable from '~/components/Views/BeerTable'

export default {
  auth: false,
  components: {
    AddBeer,
    EditProfile,
    ChangePassword,
    BeerTable
  }
}
</script>
