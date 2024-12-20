import axios from 'axios'
import { registerPlugins, type Config } from '@/plugins'
import App from './App.vue'
import { createApp } from 'vue'

axios.get(`${window.location.origin}/api/config`)
.then( response =>{
  const config = response.data as Config
  const app = createApp(App)
  registerPlugins(app, config)
  app.mount('#app')
})
.catch( error => {
  console.error('Error fetching configuration:', error)
})
