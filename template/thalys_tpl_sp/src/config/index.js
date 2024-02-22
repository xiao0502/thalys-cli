/*
 * @Author: 肖锦
 * @Date: 2021-05-31 14:28:10
 * @LastEditTime: 2021-10-18 11:22:22
 * @Description: file content
 * @LastEditors: Please set LastEditors
 */
export default {
    /**
     * api请求基础路径
     */
    baseUrl: {
        dev: 'https://lhistest.thalys.net.cn/api',
        pro: 'https://lhistest.thalys.net.cn/api'
    },
    isDev: true,
    /**
     * 来源 web端：100 微信公众号：200  微信小程序：300 Android端： 400 IOS端： 500
     */
    // #ifdef MP-WEIXIN
    c: 300,
    // #endif
    // #ifdef H5
    c: 200,
    // #endif
    /**
     * 版本号
     */
    v: '1.1.0',
    /**
     * key
     */
    AESkey: 'fsdfjk12390jqIOJSDKL',
    /**
     * image baseUrl
     */
    imgBaseUrl: 'https://tyche-fe.oss-cn-beijing.aliyuncs.com/sp/sp-lhis/'
    // imgBaseUrl: '/static/img/'
};
