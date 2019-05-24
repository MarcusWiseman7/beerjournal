<template>
  <v-container>
    <my-spinner :loading="loading" />
    <v-layout justify-center>
      <v-flex
        xs12
        sm8
        md6
      >
        <v-card class="ma-4 mt-5 pa-4">
          <v-card-title primary-title>
            <div>
              <h2>Reset Password</h2>
            </div>
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              lazy-validation
            >
              <v-text-field
                v-model="password"
                :append-icon="show ? 'visibility' : 'visibility_off'"
                :rules="[rules.required, rules.min, rules.max]"
                label="New Password"
                :type="show ? 'text' : 'password'"
                required
                autofocus
                @click:append="show = !show"
              >
              </v-text-field>
              <v-text-field
                v-model="verifyPassword"
                :append-icon="show1 ? 'visibility' : 'visibility_off'"
                :rules="[rules.required, sameAs]"
                label="Confirm Password"
                :type="show1 ? 'text' : 'password'"
                required
                @click:append="show1 = !show1"
                @keyup.enter="onSubmit"
              >
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              flat
              color="accent"
              @click.prevent="onSubmit"
            >Reset Password</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  auth: false,
  data() {
    return {
      newPassword: '',
      verifyPassword: '',
      loading: false,
      show: false,
      show1: false,
      sameAs: v => v === this.password || 'Must match password'
    }
  },
  computed: {
    rules() { return this.$store.state.rules }
  },
  asyncData({ params }) {
    return { token: params.token }
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.$axios.post(`/users/reset/${this.token}`, { password: this.newPassword })
          .then(() => {
            this.loading = false
            this.$toast.success('Password reset', { duration: 4000 })
            this.$router.push('/')
          })
          .catch(() => {
            this.loading = false
            this.$toast.error('Invalid or expired token, must reset password within 1 hour', { duration: 5000 })
          })
      }
    }
  }
}
</script>

<style lang="stylus" scoped></style>
