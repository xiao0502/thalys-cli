<!--
 * @Author: 肖锦
 * @Date: 2021-06-04 14:41:00
 * @LastEditTime: 2021-10-18 11:19:34
 * @Description: file content
 * @LastEditors: Please set LastEditors
-->
<template>
    <div class="header-bar">
        <sider-trigger :collapsed="collapsed" icon="md-menu" @on-change="handleCollpasedChange"></sider-trigger>
        <!-- <custom-bread-crumb
            show-icon
            style="margin-left: 30px;"
            :list="breadCrumbList"
        ></custom-bread-crumb> -->
        <div class="custom-content-con">
            <slot></slot>
        </div>
    </div>
</template>
<script>
import siderTrigger from './sider-trigger';
import customBreadCrumb from './custom-bread-crumb';
import './header-bar.less';

export default {
    name: 'HeaderBar',
    components: {
        siderTrigger,
        customBreadCrumb
    },
    data() {
        return {
            systemMenuList: []
        };
    },
    props: {
        collapsed: Boolean
    },
    computed: {
        breadCrumbList() {
            return this.$store.state.app.breadCrumbList;
        }
    },
    methods: {
        handleCollpasedChange(state) {
            this.$emit('on-coll-change', state);
        }
    }
};
</script>
