/*
 * @Author: 肖锦
 * @Date: 2021-06-04 09:24:03
 * @LastEditTime: 2021-10-18 11:19:13
 * @Description: file content
 * @LastEditors: Please set LastEditors
 */
import { login, logout, getUserInfo } from '@/api/user';
import { setToken, getToken } from '@/libs/util';
import _this from '@/main';

export default {
    state: {
        userName: '',
        userId: '',
        token: getToken(),
        access: '',
        hasGetInfo: false
    },
    getters: {
        realName: state => state.realName
    },
    mutations: {
        setAvatar(state, avatarPath) {
            state.avatarImgPath = avatarPath;
        },
        setUserId(state, id) {
            state.userId = id;
        },
        setUserName(state, name) {
            state.userName = name;
        },
        setRealName(state, name) {
            state.realName = name;
        },
        setAccess(state, access) {
            state.access = access;
        },
        setToken(state, token) {
            state.token = token;
            setToken(token);
        },
        setHasGetInfo(state, status) {
            state.hasGetInfo = status;
        }
    },
    actions: {
        // 登录
        handleLogin({ commit }, { userName, password }) {
            userName = userName.trim();
            return new Promise((resolve, reject) => {
                login({
                    userName,
                    password
                })
                    .then(res => {
                        if (res.status === _this.code) {
                            commit('setToken', res.content.accessToken);
                        }
                        resolve(res);
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        },
        // 退出登录
        handleLogOut({ state, commit }) {
            return new Promise((resolve, reject) => {
                logout(state.token)
                    .then(() => {
                        commit('setToken', '');
                        commit('setAccess', []);
                        resolve();
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        },
        // 获取用户相关信息
        getUserInfo({ state, commit }) {
            return new Promise((resolve, reject) => {
                try {
                    getUserInfo(state.token)
                        .then(res => {
                            if (res.status === _this.code) {
                                const data = res.content;
                                commit('setUserName', data.userName);
                                commit('setRealName', data.realName);
                                commit('setUserId', data.userId);
                                commit('setAccess', data.resources || []);
                                commit('setHasGetInfo', true);
                            }
                            resolve(res);
                        })
                        .catch(err => {
                            reject(err);
                        });
                } catch (error) {
                    reject(error);
                }
            });
        }
    }
};
