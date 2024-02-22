/*
 * @Author: 肖锦
 * @Date: 2021-06-04 09:24:03
 * @LastEditTime: 2021-10-18 10:51:09
 * @Description: file content
 * @LastEditors: Please set LastEditors
 */
import axios from '@/libs/api.request';

/**
 * 登录
 * @param userName
 * @param password
 * @returns {*|never}
 */
export const login = ({ userName, password }) => {
    const data = {
        userName,
        userPwd: password
    };
    return axios.request({
        url: 'user/signin',
        data,
        method: 'post'
    });
};

/**
 * 获取个人信息
 * @param token
 * @returns {*|never}
 */
export const getUserInfo = token => {
    return axios.request({
        url: 'user/info',
        params: {
            token
        },
        method: 'get'
    });
};

/**
 * 获取菜单列表
 * @returns {*|never}
 */
export const listUserMenus = () => {
    return axios.request({
        url: 'resource/menuList',
        method: 'get'
    });
};

export const logout = token => {
    return axios.request({
        url: 'logout',
        method: 'post'
    });
};
/**
 * 修改登录密码
 * @param newPwd 新密码
 * @param originalPwd 旧密码
 * @returns {*|never}
 */
export const editPassword = ({ originalPwd, newPwd }) => {
    const data = {
        originalPwd,
        newPwd
    };
    return axios.request({
        url: 'user/pwdModify',
        data,
        method: 'post'
    });
};
