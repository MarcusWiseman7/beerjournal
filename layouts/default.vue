<template>
  <v-app dark>
    <my-header />
    <nuxt />
  </v-app>
</template>

<script>
import MyHeader from '~/components/UI/MyHeader'

export default {
  components: {
    MyHeader
  }
}
</script>
