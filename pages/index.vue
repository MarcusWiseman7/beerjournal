<template>
  <v-container class="my-container">
    <div v-if="$store.state.auth.loggedIn">
      <h3 class="my-3 text-xs-center">Hi, {{ $store.state.auth.user.name }}!</h3>
      <beer-table
        :key="$store.state.counter"
        class="mb-3"
        title="My Beers"
      />
      <edit-profile-dialog />
      <change-password-dialog />
      <add-beer-dialog />
      <beer-review-dialog />
    </div>
    <beer-table
      :key="$store.state.counter1"
      title="Beers"
    />
  </v-container>
</template>

<script>
import AddBeerDialog from '~/components/Dialogs/AddBeerDialog'
import EditProfileDialog from '~/components/Dialogs/EditProfileDialog'
import ChangePasswordDialog from '~/components/Dialogs/ChangePasswordDialog'
import BeerTable from '~/components/Views/BeerTable'
import BeerReviewDialog from '~/components/Dialogs/BeerReviewDialog'

export default {
  name: 'Index',
  auth: false,
  components: {
    AddBeerDialog,
    EditProfileDialog,
    ChangePasswordDialog,
    BeerTable,
    BeerReviewDialog
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
