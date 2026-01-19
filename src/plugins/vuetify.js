/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
// import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'


// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    dark: false,

    themes: {
      light: {
        colors: {
          primary: '#4CAF50', // Green
        },
      },
      dark: {
        colors: {
          primary: '#4CAF50', // Green
        },
      },
    },
  },
})
