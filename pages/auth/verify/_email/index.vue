<template>
  <v-container>
    <my-spinner :loading="loading" />
    <v-layout
      fill-height
      justify-center
      align-center
    >
      <h2>BeerJournal Email Verification</h2>
      <v-icon>unsubscribe</v-icon>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  auth: false,
  data() {
    return {
      loading: false
    }
  },
  asyncData({ params }) {
    return { email: params.email }
  },
  mounted() {
    this.loading = true
    this.$axios
      .patch('/users/addVerifiedEmail', { email: this.email })
      .then(() => {
        this.loading = false
        this.$router.push('/')
        this.$toast.success('Email verified! Please log in', {
          duration: 4000
        })
      })
      .catch(() => {
        this.loading = false
        this.$toast.error('Error verifying email, please try again', {
          duration: 4000
        })
      })
  }
}
</script>

<style lang="stylus" scoped></style>
