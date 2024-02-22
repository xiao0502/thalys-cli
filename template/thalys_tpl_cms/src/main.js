/*
 * @Author: 肖锦
 * @Date: 2021-06-04 09:24:03
 * @LastEditTime: 2021-10-18 10:50:41
 * @Description: file content
 * @LastEditors: Please set LastEditors
 */
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store';
import ViewDesign from 'view-design';
import importDirective from '@/directive';
import config from '@/config';
import plugins from '@/plugin';

import TTable from '_c/t-table';
import TSelect from '_c/t-select';

import './style/index.less';
import '@/assets/icons/iconfont.css';
import 'vxe-table/lib/style.css';

importDirective(Vue);

// 全局注册应用配置
Vue.prototype.$config = config;

// view-design UI库
Vue.use(ViewDesign, {
    transfer: true
});
// 全局插件
Vue.use(plugins);
// 全局组件
Vue.component('t-table', TTable);
Vue.component('t-select', TSelect);
/* eslint-disable no-new */
const app = new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
export default app;
