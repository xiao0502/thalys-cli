import axios from 'axios';
import { Message } from 'view-design';
import { getToken } from '@/libs/util';
import router from '@/router';
import store from '@/store';
import _this from '@/main';

class HttpRequest {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.queue = {};
    }

    getInsideConfig() {
        const token = getToken();
        const config = {
            baseURL: this.baseUrl,
            headers: {
                'Access-Token': token
            }
        };
        return config;
    }

    destroy(url) {
        delete this.queue[url];
        if (!Object.keys(this.queue).length) {
            // Spin.hide()
        }
    }

    trimStr(str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    }

    interceptors(instance, url) {
        // 请求拦截
        instance.interceptors.request.use(
            config => {
                // 添加全局的loading...
                if (!Object.keys(this.queue).length) {
                    // Spin.show() // 不建议开启，因为界面不友好
                }
                this.queue[url] = true;
                if (config.method === 'get') {
                    config.params = {
                        _t: Date.parse(new Date()) / 1000,
                        ...config.params
                    };
                    if (config.params) {
                        Object.keys(config.params).forEach(item => {
                            if (Object.prototype.toString.call(config.params[item]) === '[object String]') {
                                config.params[item] = this.trimStr(config.params[item]);
                            }
                        });
                    }
                } else if (config.method === 'post') {
                    if (config.data) {
                        Object.keys(config.data).forEach(item => {
                            if (Object.prototype.toString.call(config.data[item]) === '[object String]') {
                                config.data[item] = this.trimStr(config.data[item]);
                            }
                        });
                    }
                    store.commit('setRequestingFlag', true);
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );
        // 响应拦截
        instance.interceptors.response.use(
            res => {
                this.destroy(url);
                if (res.config.method === 'post') {
                    store.commit('setRequestingFlag', false);
                }
                const { data, status } = res;
                return { data, status };
            },
            error => {
                this.destroy(url);
                // let errorInfo = error.response;
                // if (!errorInfo) {
                //     const {
                //         request: { statusText, status },
                //         config,
                //     } = JSON.parse(JSON.stringify(error));
                //     errorInfo = {
                //         statusText,
                //         status,
                //         request: { responseURL: config.url },
                //     };
                // }
                return Promise.reject(error);
            }
        );
    }

    request(options) {
        const instance = axios.create();
        options = Object.assign(this.getInsideConfig(), options);
        this.interceptors(instance, options.url);
        return instance(options)
            .then(res => {
                this.successRequest(res.data);
                return Promise.resolve(res.data);
            })
            .catch(err => {
                console.error('请求错误：', err.response ? err : '网络连接不稳定，请检查网络');
                if (!err.response) {
                    // 断网了
                    const msg = '网络连接不稳定，请检查网络';
                    Message.error(msg);
                    return Promise.resolve({
                        msg,
                        status: -1
                    });
                } else if (err.response) {
                    // 与服务器交互发生异常
                    const msg = '服务器不稳定，请稍后再试';
                    Message.error(msg);
                    return Promise.resolve({
                        msg,
                        status: -1
                    });
                } else {
                    return Promise.reject(err);
                }
            });
    }

    successRequest(res) {
        switch (res.status) {
            case _this.code:
                break;
            case 10003: // 未登录
                store.commit('setToken', '');
                store.commit('setAccess', []);
                store.commit('setRouters', []);
                store.commit('setHasGetInfo', false);
                store.commit('setHasGetRouter', false);
                console.log(router);
                if (router.currentRoute.name !== 'login') {
                    router.replace('login');
                }
                Message.error({
                    content: res.msg,
                    duration: 8,
                    closable: true
                });
                break;
            default:
                Message.error({
                    content: res.msg,
                    duration: 8,
                    closable: true
                });
        }
    }
}

export default HttpRequest;
