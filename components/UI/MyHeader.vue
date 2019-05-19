<template>
  <div>
    <v-toolbar height="180">
      <v-container>
        <v-layout justify-end>
          <my-auth v-if="!isAdmin" />
        </v-layout>
        <v-layout
          align-center
          wrap
        >
          <h1 class="mr-2">BeerJournal</h1>
          <v-icon large>fa fa-beer</v-icon>
          <v-spacer></v-spacer>
          <div v-if="isAdmin">
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-avatar
                  tile
                  color="primary"
                  v-on="on"
                >
                  <v-icon large>{{ user.userIcon }}</v-icon>
                </v-avatar>
              </template>
              <v-list>
                <v-list-tile @click.native="$store.commit('toggle', 'myBeerList')">
                  <v-list-tile-title>My Beer List</v-list-tile-title>
                </v-list-tile>
                <v-list-tile
                  v-if="me"
                  @click.native="$store.commit('toggle', 'tempBeersList')"
                >
                  <v-list-tile-title>Temp Beers List</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click.native="$store.commit('toggle', 'editProfileDialog')">
                  <v-list-tile-title>Profile</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click.native="$store.commit('toggle', 'changePasswordDialog')">
                  <v-list-tile-title>Change Password</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click.native="onLogout()">
                  <v-list-tile-title>Logout</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
          </div>
        </v-layout>
      </v-container>
    </v-toolbar>
  </div>
</template>

<script>
import MyAuth from '~/components/Dialogs/MyAuth'

export default {
  name: 'MyHeader',
  components: {
    MyAuth
  },
  computed: {
    isAdmin() {
      return this.$store.state.auth.loggedIn
    },
    me() {
      const id = this.$store.state.auth.loggedIn
        ? this.$store.state.auth.user._id
        : ''
      return id === '5caf07e843926a0f4899ce31' || id === '5cb4e10a80b6f075eefbf3e9'
    },
    user() {
      return this.$store.state.auth.user
    }
  },
  methods: {
    onLogout() {
      this.$store.commit('toggle', 'loading')
      this.$auth
        .logout({
          data: { id: this.$store.state.auth.user._id }
        })
        .then(() => {
          this.$store.commit('toggle', 'loading')
        })
        .catch(() => {
          this.$store.commit('toggle', 'loading')
        })
    }
  }
}
</script>

<style scoped>
h1 {
  font-weight: lighter;
  font-size: 2.5rem;
}
</style>
