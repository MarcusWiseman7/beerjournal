<template>
  <div>
    <div id="fb-root"></div>
    <div
      class="fb-login-button"
      data-width=""
      data-size="large"
      data-button-type="login_with"
      data-auto-logout-link="false"
      data-use-continue-as="true"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'FacebookLogin',
  head() {
    return {
      script: [
        {
          src: 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.3&appId=2276566119272505&autoLogAppEvents=1',
          async: true,
          defer: true,
          crossorigin: 'anonymous'
        }
      ]
    }
  },
  data() {
    return {
      facebookSdkReady: false
    }
  },
  mounted() {
    (function (d, s, id) {
      if (d.getElementById(id)) {
        this.facebookSdkReady = true
        return
      }
      const fjs = d.getElementsByTagName(s)[0]
      let js = d.createElement(s)
      js = d.createElement(s)
      js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk.js'
      fjs.parentNode.insertBefore(js, fjs)
    }(document, 'script', 'facebook-jssdk'))

    window.fbAsyncInit = () => {
      // eslint-disable-next-line no-undef
      FB.init({
        appId: '2276566119272505',
        cookie: true,
        xfbml: true,
        version: 'v3.3'
      })
      // eslint-disable-next-line no-undef
      FB.AppEvents.logPageView()
      this.facebookSdkReady = true
    }

    // FB.getLoginStatus((response) => {
    //   statusChangeCallback(response)
    // })
  }
}
</script>
