<template>
    <div class="t-table" :class="className">
        <vxe-toolbar v-if="Boolean(id)" ref="xToolbar" :custom="toolbarCustom" class="vxe-table-toolbar"></vxe-toolbar>
        <vxe-table
            ref="vxeTable"
            border="none"
            highlight-hover-row
            show-header-overflow
            auto-resize
            column-key
            align="center"
            :id="id"
            :stripe="stripe"
            :data="data"
            :loading="loading"
            :max-height="maxHeight"
            :keep-source="keepSource"
            :tooltip-config="tooltipConfig"
            :seq-config="seqConfig"
            :filter-config="filterConfig"
            :edit-config="editConfig"
            :valid-config="validConfig"
            :sort-config="{
                remote: sortRemote
            }"
            :checkbox-config="{
                reserve: checkReserve,
                checkMethod
            }"
            :custom-config="customConfig"
            :edit-rules="editRules"
            :scroll-x="scrollX"
            :scroll-y="scrollY"
            :row-class-name="rowClassName"
            :cell-class-name="cellClassName"
            :row-id="checkReserve ? rowId : '_XID'"
            :highlight-current-row="highlight"
            @edit-closed="editClosedEvent"
            @checkbox-change="selectionChange"
            @checkbox-all="selectionChange"
            @current-change="handleSelectRow"
            @filter-change="filterChange"
            @sort-change="sortChange"
            @radio-change="radioChange"
        >
            <vxe-table-column
                :type="type(item)"
                :title="item.title"
                :key="item.key || item.render || item.slot || item.field"
                :field="item.key || item.render || item.slot || item.field"
                :width="width(item)"
                :min-width="minWidth(item)"
                :fixed="item.fixed || ''"
                :filters="
                    item.filter
                        ? [
                              {
                                  data: '',
                                  label: item.key || item.render || item.slot
                              }
                          ]
                        : undefined
                "
                :filter-method="item.filterMethod || filterInput"
                :edit-render="item.editRender || null"
                :class-name="item.className || null"
                :header-class-name="item.headerClassName || null"
                :formatter="item.formatter || null"
                :show-overflow="showOverflow(item)"
                :sortable="editFlag(item)"
                :resizable="editFlag(item)"
                v-for="item in finalColumns"
            >
                <!--普通插槽-->
                <template v-slot="{ row, rowIndex }" v-if="item.render || (item.slot && !item.editRender)">
                    <slot :name="item.render || item.slot" :row="row" :index="rowIndex"></slot>
                </template>
                <!--编辑插槽-->
                <template v-slot:edit="{ row, rowIndex }" v-if="item.editRender && !item.editRender.name">
                    <slot :name="item.render || item.slot" :row="row" :index="rowIndex"></slot>
                </template>
                <!--筛选插槽-->
                <template v-slot:filter="{ $panel, column }" v-if="item.filter">
                    <vxe-input
                        class="filter-input"
                        type="type"
                        v-for="(option, index) in column.filters"
                        :key="index"
                        v-model="option.data"
                        @input="$panel.changeOption($event, !!option.data, option)"
                        placeholder="请输入"
                    />
                </template>
                <!--表头插槽-->
                <template v-slot:header v-if="item.mandatory">
                    <div class="title" v-contextmenu:contextmenu @contextmenu="contextMenu(item)">
                        <span style="color: red">*</span> {{ item.title }}
                    </div>
                </template>
                <template v-slot:header v-else-if="canFixed(item)">
                    <div class="title" v-contextmenu:contextmenu @contextmenu="contextMenu(item)">
                        {{ item.title }}
                    </div>
                </template>
            </vxe-table-column>
        </vxe-table>
        <vxe-pager
            transfer
            v-if="hasPage"
            :loading="loading"
            background
            @page-change="vxeChangePage"
            align="right"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            :page-sizes="pageSizes"
            :total="total"
            size="small"
            :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'Sizes', 'FullJump', 'Total']"
        >
        </vxe-pager>
        <v-contextmenu ref="contextmenu">
            <v-contextmenu-item v-for="(item, index) in menuList" @click="setFixed(item.type)" :key="index"
                >{{ item.title }}
            </v-contextmenu-item>
        </v-contextmenu>
    </div>
