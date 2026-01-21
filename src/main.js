/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'
// Composables
import { createApp } from 'vue'
// Directives
import   LongPress from './directives/longpress'
// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)
app.directive('longpress', LongPress)
registerPlugins(app)
app.mount('#app')
