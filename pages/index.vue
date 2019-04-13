<template>
  <v-container>
    <h3 v-if="$store.state.auth.loggedIn">hi, {{$store.state.auth.user.name}}!</h3>
    <add-beer v-if="$store.state.addBeer" />
    <edit-profile v-if="$store.state.editProfile" />
    <change-password v-if="$store.state.changePassword" />
  </v-container>
</template>

<script>
import AddBeer from '~/components/Views/AddBeer'
import EditProfile from '~/components/Views/EditProfile'
import ChangePassword from '~/components/Views/ChangePassword'

export default {
  auth: false,
  components: {
    AddBeer,
    EditProfile,
    ChangePassword
  }
}
</script>
