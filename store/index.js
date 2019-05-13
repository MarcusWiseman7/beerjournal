export const state = () => ({
  beers: [],
  loading: false,
  counter: 0,
  counter1: 10000,
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
  beerInfo: false,
  myBeerList: false,
  addBeerDialog: false,
  addBreweryDialog: false,
  beerReviewDialog: false,
  editBeerDialog: false,
  editProfileDialog: false,
  changePasswordDialog: false,
  rules: {
    required: v => !!v || 'This is required',
    min: v => (v && v.length >= 6) || 'Min 6 characters',
    max: v => (v && v.length <= 75) || 'Max 75 characters',
    email: (v) => {
      const pattern = /\S+@\S+\.\S+/
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
  toggle(state, item) { state[item] = !state[item] },
  truthy(state, params) { state[params.item] = params.bool }
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
    commit('truthy', { item: 'beerReviewDialog', bool: false })
    commit('truthy', { item: 'editBeerDialog', bool: false })
    commit('truthy', { item: 'beerInfo', bool: false })
    commit('resetReview')
    commit('resetSelectBeer')
  }
}
