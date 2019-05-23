<template>
  <div>
    <v-card-text>
      <v-form ref="phone-form">
        <v-select
          v-model="countryCode"
          :items="countryCodeItems"
          label="Country Code"
        ></v-select>
        <v-text-field
          v-model.trim="phoneNumber"
          :rules="[rules.required, rules.max]"
          label="Phone Number"
        ></v-text-field>
      </v-form>
      <v-form ref="email-form">
        <v-text-field
          v-model.trim="email"
          :rules="[rules.required, rules.email, rules.max]"
          label="Email"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click.native="smsLogin()">SMS Login</v-btn>
      <v-btn @click.native="emailLogin()">Email Login</v-btn>
    </v-card-actions>
  </div>
</template>

<script>
export default {
  name: 'FacebookAcountKit',
  head() {
    return {
      script: [
        {
          src: 'https://sdk.accountkit.com/en_US/sdk.js',
          async: true,
          defer: true
        }
      ]
    }
  },
  data() {
    return {
      email: '',
      countryCode: '',
      phoneNumber: ''
    }
  },
  created() {
    // initialize Account Kit with CSRF protection
    AccountKit_OnInteractive = function () {
      AccountKit.init(
        {
          appId: "{{FACEBOOK_APP_ID}}",
          state: "{{csrf}}",
          version: "{{ACCOUNT_KIT_API_VERSION}}",
          fbAppEventsEnabled: true,
          redirect: "{{REDIRECT_URL}}"
        }
      )
    }
  },
  computed: {
    rules() { return this.$store.state.rules }
  },
  methods: {
    // login callback
    loginCallback(response) {
      if (response.status === "PARTIALLY_AUTHENTICATED") {
        const code = response.code
        const csrf = response.state
        // Send code to server to exchange for access token
      }
      else if (response.status === "NOT_AUTHENTICATED") {
        // handle authentication failure
      }
      else if (response.status === "BAD_PARAMS") {
        // handle bad parameters
      }
    },
    // phone form submission handler
    smsLogin() {
      const countryCode = this.countryCode
      const phoneNumber = this.phoneNumber
      // will use default values if not specified
      AccountKit.login('PHONE', { countryCode, phoneNumber }, this.loginCallback)
    },
    // email form submission handler
    emailLogin() {
      const emailAddress = this.email
      AccountKit.login('EMAIL', { emailAddress }, this.loginCallback)
    }
  }
}
</script>
