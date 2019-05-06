<template>
  <v-dialog
    v-model="$store.state.editProfileDialog"
    max-width="450"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    persistent
  >
    <v-card>
      <v-card-title>
        <h1>Edit Profile</h1>
      </v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          lazy-validation
        >
          <v-select
            v-model="user.userIcon"
            append-icon="arrow_drop_down"
            :items="userIcons"
            label="User Icon"
          >
            <template
              slot="selection"
              slot-scope="{ item, parent, selected }"
            >
              <v-icon :selected="selected">{{ item }}</v-icon>
            </template>
            <template
              slot="item"
              slot-scope="{ index, item }"
            >
              <v-icon>{{ item }}</v-icon>
            </template>
          </v-select>
          <v-switch
            v-model="user.darkMode"
            label="Dark Mode"
          ></v-switch>
          <v-text-field
            v-model.trim="user.name"
            :rules="[rules.required, rules.max]"
            label="Name"
            required
          ></v-text-field>
          <v-text-field
            v-model.trim="user.surname"
            :rules="[rules.required, rules.max]"
            label="Surname"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.email"
            label="Email"
            disabled
          ></v-text-field>
          <v-btn
            v-if="!replaceEmail"
            flat
            @click.native="replaceEmail = true"
          >Replace email?</v-btn>
          <v-text-field
            v-else
            v-model.trim="user.newEmail"
            :rules="[rules.email, rules.max]"
            label="Replace email"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click.native="$store.commit('toggle', 'editProfileDialog')">Cancel</v-btn>
        <v-btn
          color="primary"
          @click.native="onSubmit()"
        >Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import userIcons from '~/data/userIcons.json'

export default {
  name: 'EditProfile',
  data() {
    return {
      replaceEmail: false,
      user: {},
      userIcons
    }
  },
  computed: {
    rules() { return this.$store.state.rules }
  },
  created() {
    this.user = Object.assign({}, this.user, this.$store.state.auth.user)
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.$store.commit('toggle', 'loading')
        this.$axios.patch(`/users/${this.$store.state.auth.user._id}`, this.user)
          .then((res) => {
            if (res.data.name) {
              this.$store.commit('setUser', res.data)
            }
            this.$store.commit('toggle', 'loading')
            this.$store.commit('toggle', 'editProfileDialog')
            this.$toast.success('Updated profile', { duration: 4000 })
          })
          .catch(() => {
            this.$store.commit('toggle', 'loading')
            this.$toast.error('Error updating profile, please try again', { duration: 4000 })
          })
      }
    }
  }
}
</script>
