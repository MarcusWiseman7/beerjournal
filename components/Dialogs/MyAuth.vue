<template>
  <v-dialog
    v-model="$store.state.myAuth"
    max-width="450"
    :fullscreen="$vuetify.breakpoint.xsOnly"
    persistent
  >
    <v-card>
      <beer-banner />
      <v-card-title>
        <h1>{{ title }}</h1>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <div v-if="signup">
            <v-text-field
              v-model.trim="name"
              :rules="[rules.required, rules.max]"
              label="Name"
              required
              :autofocus="signup"
            ></v-text-field>
            <v-text-field
              v-model.trim="surname"
              :rules="[rules.required, rules.max]"
              label="Surname"
              required
            ></v-text-field>
          </div>
          <v-text-field
            v-model.trim="email"
            :rules="[rules.required, rules.email, rules.max]"
            label="Email"
            required
            :autofocus="!signup"
          ></v-text-field>
          <v-text-field
            v-if="!forgotPassword"
            v-model.trim="password"
            :append-icon="show ? 'visibility' : 'visibility_off'"
            :rules="[rules.required, rules.min, rules.max]"
            :type="show ? 'text' : 'password'"
            label="Password"
            required
            @click:append="show = !show"
            @keyup.enter="onSubmit"
          ></v-text-field>
          <div v-if="signup">
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
          @click.native="onCancel()"
        >Cancel</v-btn>
        <v-btn
          flat
          large
          color="primary"
          @click.native="onSubmit()"
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
            >Forgot password?</v-btn>
            <v-btn
              flat
              color="primary"
              @click.native="toggleType('signup')"
            >No account?</v-btn>
          </div>
          <v-btn
            v-else
            flat
            color="primary"
            @click.native="toggleType('login')"
          >
            Have account?
          </v-btn>
        </v-layout>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
      signup: false,
      forgetPassword: false,
      name: '',
      surname: '',
      email: '',
      password: '',
      forgotPassword: '',
      gdprApproval: false,
      show: false,
      recaptchaSitekey: '6LfRuJ8UAAAAADWaP0qEKDqwpoLtvqJDHN9-LNRB',
      recaptchaVerified: false
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
    rules() {
      return this.$store.state.rules
    }
  },
  methods: {
    async onSubmit() {
      if (this.$refs.form.validate()) {
        if (this.signup && !this.recaptchaVerified) {
          this.$toast.error(`You must prove you're not a robot!`, {
            duration: 4000
          })
        } else {
          this.$store.commit('toggle', 'loading')
          if (!this.signup && !this.forgotPassword) {
            await this.$auth.loginWith('local', {
              data: {
                username: this.email.toLowerCase(),
                password: this.password
              }
            })
              .then(() => {
                this.onCancel()
                this.$store.commit('toggle', 'loading')
                this.$toast.success('Logged in', { duration: 4000 })
              })
              .catch(() => {
                this.$store.commit('toggle', 'loading')
                this.$toast.error('Error logging in, please try again', {
                  duration: 4000
                })
              })
          } else if (this.signup) {
            await this.$axios.post('/users/newUser', {
              name: this.name,
              surname: this.surname,
              email: this.email.toLowerCase(),
              password: this.password,
              gdprApproval: this.gdprApproval
            })
              .then(() => {
                this.onCancel()
                this.$store.commit('toggle', 'loading')
                this.$toast.success('Success signing up, check your email for validation',
                  { duration: 5000 }
                )
              })
              .catch(() => {
                this.$store.commit('toggle', 'loading')
                this.$toast.error('Error signing up, please try again', {
                  duration: 4000
                })
              })
          } else {
            await this.$axios.patch('/users/forgot', {
              email: this.email.toLowerCase()
            })
              .then(() => {
                this.onCancel()
                this.$store.commit('toggle', 'loading')
                this.$toast.success('Check your email for instructions', {
                  duration: 5000
                })
              })
              .catch(() => {
                this.$store.commit('toggle', 'loading')
                this.$toast.error('Error sending email, please try again', {
                  duration: 4000
                })
              })
          }
        }
      }
    },
    onCancel() {
      this.$store.commit('toggle', 'myAuth')
      this.signup = false
      this.forgotPassword = false
      this.name = ''
      this.surname = ''
      this.email = ''
      this.password = ''
      this.forgotPassword = ''
      this.gdprApproval = false
      this.show = false
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
