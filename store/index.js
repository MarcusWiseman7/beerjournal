export const state = () => ({
  beers: [],
  counter: 0,
  counter1: 1000,
  beerReview: {
    _id: '',
    rating: 1,
    price: 1,
    location: '',
    notes: '',
    beer: {}
  },
  selectBeer: {
    beerName: '',
    brewery: '',
    style: '',
    degrees: 4,
    abv: 3
  },
  addBeerDialog: false,
  beerReviewDialog: false,
  editBeer: false,
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
    state.counter++
  },
  incCounter1(state) { state.counter1++ },
  setBeers(state, beers) { state.beers = beers },
  setReview(state, review) { state.beerReview = Object.assign({}, state.beerReview, review) },
  setSelectBeer(state, beer) { state.selectBeer = Object.assign({}, state.selectBeer, beer) },
  resetReview(state) {
    state.beerReview = {
      _id: '',
      rating: 1,
      price: 1,
      location: '',
      notes: '',
      beer: {}
    }
  },
  resetSelectBeer(state) {
    state.selectBeer = {
      beerName: '',
      brewery: '',
      style: '',
      degrees: 4,
      abv: 3
    }
  },
  toggleAddBeer(state) { state.addBeerDialog = !state.addBeerDialog },
  toggleEditBeer(state) { state.editBeer = !state.editBeer },
  toggleBeerReview(state) { state.beerReviewDialog = !state.beerReviewDialog },
  toggleEditProfile(state) { state.editProfile = !state.editProfile },
  toggleChangePassword(state) { state.changePassword = !state.changePassword }
}

export const actions = {
  async nuxtClientInit({ commit }, { app }) {
    const beers = await app.$axios.$get('/beers/allBeers')
    commit('setBeers', beers)
  },
  async getBeers({ commit }) {
    const beers = await this.$axios.$get('/beers/allBeers')
    commit('setBeers', beers)
    commit('incCounter1')
  },
  onCancelReview({ commit }) {
    commit('toggleBeerReview')
    commit('resetReview')
    commit('resetSelectBeer')
  }
}
