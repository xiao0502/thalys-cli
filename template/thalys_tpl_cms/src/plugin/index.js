/*
 * @Author: 肖锦
 * @Date: 2021-06-07 10:14:35
 * @LastEditTime: 2021-10-18 10:51:20
 * @Description: file content
 * @LastEditors: Please set LastEditors
 */
import cloneDeep from 'lodash/cloneDeep';
const dayjs = require('dayjs');

export default {
    install(Vue) {
        Vue.prototype.cloneDeep = cloneDeep;
        Vue.prototype.code = 10000;
        Vue.prototype.dayjs = dayjs;
        Vue.prototype.$Message.config({
            duration: 5
        });
    }
};
