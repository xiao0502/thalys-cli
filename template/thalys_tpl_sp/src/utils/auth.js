/**
 * 获取用户的当前设置（授权及订阅消息)
 */
function getSettingAsync() {
    return new Promise((resolve, reject) => {
        uni.getSetting({
            success: r => {
                resolve(r);
            },
            fail: e => {
                reject(e);
            }
        });
    });
}
/**
 * 获取微信登录code
 */
function loginAsync() {
    return new Promise((resolve, reject) => {
        uni.getProvider({
            service: 'oauth',
            success(res) {
                console.log(res, 'loginAsync');
                uni.login({
                    provider: res.provider,
                    scopes: 'auth_base',
                    success: r => resolve(r.code),
                    fail: e => reject(e)
                });
            }
        });
    });
}
/**
 * 获取用户信息
 */
function getUserInfoAsync() {
    return new Promise((resolve, reject) => {
        uni.getUserInfo({
            success: r => {
                resolve(r);
            },
            fail: e => {
                reject(e);
            }
        });
    });
}

export { getSettingAsync, loginAsync, getUserInfoAsync };
