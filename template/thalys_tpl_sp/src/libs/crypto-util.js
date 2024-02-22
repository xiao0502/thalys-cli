/* eslint-disable */
const MD5 = require('./md5.js');
import CryptoJS from './aes-js';

function bin2String(t) {
    return String.fromCharCode.apply(String, t);
}

function string2Bin(t) {
    for (var r = [], e = 0; e < t.length; e++) r.push(t.charCodeAt(e));
    return r;
}

function toUTF8Array(t) {
    for (var r = [], e = 0; e < t.length; e++) {
        var n = t.charCodeAt(e);
        n < 128
            ? r.push(n)
            : n < 2048
            ? r.push(192 | (n >> 6), 128 | (63 & n))
            : n < 55296 || n >= 57344
            ? r.push(224 | (n >> 12), 128 | ((n >> 6) & 63), 128 | (63 & n))
            : (e++,
              (n = 65536 + (((1023 & n) << 10) | (1023 & t.charCodeAt(e)))),
              r.push(240 | (n >> 18), 128 | ((n >> 12) & 63), 128 | ((n >> 6) & 63), 128 | (63 & n)));
    }
    return r;
}

const KEY_BIT_SIZE = 128,
    byteToInt = (t, r) => {
        let e = t.charCodeAt(r);
        e = (255 & e) << 24;
        let n = t.charCodeAt(r + 1);
        n = (255 & n) << 16;
        let o = t.charCodeAt(r + 2);
        o = (255 & o) << 8;
        let p = t.charCodeAt(r + 3),
            i = e | n | o | (p &= 255);
        return Math.abs(i);
    },
    doMD5Sign = t => {
        let r = MD5(t, null, !0),
            e = byteToInt(r, 0),
            n = byteToInt(r, 4),
            o = byteToInt(r, 8),
            p = byteToInt(r, 12);
        return e.toString(10) + n.toString(10) + o.toString(10) + p.toString(10);
    };
var iv = CryptoJS.enc.Utf8.parse('');
const initKey = t => {
        var r = toUTF8Array(t);
        let e = new Array(16);
        for (let t = 0; t < e.length; t++) r.length > t ? (e[t] = r[t]) : (e[t] = 0);
        return CryptoJS.enc.Utf8.parse(bin2String(e));
    },
    encrypt = (t, r) => {
        var e = CryptoJS.AES.encrypt(t, initKey(r), { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        return CryptoJS.enc.Base64.stringify(e.ciphertext).replace(/\+/g, '-').replace(/\//g, '_');
    },
    decrypt = (t, r) => {
        t = t.replace(/\-/g, '+').replace(/_/g, '/');
        var e = CryptoJS.AES.decrypt(t, initKey(r), { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        return CryptoJS.enc.Utf8.stringify(e);
    };
export { doMD5Sign, encrypt, decrypt };
/* eslint-disable no-new */
