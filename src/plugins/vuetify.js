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
    } 
})
