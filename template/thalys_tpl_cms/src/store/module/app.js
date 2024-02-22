/*
 * @Author: 肖锦
 * @Date: 2021-06-04 09:24:03
 * @LastEditTime: 2021-10-18 11:19:12
 * @Description: file content
 * @LastEditors: Please set LastEditors
 */
import {
    backendMenusToRouters,
    getBreadCrumbList,
    getHomeRoute,
    getMenuByRouter,
    getNextRoute,
    getRouteTitleHandled,
    getTagNavListFromLocalstorage,
    localRead,
    routeEqual,
    routeHasExist,
    setTagNavListInLocalstorage
} from '@/libs/util';
import router from '@/router';
import config from '@/config';
import { listUserMenus } from '@/api/user';
import _this from '@/main';
const { homeName } = config;

const closePage = (state, route) => {
    const nextRoute = getNextRoute(state.tagNavList, route);
    state.tagNavList = state.tagNavList.filter(item => {
        return !routeEqual(item, route);
    });
    router.push(nextRoute);
};

export default {
    state: {
        breadCrumbList: [],
        tagNavList: [],
        homeRoute: {},
        local: localRead('local'),
        errorList: [],
        hasReadErrorPage: false,
        requestingFlag: false, // 是否请求标识
        routers: [],
        hasGetRouter: false
    },
    getters: {
        menuList: (state, getters, rootState) => {
            return getMenuByRouter(state.routers, rootState.user.access);
        }
    },
    mutations: {
        setRouters(state, routers) {
            state.routers = routers;
        },
        setHasGetRouter(state, status) {
            state.hasGetRouter = status;
        },
        setBreadCrumb(state, route) {
            state.breadCrumbList = getBreadCrumbList(route, state.homeRoute);
        },
        setHomeRoute(state, routes) {
            state.homeRoute = getHomeRoute(routes, homeName);
        },
        setTagNavList(state, list) {
            let tagList = [];
            if (list) {
                tagList = [...list];
            } else tagList = getTagNavListFromLocalstorage() || [];
            if (tagList[0] && tagList[0].name !== homeName) tagList.shift();
            let homeTagIndex = tagList.findIndex(item => item.name === homeName);
            if (homeTagIndex > 0) {
                let homeTag = tagList.splice(homeTagIndex, 1)[0];
                tagList.unshift(homeTag);
            }
            state.tagNavList = tagList;
            setTagNavListInLocalstorage([...tagList]);
        },
        closeTag(state, route) {
            let tag = state.tagNavList.filter(item => routeEqual(item, route));
            route = tag[0] ? tag[0] : null;
            if (!route) return;
            closePage(state, route);
        },
        addTag(state, { route, type = 'unshift' }) {
            let router = getRouteTitleHandled(route);
            if (!routeHasExist(state.tagNavList, router)) {
                if (type === 'push') {
                    state.tagNavList.push(router);
                } else {
                    if (router.name === homeName) {
                        state.tagNavList.unshift(router);
                    } else {
                        state.tagNavList.splice(1, 0, router);
                    }
                }
                setTagNavListInLocalstorage([...state.tagNavList]);
            }
        },
        setHasReadErrorLoggerStatus(state, status = true) {
            state.hasReadErrorPage = status;
        },
        setRequestingFlag(state, flag) {
            state.requestingFlag = flag;
        }
    },
    actions: {
        getRouters({ commit, rootState }) {
            return new Promise((resolve, reject) => {
                try {
                    listUserMenus()
                        .then(res => {
                            const {
                                user: { access }
                            } = rootState;
                            if (res.content.length === 0) {
                                _this.$Message.error('该用户没有任何页面权限，无法完成登录');
                                resolve();
                                return;
                            }
                            const noShowMenu = ['noShowMenu', 'hospitalAdmin'];
                            const newData = res.content.filter(item => {
                                return !noShowMenu.includes(item.name);
                            });
                            let routers = backendMenusToRouters(newData, access);
                            if (routers && Array.isArray(routers)) {
                                commit('setRouters', routers);
                                commit('setHasGetRouter', true);
                                resolve(routers);
                            } else {
                                resolve();
                            }
                        })
                        .catch(err => {
                            reject(err);
                        });
                } catch (error) {
                    reject(error);
                }
            });
        },
        resetTag({ state, commit }, list) {
            commit('setTagNavList', list);
        }
    }
};
