/*
 * @Author: 肖锦
 * @Date: 2021-06-01 15:48:44
 * @LastEditTime: 2021-10-18 11:23:18
 * @Description: file content
 * @LastEditors: Please set LastEditors
 */
module.exports = {
    vueTemplate: componentName => {
        return `<template>
    <view class="page page-${componentName}">
        ${componentName}组件
    </view>
</template>

<script>
export default {
    data() {
        return {

        }
    },

    methods: {

    }
}
</script>

<style lang="scss">
.page-${componentName} {

}
</style>`;
    },
    routeTemplate: path => {
        return `
module.exports = [
    {
        "path": "${path}",
        "style": {
            "navigationBarTitleText": ""
        }
    }
]
        `;
    }
};
