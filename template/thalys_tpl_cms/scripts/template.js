module.exports = {
    vueTemplate: componentName => {
        return `<template>
     <div class="page page-${componentName}">
         <Card dis-hover :bordered="false" class="wrapper-query">
             <p slot="title">
                 <Icon type="ios-search"></Icon>
                 查询条件
             </p>
             <div slot="extra">
                 <Button @click="search" icon="md-search">查询</Button>
                 <Button @click="reset" icon="md-refresh">重置</Button>
                 <Button
                     @click="queryToggle"
                     :icon="queryToggleFlag ? 'ios-arrow-up' : 'ios-arrow-down'"
                 >
                     {{ queryToggleFlag ? '折叠' : '展开' }}
                 </Button>
             </div>

             <Row :gutter="16" class="mb10">
                 <Col span="6" class="maxWidth"></Col>
             </Row>
         </Card>

         <Card dis-hover :bordered="false" class="wrapper-content">
            <p slot="title">
                <Icon type="md-list"></Icon>
                列表
            </p>
            <t-table
                id="${componentName}-table"
                @on-selection-change="selectionChange"
                @on-page-no-change="pageNoChange"
                @on-page-size-change="pageSizeChange"
                :columns="columns"
                :data="tableData"
                :loading="tableLoading"
                :total="total"
                :reset-current="tableComAttr.currentPage === 1"
            ></t-table>
         </Card>

         <Modal
            v-model="modalShowFlag"
            width="912"
            class-name="${componentName}-modal"
            :title="modalTitle"
            :mask-closable="maskClosable"
            @on-cancel="modalCancel"
        >
            <div slot="footer">
                <Button
                    @click="modalCancel"
                    type="text"
                >取消</Button>
                <Button
                    :loading="getRequestingFlag"
                    @click="modalOk"
                    type="primary"
                    >确定</Button
                >
            </div>
        </Modal>
     </div>
 </template>

<script>
import tableMixin from '@/mixins/tableMixin';

export default {
    data() {
        return {
            tableQueryAttr: {},
            columns: [],
            formAttr: {}
        }
    },

    mixins: [tableMixin],

    methods: {
        modalOk() {},

        async getTableList() {
            this.getTableListFn(async getListMixin => {
                const params = Object.assign(
                    {},
                    this.tableComAttr,
                    this.tableQueryAttr
                );
                // const res = await queryResidentPages(params);

                // if (res.code === this.code) {
                //     getListMixin(res);
                // }
            });
        }
    }
}
</script>

<style lang="less" scoped>
.page-${componentName} {}
</style>
`;
    }
};
