/*
 * @Author: 肖锦
 * @Date: 2021-06-04 11:13:52
 * @LastEditTime: 2021-10-18 11:19:11
 * @Description: file content
 * @LastEditors: Please set LastEditors
 */
export default {
    inserted: function (el, binding) {
        const permissionJudge = value => {
            // 此处store.getters.getAccess代表vuex中储存的按钮菜单数据
            let list = store.getters.getAccess;
            if (typeof value === 'string') {
                return list.includes(value);
            } else if (Array.isArray(value)) {
                return value.some(item => {
                    return list.includes(item);
                });
            }
        };
        if (!permissionJudge(binding.value)) {
            el.parentNode.removeChild(el);
        }
    }
};
