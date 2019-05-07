<template>
  <v-dialog
    v-model="$store.state.changePasswordDialog"
    max-width="450"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    persistent
  >
    <v-card>
      <beer-banner />
      <v-card-title>
        <h1>Change Password</h1>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-text-field
            v-model.trim="currentPassword"
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
            v-model.trim="password"
            :append-icon="show1 ? 'visibility' : 'visibility_off'"
            :rules="[rules.required, rules.min, rules.max]"
            label="New Password"
            :type="show1 ? 'text' : 'password'"
            required
            @click:append="show1 = !show1"
          >
          </v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click.native="$store.commit('toggle', 'changePasswordDialog')">Cancel</v-btn>
        <v-btn
          color="primary"
          @click.native="onSubmit()"
        >Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ChangePassword',
  data() {
    return {
      currentPassword: '',
      password: '',
      show: false,
      show1: false
    }
  },
  computed: {
    rules() { return this.$store.state.rules }
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.$store.commit('toggle', 'loading')
        this.$axios.patch('/users/changePassword', {
          currentPassword: this.currentPassword,
          newPassword: this.password
        })
          .then(() => {
            this.$store.commit('toggle', 'loading')
            this.$store.commit('toggle', 'changePasswordDialog')
            this.$toast.success('Password changed', { duration: 4000 })
          })
          .catch(() => {
            this.$store.commit('toggle', 'loading')
            this.$toast.error('Error changing password, please try again', { duration: 4000 })
          })
      }
    }
  }
}
</script>
