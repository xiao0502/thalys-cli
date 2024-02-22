import { encrypt, doMD5Sign } from '@/libs/crypto-util';
import config from '@/config/index.js';
import qs from 'qs';

let getCommonParams = (params = {}, bol) => {
    // bol = true 为 上传文件接口
    let { c, v, AESkey, isDev } = config;

    const sign = q => {
        return doMD5Sign(`q=${encrypt(q, AESkey)}${AESkey}`);
    };

    let _system = uni.getSystemInfoSync(); // 系统信息
    let _uid = uni.getStorageSync('sp_lhis_uid');
    let _q = bol ? params : params.q || {};

    let getParams = {
        c,
        v,
        y: 'Resident', // 应用端类型（Resident：居民端）
        uid: _uid || '', // 鉴权标识
        q: isDev ? JSON.stringify(_q) : encrypt(JSON.stringify(_q), AESkey), // 参数加密（请求参数集合，除公共参数外所有业务请求参数)
        sign: isDev ? 'djdu7dusufiusgfu' : sign(JSON.stringify(params.sign || {})), // 请求参数签名串
        t: new Date().getTime(), //时间戳
        os: _system.model + '_' + _system.system, // 机型和操作系统版本
        m: _system.version // 小程序承载平台版本号
    };

    getParams = !bol ? { ...getParams } : { ...getParams, ...params };

    return getParams;
};

let getRequestUrl = (url, params) => {
    let { baseUrl, isDev } = config;
    // #ifdef MP-WEIXIN
    let _baseUrl = isDev ? baseUrl.dev : baseUrl.pro;
    // #endif
    // #ifdef H5
    let _baseUrl = '/api';
    // #endif
    return `${_baseUrl}/${url}?${qs.stringify(getCommonParams(params, true))}`;
};

export { getCommonParams, getRequestUrl };
