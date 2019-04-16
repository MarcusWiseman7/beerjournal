<template>
  <div>
    <my-spinner :loading="loading" />
    <v-dialog
      v-model="dialog"
      max-width="450"
      persistent
    >
      <template v-slot:activator="{ on }">
        <v-btn
          color="accent"
          v-on="on"
        >Login/Sign up</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <h2>{{ title }}</h2>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <div v-if="signup">
              <v-text-field
                v-model="name"
                :rules="[rules.required, rules.max]"
                label="Name"
                required
                :autofocus="signup"
              ></v-text-field>
              <v-text-field
                v-model="surname"
                :rules="[rules.required, rules.max]"
                label="Surname"
                required
              ></v-text-field>
            </div>
            <v-text-field
              v-model="email"
              :rules="[rules.required, rules.email, rules.max]"
              label="Email"
              required
              :autofocus="!signup"
            ></v-text-field>
            <v-text-field
              v-if="!forgotPassword"
              v-model="password"
              :append-icon="show ? 'visibility' : 'visibility_off'"
              :rules="[rules.required, rules.min, rules.max]"
              :type="show ? 'text' : 'password'"
              label="Password"
              required
              @click:append="show = !show"
              @keyup.enter="onSubmit"
            ></v-text-field>
            <div v-if="signup">
              <v-text-field
                v-model="verifyPassword"
                :append-icon="show1 ? 'visibility' : 'visibility_off'"
                :rules="[rules.required, sameAs]"
                :type="show1 ? 'text' : 'password'"
                label="Confirm Password"
                required
                @click:append="show1 = !show1"
              ></v-text-field>
              <v-checkbox
                v-model="gdprApproval"
                :rules="[rules.required]"
                color="primary"
                required
              >
                <template slot="label">
                  I agree to the&nbsp;
                  <a @click.stop.prevent="dialogTerms = true">Terms of Service</a>
                  &nbsp;and&nbsp;
                  <a @click.stop.prevent="dialogPrivacy = true">Privacy Policy</a>
                </template>
              </v-checkbox>
              <vue-recaptcha
                ref="recaptcha"
                :sitekey="recaptchaSitekey"
                @verify="onRecaptchaVerify"
              ></vue-recaptcha>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions class="my-2">
          <v-spacer></v-spacer>
          <v-btn
            flat
            large
            @click.native="onCancel"
          >
            Cancel
          </v-btn>
          <v-btn
            flat
            large
            color="primary"
            @click.native="onSubmit"
          >
            Submit
          </v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-layout wrap>
            <v-spacer></v-spacer>
            <div v-if="!signup && !forgotPassword">
              <v-btn
                flat
                color="primary"
                @click.native="toggleType('forgotPassword')"
              >
                Forgot password?
              </v-btn>
              <v-btn
                flat
                color="primary"
                @click.native="toggleType('signup')"
              >
                No account?
              </v-btn>
            </div>
            <v-btn
              v-else
              flat
              color="primary"
              @click.native="toggleType('login')"
            >Have account?</v-btn>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha'

export default {
  name: 'MyAuth',
  head() {
    return {
      script: [
        {
          src:
            'https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit',
          async: true,
          defer: true
        }
      ]
    }
  },
  components: { VueRecaptcha },
  data() {
    return {
      dialog: false,
      loading: false,
      signup: false,
      forgetPassword: false,
      name: '',
      surname: '',
      email: '',
      password: '',
      verifyPassword: '',
      forgotPassword: '',
      gdprApproval: false,
      show: false,
      show1: false,
      recaptchaSitekey: '6Lf-4JAUAAAAAIQ9N55FIgiuqmohKbBZkz8rzOZp',
      recaptchaVerified: false,
      sameAs: v => v === this.password || 'Must match password'
    }
  },
  computed: {
    title() {
      return this.forgotPassword === true
        ? 'Forgot Password'
        : this.signup === true
          ? 'Sign Up'
          : 'Log In'
    },
    rules() { return this.$store.state.rules }
  },
  methods: {
    onSubmit() {
      if (this.$refs.form.validate()) {
        this.loading = true
        if (!this.signup && !this.forgotPassword) {
          this.$auth.loginWith('local', {
            data: {
              username: this.email,
              password: this.password
            }
          })
            .then(() => {
              this.loading = false
              this.$toast.success('Logged in', { duration: 4000 })
            })
            .catch(() => {
              this.loading = false
              this.$toast.error('Error logging in, please try again', { duration: 4000 })
            })
        } else if (this.signup) {
          this.$axios.post('/users/newUser', {
            name: this.name,
            surname: this.surname,
            email: this.email,
            password: this.password,
            gdprApproval: this.gdprApproval
          })
            .then(() => {
              this.onCancel()
              this.loading = false
              this.$toast.success('Success signing up, check your email for validation', { duration: 5000 })
            })
            .catch(() => {
              this.loading = false
              this.$$toast.error('Error signing up, please try again', { duration: 4000 })
            })
        } else {
          this.$axios.post('/users/forgot', {
            email: this.email
          })
            .then(() => {
              this.onCancel()
              this.loading = false
              this.$toast.success('Check your email for instructions', { duration: 5000 })
            })
            .catch(() => {
              this.loading = false
              this.$toast.error('Error sending email, please try again', { duration: 4000 })
            })
        }
      }
    },
    onCancel() {
      this.dialog = false
      this.signup = false
      this.forgotPassword = false
      this.name = ''
      this.surname = ''
      this.email = ''
      this.password = ''
      this.verifyPassword = ''
      this.forgotPassword = ''
      this.gdprApproval = false
      this.show = false
      this.show1 = false
      this.recaptchaVerified = false
    },
    toggleType(type) {
      this.forgotPassword = type === 'forgotPassword'
      this.signup = type === 'signup'
    },
    onRecaptchaVerify() {
      this.recaptchaVerified = true
    }
  }
}
</script>

<style lang="stylus" scoped></style>
