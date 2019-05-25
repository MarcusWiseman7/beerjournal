export const state = () => ({
  beers: [],
  breweries: [],
  loading: false,
  counter: 0,
  counter1: 10000,
  counter2: 100000,
  beerInfo: { beer: {}, reviews: [], myReview: {} },
  beerInfoView: false,
  myBeerList: false,
  tempBeersList: false,
  addBeerDialog: false,
  addBreweryDialog: false,
  beerReviewDialog: false,
  reviewForm: false,
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
  incCounter2(state) { state.counter2++ },
  setItem(state, item) { state[item] = item },
  setBeerInfo(state, info) { state.beerInfo = info },
  setBreweries(state, breweries) { state.breweries = breweries },
  setBeers(state, beers) { state.beers = beers },
  setMyReview(state, review) { state.beerInfo.myReview = Object.assign({}, state.beerInfo.myReview, review) },
  setBeer(state, beer) { state.beerInfo.beer = Object.assign({}, state.beerInfo.beer, beer) },
  setReviews(state, reviews) { state.beerInfo.reviews = reviews },
  resetBeerInfo(state) { state.beerInfo = { beer: {}, reviews: [], myReview: {} } },
  toggle(state, item) { state[item] = !state[item] },
  truthy(state, params) { state[params.item] = params.bool }
}

export const actions = {
  async nuxtClientInit({ commit }, { app }) {
    const res = await app.$axios.$get('/beers/allBeers')
    commit('setBeers', res.beers)
    commit('setBreweries', res.breweries)
  },
  async getBeers({ commit }) {
    const res = await this.$axios.$get('/beers/allBeers')
    commit('setBeers', res.beers)
    commit('incCounter1')
  },
  async beerInfo({ commit, state }, beer) {
    if (state.auth.loggedIn) {
      const myId = state.auth.user._id
      const reviews = await this.$axios.get(`/reviews/${beer._id}`)
        .then(res => res.data)
        // eslint-disable-next-line no-console
        .catch(err => console.error(err))
      let myReview

      if (reviews.map(x => x.reviewer._id).includes(myId)) {
        myReview = reviews[reviews.findIndex(x => x.reviewer._id === myId)]
        reviews.splice(reviews.indexOf(myReview), 1)
      } else {
        myReview = {}
      }

      commit('setBeerInfo', { beer, reviews, myReview })
      if (!state.editBeerDialog) {
        commit('toggle', 'beerInfoView')
        commit('truthy', { item: 'beerReviewDialog', bool: true })
      }
    }
  }
}
