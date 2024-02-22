import { decrypt } from '@/libs/crypto-util';
import config from '@/config';
import qs from 'qs';
import { getCommonParams } from './commonParams';

const successCode = 0;

// 请求的拦截和响应
const install = (Vue, vm) => {
    let { baseUrl, AESkey, isDev } = config;
    let timer;
    let loginTimer; // loading 计时器

    // 全局通用配置
    Vue.prototype.$u.http.setConfig({
        // #ifdef MP-WEIXIN
        baseUrl: isDev ? baseUrl.dev : baseUrl.pro,
        // #endif
        // #ifdef H5
        baseUrl: '/api',
        // #endif
        originalData: true,
        showLoading: false,
        dataType: isDev ? 'json' : 'text'
    });

    Vue.prototype.getImgUrl = imgName => {
        let arr = imgName.split('.');
        let imgType = arr[arr.length - 1];
        const res = uni.getSystemInfoSync();
        return `${config.imgBaseUrl}${imgName.slice(0, imgName.length - imgType.length - 1)}@${
            res.pixelRatio < 3 ? 2 : 3
        }x.${imgType}`;
    };

    // 请求拦截，配置Token等参数
    Vue.prototype.$u.http.interceptor.request = config => {
        if (config.header.loading && !timer) {
            timer = setTimeout(() => {
                uni.showLoading({
                    title: '努力加载中',
                    mask: true
                });

                clearTimeout(timer);
                timer = null;
            }, 600);
        }

        if (config.method === 'POST') {
            const getParams = getCommonParams({
                q: isDev ? {} : config.data
            });
            config.url = `${config.url}?${qs.stringify(getParams)}`;
        }

        requestTransformData(config);
        return config;
    };

    // 响应拦截，判断状态码是否通过
    Vue.prototype.$u.http.interceptor.response = res => {
        uni.hideLoading();
        clearTimeout(timer);

        if (res.statusCode === 200) {
            return responseTransformData(res);
        } else {
            uni.showToast({
                title: '似乎已断开与互联网的连接',
                icon: 'none',
                duration: 3000
            });

            return {
                status: -1,
                msg: '似乎已断开与互联网的连接'
            };
        }
    };
    // 请求拦截参数处理
    const requestTransformData = config => {
        const _data = JSON.stringify(config.data || {});
        const q = config.method !== 'POST' ? config.data : {};

        config.data = {
            ...getCommonParams({
                q,
                sign: q
            }),
            ...(config.method === 'POST'
                ? {
                      data: _data
                  }
                : {})
        };
    };
    // 响应拦截参数处理
    const responseTransformData = res => {
        const data = isDev ? res.data : JSON.parse(decrypt(res.data, AESkey));
        successResponse(data);
        return data;
    };

    // 请求响应成功后的处理
    const successResponse = res => {
        switch (res.code) {
            case 0:
                break;
            case 610200:
                uni.clearStorageSync();

                // #ifdef MP-WEIXIN
                uni.reLaunch({
                    url: '/pages/login/index'
                });
                // #endif
                // #ifdef H5
                uni.reLaunch({
                    url: '/pages/loginWeb/index'
                });
                // #endif
                break;
            default:
                break;
        }
    };

    /**
     * 请求后的处理封装
     * @param res 响应结果
     * @param normalCall 正常回调
     * @param errorCall 异常回调
     */
    Vue.prototype.checkCode = (res, normalCall, errorCall, flag) => {
        if (res?.code === successCode) {
            if (normalCall && typeof normalCall === 'function') {
                normalCall(res.data);
            }
        } else {
            if (errorCall && typeof errorCall === 'function') {
                let _str = res?.message || '网络请求失败，请稍后再试';
                let _failStatus;

                if (res?.content?.code === 1103) {
                    _failStatus = 'loginout';
                } else {
                    _failStatus = 'fail';
                }

                let _err = { ...res, message: _str, failStatus: _failStatus };

                if (!flag) {
                    uni.showToast({
                        title: _str,
                        icon: 'none',
                        duration: 3000
                    });
                }

                errorCall(_err);
            } else {
                uni.showToast({
                    title: res?.message,
                    icon: 'none',
                    duration: 3000
                });
            }
        }
    };
};

export default {
    install
};
