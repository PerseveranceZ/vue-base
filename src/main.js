// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
window.GLOBAL = {}
import Vue from 'vue'
GLOBAL.vbus = window.vbus = new Vue()

import App from './App'
import store from 'Store'
import router from './router'

import iView from 'iview'
import 'iview/dist/styles/iview.css';    // 使用 CSS
import injector from 'Utils/injector'//插件

import BaiduMap from 'vue-baidu-map'


// import 'Components'// 全局组件注册
import 'Config/ajax'
import 'Directives'// 指令

import {DEBUG} from 'Config/index'
Vue.config.productionTip = false

Vue.use(injector)//注册业务所需
Vue.use(iView)//组件库
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'YOUR_APP_KEY'
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})


// vue debug
Vue.config.debug = DEBUG.v_debug
Vue.config.devtools = DEBUG.v_devtools