<template>
  <v-app :dark="darkMode">
    <my-header />
    <my-spinner :loading="$store.state.loading" />
    <nuxt />
  </v-app>
</template>

<script>
import MyHeader from '~/components/UI/MyHeader'
import MySpinner from '~/components/UI/MySpinner'

export default {
  components: {
    MyHeader,
    MySpinner
  },
  computed: {
    darkMode() {
      if (!this.$store.state.auth.user) return false
      return this.$store.state.auth.user.darkMode
    }
  }
}
</script>

<style>
h1,
h2,
h3,
h4,
h5,
h6 {
  font-weight: normal;
}

h1 {
  color: #ffa000;
}
</style>
