import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import IconArrowBack from '../components/IconArrowBack'

Vue.use(Vuetify)

export default new Vuetify({
  icons: {
    values: {
      arrowBack: {
        component: IconArrowBack
      }
    }
  },
  theme: {
    dark: false,
    themes: {
      light: {
        // official properties
        primary: '#4CAF50' // default
      },
      dark: {
        // official properties
        primary: '#4CAF50' // default
      }
    }
  }
})
