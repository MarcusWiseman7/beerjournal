import Vue from 'vue'
import MySpinner from '~/components/UI/MySpinner'

const components = { MySpinner }

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
