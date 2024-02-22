<!--
 * @Author: 肖锦
 * @Date: 2021-06-04 10:04:50
 * @LastEditTime: 2021-10-18 11:19:18
 * @Description: file content
 * @LastEditors: Please set LastEditors
-->
<template>
    <div class="page page-home">
        <t-table :data="list" :columns="title"></t-table>
        <t-select :select-data="list"></t-select>
        {{ dayjs().format('YYYY-MM-DD HH:mm:ss') }}
    </div>
</template>

<script>
export default {
    data() {
        return {
            list: [],
            title: [
                {
                    type: 'checkbox',
                    fixed: 'left'
                },
                {
                    type: 'seq',
                    title: '序号',
                    fixed: 'left'
                },
                {
                    title: '姓名',
                    key: 'name'
                },
                {
                    title: '姓名2',
                    key: 'name2'
                },
                {
                    title: '姓名3',
                    key: 'name3'
                },
                {
                    title: '姓名4',
                    key: 'name4'
                },
                {
                    title: '姓名5',
                    key: 'name5'
                },
                {
                    title: '姓名6',
                    key: 'name6',
                    property: 'action'
                }
            ]
        };
    }
};
</script>

<style lang="less" scoped></style>
