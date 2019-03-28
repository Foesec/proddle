import '@babel/polyfill';
import Vue from 'vue';
import './plugins/fontawesome';
import Buefy from 'buefy';
import App from './App.vue';
import router from './router';
import store from './store';

import './assets/style/custom.scss';

Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
