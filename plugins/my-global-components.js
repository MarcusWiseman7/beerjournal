import Vue from 'vue'
import BeerBanner from '~/components/UI/BeerBanner'

const components = {
  BeerBanner
}

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
