// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'vuetify/dist/vuetify.min.css';
import Vue from 'vue'
import Vuetify from 'vuetify';
import App from './App'

Vue.config.productionTip = false
Vue.use(Vuetify);
window.axios = require('axios');
window.Bus = new Vue();

/* eslint-disable no-new */
new Vue({
  el: '#app',
  vuetify: new Vuetify({}),
  components: { App },
  template: '<App/>'
})
