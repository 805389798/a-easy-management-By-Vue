import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import ElementUI from 'element-ui';
import api from '@/network';
// import 'element-ui/lib/theme-chalk/index.css';
import animate from 'animate.css';
import '../public/theme/index.css';
import '@/style/global.css';
import 'normalize.css';
import objectIsEmpty from '@/utils/isEmpty.js';
import msg from '@/utils/message.js';

let Base64 = require('js-base64').Base64;

Vue.config.productionTip = false;
Vue.use(animate);
Vue.use(ElementUI);

//全局节流
const on = Vue.prototype.$on;

Vue.prototype.$on = function(event, func) {
  let previous = 0;
  let newFunc = func;
  if (event === 'click') {
    newFunc = function() {
      const now = new Date().getTime();
      if (previous + 500 <= now) {
        func.apply(this, arguments);
        previous = now;
      }
    };
  }
  on.call(this, event, newFunc);
};

Vue.prototype.$isEmpty = objectIsEmpty;
Vue.prototype.$API = api;
Vue.prototype.$msg = msg;
Vue.prototype.$Base64 = Base64;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
