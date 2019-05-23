import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import IconArrowBack from '../components/IconArrowBack.vue'
Vue.use(Vuetify, {
  // iconfont: 'md',
  icons: {
    arrowBack: {
      component: IconArrowBack
    }
  }
})
