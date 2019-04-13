export const state = () => ({
  addBeer: true,
  editProfile: false,
  changePassword: false,
  rules: {
    required: v => !!v || 'This is required',
    min: v => (v && v.length >= 6) || 'Min 6 characters',
    max: v => (v && v.length <= 75) || 'Max 75 characters',
    email: (v) => {
      const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return pattern.test(v) || 'Invalid email'
    }
  }
})

export const mutations = {
  setUser(state, user) {
    state.auth.user = Object.assign({}, state.auth.user, user)
  },
  toggleAddBeer(state) { state.addBeer = !state.addBeer },
  toggleEditProfile(state) { state.editProfile = !state.editProfile },
  toggleChangePassword(state) { state.changePassword = !state.changePassword }
}