</template>
<script>
import Vue from 'vue';
import Sortable from 'sortablejs';
import contentmenu from '@/assets/plugins/v-contextmenu';
import 'v-contextmenu/dist/index.css';
import XLSX from 'xlsx';
import { VXETable, Edit, Header, Column, Table, Pager, Select } from 'vxe-table';
import XEUtils from 'xe-utils';
import zhCN from 'vxe-table/lib/locale/lang/zh-CN';
import VXETablePluginIView from 'vxe-table-plugin-iview';
import 'vxe-table-plugin-iview/dist/style.css';

Vue.use(contentmenu);
VXETable.setup({
    i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(zhCN, key), args),
    zIndex: 9999,
    modal: {
        minWidth: 500,
        minHeight: 400,
        dblclickZoom: false
    }
});
VXETable.use(VXETablePluginIView);
Vue.use(Header).use(Select).use(Edit).use(Column).use(Pager).use(Table);

const DISABLED_KEYS = ['seq', 'index', 'operate', 'checkbox', 'action'];
const DISABLED_TEXT = ['操作', '序号'];

export default {
    name: 't-table',
    props: {
        // 类名
        className: {
            type: String,
            default: ''
        },
        // 是否有斑马条纹
        stripe: {
            type: Boolean,
            default: true
        },
        // 列配置
        columns: {
            type: Array,
            default: () => {
                return [];
            }
        },
        // 表格数据
        data: {
            type: Array,
            default: () => {
                return [];
            }
        },
        // 表格高度
        maxHeight: {
            type: Number,
            default: 0
        },
        // 表格是否显示加载中
        loading: {
            type: Boolean,
            default: false
        },
        // 设置序号的起始值
        startIndex: {
            type: Boolean,
            default: false
        },
        // 筛选配置项
        filterConfig: {
            type: Object,
            default: () => {}
        },
        // 可编辑配置项
        editConfig: {
            type: Object,
            default: () => {
                return {
                    trigger: 'click',
                    mode: 'row',
                    autoClear: false,
                    activeMethod: true,
                    showIcon: true
                };
            }
        },
        // 校验配置项
        validConfig: {
            type: Object,
            default: () => {}
        },
        // 校验规则配置项
        editRules: {
            type: Object,
            default: () => {}
        },
        // 排序配置项
        // sortConfig: {
        //     type: Object,
        //     default: () => {
        //         return {
        //             remote: false
        //         };
        //     }
        // },
        // 所有列是否使用服务端排序，如果设置为 true 则不会对数据进行处理
        sortRemote: {
            type: Boolean,
            default: false
        },
        // 保持原始值的状态，被某些功能所依赖，比如编辑状态、还原数据等（开启后影响性能，具体取决于数据量）
        keepSource: {
            type: Boolean,
            default: false
        },
        // 是否查看模式，否则为编辑模式
        viewFlag: {
            type: Boolean,
            default: false
        },
        // 横向虚拟滚动开关
        scrollX: {
            type: Object,
            default: () => {
                return {};
            }
        },
        // 纵向虚拟滚动开关
        scrollY: {
            type: Object,
            default: () => {
                return {};
            }
        },
        // 行添加样式
        rowClassName: {
            type: Function
        },
        // 是否开启跨页多选(必须传rowId)
        checkReserve: {
            type: Boolean,
            default: false
        },
        // table的ID，将作为localStorage的key，必须唯一，自定义列使用
        id: {
            type: String,
            default: ''
        },
        // 自定义行数据唯一主键的字段名（行数据必须要有唯一主键，默认自动生成）
        rowId: {
            type: String,
            default: 'id'
        },
        // 是否要高亮当前行
        highlight: {
            type: Boolean,
            default: false
        },
        // 是否有分页
        hasPage: {
            type: Boolean,
            default: true
        },
        pageSizes: {
            type: Array,
            default: () => {
                return [10, 15, 20, 50, 100];
            }
        },
        // 分页总条数
        total: {
            type: Number,
            default: 0
        },
        // 是否重置分页器
        resetCurrent: {
            type: Boolean,
            default: false
        },
        // 是否开启自定义
        customFlag: {
            type: Boolean,
            default: true
        },
        // 复选框是否能够被选择
        checkMethod: {
            type: Function
        },
        // 单元格类名
        cellClassName: {
            type: Function
        }
    },
    data() {
        return {
            tooltipConfig: {
                theme: 'light',
                enterable: true
            }, // tooltip配置
            currentPage: 1, // 当前页
            pageSize: 10,
            toolbarCustom: {
                immediate: false
            },
            finalColumns: [], // 最终显示列
            currentTableTitle: null, // 当前右键的表头文字
            menuList: [] // 右键菜单
        };
    },
    created() {
        // 设置表格列拖拽
        if (this.id) this.columnDrop();
    },
    methods: {
        clearAllCheckbox() {
            this.$refs.vxeTable.clearCheckboxRow();
            this.$refs.vxeTable.clearCheckboxReserve();
        },
        // 右键表头标题
        contextMenu(item) {
            if (!this.id) return;
            const _index = this.finalColumns.findIndex(it => {
                return (item.key || item.field) === (it.key || it.field);
            });
            this.currentTableTitle = Object.assign({}, item, {
                currentIndex: _index
            });
            this.setMenuList(item.fixed);
        },
        // 设置右键菜单 0 固定左侧 1 固定右侧 2 取消固定
        setMenuList(fixed) {
            switch (fixed) {
                case 'left':
                    this.menuList = [
                        {
                            title: '固定右侧',
                            type: 1
                        },
                        {
                            title: '取消固定',
                            type: 2
                        }
                    ];
                    break;
                case 'right':
                    this.menuList = [
                        {
                            title: '固定左侧',
                            type: 0
                        },
                        {
                            title: '取消固定',
                            type: 2
                        }
                    ];
                    break;
                default:
                    this.menuList = [
                        {
                            title: '固定左侧',
                            type: 0
                        },
                        {
                            title: '固定右侧',
                            type: 1
                        }
                    ];
            }
        },
        // 设置固定
        setFixed(type) {
            let currentKey = this.currentTableTitle.key || this.currentTableTitle.field;
            let fixedCol = JSON.parse(localStorage.getItem('FIXED_' + this.id) || '{}');
            let { fullColumn } = this.$refs.vxeTable.getTableColumn();
            switch (type) {
                // 固定左侧
                case 0:
                    fixedCol[currentKey] = 'left';
                    this.finalColumns[this.currentTableTitle.currentIndex].fixed = 'left';
                    fullColumn[this.currentTableTitle.currentIndex].fixed = 'left';
                    break;
                // 固定右侧
                case 1:
                    fixedCol[currentKey] = 'right';
                    this.finalColumns[this.currentTableTitle.currentIndex].fixed = 'right';
                    fullColumn[this.currentTableTitle.currentIndex].fixed = 'right';
                    break;
                // 取消固定
                case 2:
                    fixedCol[currentKey] = '';
                    this.finalColumns[this.currentTableTitle.currentIndex].fixed = '';
                    fullColumn[this.currentTableTitle.currentIndex].fixed = '';
                    break;
            }
            localStorage.setItem('FIXED_' + this.id, JSON.stringify(fixedCol));
            this.$refs.vxeTable.loadColumn(fullColumn);
        },
        // 列的拖拽排序
        columnDrop() {
            this.$nextTick(() => {
                const xTable = this.$refs.vxeTable;
                this.sortable = Sortable.create(
                    xTable.$el.querySelector('.body--wrapper>.vxe-table--header .vxe-header--row'),
                    {
                        group: this.id,
                        handle: '.vxe-header--column:not(.col--fixed)',
                        draggable: '.vxe-header--column:not(.col--fixed)',
                        onEnd: ({ item, newIndex, oldIndex }) => {
                            let { fullColumn, tableColumn } = xTable.getTableColumn();
                            // 转换真实索引
                            let oldColumnIndex = xTable.getColumnIndex(tableColumn[oldIndex]);
                            let newColumnIndex = xTable.getColumnIndex(tableColumn[newIndex]);
                            // 移动到目标列
                            let currRow = fullColumn.splice(oldColumnIndex, 1)[0];
                            fullColumn.splice(newColumnIndex, 0, currRow);
                            xTable.loadColumn(fullColumn);

                            const keyArr = fullColumn.map(item => {
                                return item.property;
                            });
                            localStorage.setItem('SORT_' + this.id, JSON.stringify(keyArr));
                        }
                    }
                );
            });
        },
        // 计算出最终显示列
        showTableColumns(sortColumns, fixedColumns) {
            let oldColumns = [].concat(this.columns);
            // 读取左右固定列信息
            if (fixedColumns) {
                const fixedKeyArr = Object.keys(fixedColumns);
                oldColumns.forEach(item => {
                    const fixed_index = fixedKeyArr.indexOf(item.key || item.field);
                    if (fixed_index > -1) {
                        item.fixed = fixedColumns[fixedKeyArr[fixed_index]];
                    }
                });
            }
            // 读取排序信息
            if (sortColumns && Array.isArray(sortColumns) && sortColumns.length) {
                oldColumns.forEach(item => {
                    const sort_index = sortColumns.indexOf(item.key || item.field);
                    if (sort_index > -1) {
                        item._index = sort_index;
                    }
                });
                oldColumns.sort((a, b) => {
                    return a._index - b._index;
                });
            }
            this.finalColumns = [].concat(oldColumns);
        },
        // 只对 edit-config 配置时有效，单元格编辑状态下被关闭时会触发该事件
        editClosedEvent(value) {
            this.$emit('edit-closed', value);
        },
        // table被勾选触发，区分是否跨页多选
        selectionChange(value) {
            const oldValue = this.$refs.vxeTable.getCheckboxReserveRecords();
            let selectData = value.records || value;
            if (this.checkReserve) {
                selectData = oldValue.concat(selectData);
            }

            this.$emit('on-selection-change', selectData);
        },
        // 只对 highlightCurrentRow 有效，当手动选中行并且值发生改变时触发的事件
        handleSelectRow(params) {
            this.$emit('on-current-change', params.row);
        },
        // 当筛选条件发生变化时会触发该事件
        filterChange(value) {
            this.$emit('filter-change', value);
        },
        // 当排序条件发生变化时会触发该事件
        sortChange(value) {
            this.$emit('sort-change', value);
        },
        // 只对 filters 有效，列的筛选方法，该方法的返回值用来决定该行是否显示
        filterInput({ option, row }) {
            return (row[option.label] || '').toLocaleLowerCase().includes(option.data.toLocaleLowerCase());
        },
        // 分页器改变
        vxeChangePage({ type, pageSize, currentPage }) {
            if (type === 'size') {
                this.currentPage = 1;
                this.pageSize = pageSize;
                this.changePageSize(pageSize);
            } else if (type === 'current') {
                this.changePage(currentPage);
            }
        },
        // 改变页码
        changePage(value) {
            this.$emit('on-page-no-change', value);
        },
        // 切换每页条数时的回调
        changePageSize(value) {
            this.$emit('on-page-size-change', value);
        },
        // 清空排序
        clearSort() {
            this.$refs.vxeTable.clearSort();
        },
        // 取消单行高亮
        clearCurrentTableRow() {
            this.$refs.vxeTable.clearCurrentColumn();
        },
        // 用于 type=checkbox，设置行为选中状态，第二个参数为选中与否
        setCheckboxRow(rows, value = true) {
            this.$refs.vxeTable.setCheckboxRow(rows, value);
        },
        // 导出excel
        exportCsv(config, customExcludeColumns) {
            if (!XLSX) return;
            let keys = [];
            let title = [];
            let excludeColumns = customExcludeColumns ? customExcludeColumns : ['index'];
            config.columns.map(item => {
                if (excludeColumns.includes(item.type)) {
                    return;
                } else {
                    if (item.key) keys.push(item.key);
                    title.push(item.title);
                }
            });
            let aoa = [title];
            config.data.forEach(item => {
                const row = keys.map(opt => {
                    return item[opt] === 0 ? 0 : item[opt] || '';
                });
                aoa.push(row);
            });
            const ws = XLSX.utils.aoa_to_sheet(aoa);
            const wb = XLSX.utils.book_new(); /*新建book*/
            XLSX.utils.book_append_sheet(wb, ws, 'sheet'); /* 生成xlsx文件(book,sheet数据,sheet命名) */
            XLSX.writeFile(wb, `${config.filename}.xls`); /*写文件(book,xlsx文件名称)*/
        },
        // 获取table
        getVxeTable() {
            return this.$refs.vxeTable;
        },
        // 手动清空筛选条件（如果不传 column 则清空所有筛选条件），数据会恢复成未筛选的状态
        clearFilter() {
            this.$refs.vxeTable.clearFilter();
        },
        // 用于 type=checkbox，手动清空用户的选择
        clearCheckboxRow() {
            this.$refs.vxeTable.clearCheckboxRow();
        },
        // 用于 checkbox-config.reserve，手动清空用户保留选中的行数据
        clearCheckboxReserve() {
            this.$refs.vxeTable.clearCheckboxReserve();
        },
        radioChange(val) {
            this.$emit('radio-change', val);
        }
    },
    computed: {
        // 序号配置
        seqConfig() {
            return {
                startIndex: this.startIndex ? (this.currentPage - 1) * this.pageSize : 0
            };
        },
        // 自定义列配置
        customConfig() {
            if (!this.id) return {};
            return {
                storage: { visible: true, resizable: true },
                checkMethod: ({ column }) => {
                    return !column.type && DISABLED_KEYS.indexOf(column.property || column.field || column.key) === -1;
                }
            };
        },
        // 列是否能排序、改变列宽、显示隐藏
        editFlag() {
            return item => {
                return (
                    !item.type &&
                    DISABLED_KEYS.indexOf(item.property || item.field || item.key) === -1 &&
                    DISABLED_TEXT.indexOf(item.title) === -1
                );
            };
        },
        // 列是否能固定
        canFixed() {
            return item => {
                return (
                    this.id &&
                    !item.type &&
                    DISABLED_KEYS.indexOf(item.property || item.field || item.key) === -1 &&
                    DISABLED_TEXT.indexOf(item.title) === -1
                );
            };
        },
        // 该方法的返回值用来决定该单元格是否允许编辑
        activeRowMethod() {
            return !this.viewFlag;
        },
        // 列的类型，兼容iview
        type() {
            return item => {
                if (item.type === 'index') return 'seq';
                if (item.type === 'selection') return 'checkbox';
                return item.type;
            };
        },
        // 列宽
        width() {
            return item => {
                const arr = ['seq', 'index', 'section', 'checkbox', 'radio'];
                if (arr.indexOf(item.type) !== -1) return item.minWidth || 54;
                if (item.render) return item.width || item.minWidth;
                return 'auto';
            };
        },
        // 列最小宽度
        minWidth() {
            return item => {
                if (item.width) return item.width;
                switch (item.type) {
                    case 'seq':
                    case 'index':
                    case 'checkbox':
                    case 'section':
                    case 'radio':
                        return 54;
                    default:
                        return item.minWidth || 150;
                }
            };
        },
        // 列是否tooltip显示
        showOverflow() {
            return item => {
                if (item.showOverflow) return false;
                return 'tooltip';
            };
        }
    },
    watch: {
        // 查询重置
        resetCurrent(val) {
            if (val) {
                this.currentPage = 1;
            }
        },
        // 列改变
        columns: {
            handler(data) {
                let sortColumns = [];
                let fixedColumns = {};
                let sort = localStorage.getItem('SORT_' + this.id);
                let fixed = localStorage.getItem('FIXED_' + this.id);
                if (this.id && (sort || fixed)) {
                    sortColumns = JSON.parse(sort) || null;
                    fixedColumns = JSON.parse(fixed) || null;
                    this.showTableColumns(sortColumns, fixedColumns);
                } else {
                    this.finalColumns = data.filter(item => {
                        if (typeof item.hidden === 'function') {
                            return item.hidden();
                        }
                        return true;
                    });
                }
            },
            deep: true,
            immediate: true
        }
    },
    beforeDestroy() {
        if (this.sortable) {
            this.sortable.destroy();
        }
    }
};
</script>
<style scoped lang="less">
.t-table {
    flex: 1;
    position: relative;

    /deep/ .row--current {
        background: #0080ff !important;
        color: #fff !important;
    }

    .vxe-table-toolbar {
        position: absolute;
        right: 2px;
        top: 10px;
        z-index: 10;
    }

    /deep/ .vxe-toolbar {
        height: auto;
        background: #f8f8f9;
    }

    /deep/ .vxe-toolbar .vxe-custom--wrapper {
        margin-left: 0;
        box-shadow: none;

        &.is--active {
            .vxe-button {
                box-shadow: none;
            }
        }
    }

    /deep/ .vxe-button.type--button {
        height: 26px;
        min-width: 26px;
        border: none;
        box-shadow: none;
        outline: none;
        padding: 0;
        background: #f8f8f9;
        -webkit-tap-highlight-color: transparent;
    }

    /deep/ .vxe-toolbar .vxe-custom--option-wrapper {
        background: #f8f8f9;
    }
}

/deep/ .vxe-header--row .vxe-header--column.sortable-ghost,
/deep/ .vxe-header--row .vxe-header--column.sortable-chosen {
    background-color: #dfecfb !important;
}

/deep/ .tableImgUrl {
    line-height: 100%;
    img {
        width: 32px;
        height: 32px;
        border-radius: 50%;
    }
}
</style>
