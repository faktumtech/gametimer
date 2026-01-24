import 'vuetify/styles'
import { createVuetify } from 'vuetify'

// we don´t use any icon set. The fue icons used are directly defined as svg in the components.

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    dark: false,

    themes: {
      light: {
        colors: {
          primary: '#4CAF50' // Green
        }
      },
      dark: {
        colors: {
          primary: '#4CAF50' // Green
        }
      }
    }
  }
})
