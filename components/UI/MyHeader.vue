<template>
  <div>
    <my-spinner :loading="loading" />
    <v-toolbar height="80">
      <v-spacer></v-spacer>
      <v-btn
        v-if="isAuth"
        flat
        @click.native="onLogout"
      >Logout</v-btn>
      <my-auth v-else />
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
  data() {
    return {
      loading: false
    }
  },
  computed: {
    isAuth() {
      return this.$store.state.auth.loggedIn
    }
  },
  methods: {
    onLogout() {
      this.loading = true
      this.$auth
        .logout({
          data: { id: this.$store.state.auth.user._id }
        })
        .then(() => {
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style lang="stylus" scoped></style>
