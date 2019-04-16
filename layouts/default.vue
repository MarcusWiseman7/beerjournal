<template>
  <v-app :dark="darkMode">
    <my-header />
    <nuxt />
  </v-app>
</template>

<script>
import MyHeader from '~/components/UI/MyHeader'

export default {
  components: {
    MyHeader
  },
  computed: {
    darkMode() {
      if (!this.$store.state.auth.user) return false
      return this.$store.state.auth.user.darkMode
    }
  }
}
</script>

<style lang="stylus">
h1 {
  font-weight: normal;
}
</style>
