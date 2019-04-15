<template>
  <div>
    <my-spinner :loading="loading" />
    <v-card>
      <v-card-title>
        <h1 style="color:#FFA000">Change Password</h1>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-text-field
            v-model="currentPassword"
            :append-icon="show ? 'visibility' : 'visibility_off'"
            :rules="[rules.required, rules.min, rules.max]"
            label="Current Password"
            :type="show ? 'text' : 'password'"
            required
            autofocus
            @click:append="show = !show"
          >
          </v-text-field>
          <v-text-field
            v-model="password"
            :append-icon="show1 ? 'visibility' : 'visibility_off'"
            :rules="[rules.required, rules.min, rules.max]"
            label="New Password"
            :type="show1 ? 'text' : 'password'"
            required
            @click:append="show1 = !show1"
          >
          </v-text-field>
          <v-text-field
            v-model="verifyPassword"
            :append-icon="show2 ? 'visibility' : 'visibility_off'"
            :rules="[rules.required, sameAs]"
            label="Confirm Password"
            :type="show2 ? 'text' : 'password'"
            required
            @click:append="show2 = !show2"
            @keyup.enter="onSubmit"
          >
          </v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click.native="$store.commit('toggleChangePassword')">Cancel</v-btn>
        <v-btn
          color="primary"
          @click.native="onSubmit"
        >Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'ChangePassword',
  data() {
    return {
      currentPassword: '',
      password: '',
      verifyPassword: '',
      loading: false,
      show: false,
      show1: false,
      show2: false,
      sameAs: v => v === this.password || 'Must match password'
    }
  },
  computed: {
    rules() { return this.$store.state.rules }
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        this.$axios.patch('/users/changePassword', {
          currentPassword: this.currentPassword,
          newPassword: this.password
        })
          .then(() => {
            this.loading = false
            this.$store.commit('toggleChangePassword')
            this.$toast.success('Password changed', { duration: 4000 })
          })
          .catch(() => {
            this.loading = false
            this.$toast.error('Error changing password, please try again', { duration: 4000 })
          })
      }
    }
  }
}
</script>

<style lang="stylus" scoped></style>
