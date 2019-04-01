export const state = () => {}

export const mutations = {
  setUser(state, user) {
    state.auth.user = Object.assign({}, state.auth.user, user)
  }
}

export const getters = {}
