/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-08-09 16:25:22
 * @LastEditTime: 2021-10-18 10:51:18
 * @LastEditors: Please set LastEditors
 */
import { hasOneOf, resetObj } from '@/libs/tools';
import { mapGetters } from 'vuex';
import btnRightList from '@/libs/btnRightList';
import enumeration from '@/config/enumeration.js';
import { getFieldValues } from '@/api/common';
import _ from 'lodash';

const { statusList, flagList, orderStatusList, orderStatusAuditList, sexList } = enumeration;

export default {
    data() {
        return {
            tableComAttr: {
                currentPage: 1,
                pageSize: 10
            }, // 表格公用参数
            tableData: [], // 表格数据展示
            tableLoading: false, // 加载表格loading
            total: 0, // 表格总条数
            statusList, // 状态数组
            flagList, // 是否数组
            orderStatusList, // 单据状态
            orderStatusAuditList, // 单据审核操作状态
            sexList,
            modalShowFlag: false, // modal显示开关
            modalTitle: '', // modal标题
            modelLoading: true, // 点击确定按钮时，确定按钮是否显示 loading 状态
            currentId: null, // 当前编辑数据的id，没有则代表是新增
            tableSelectValue: [], // 表格选择value
            tableSelectList: [], // 表格选择完整
            maskClosable: false, // 点击遮罩层不允许关闭modal
            btnRightList
        };
    },
    created() {
        if (!this.tableFlag) {
            this.getTableList();
        }
    },
    computed: {
        ...mapGetters(['getAccess', 'getUserName', 'getRequestingFlag', 'realName'])
    },
    methods: {
        /**
         * 改变页码
         * @param value
         */
        pageNoChange(value, flag) {
            this.tableComAttr.currentPage = value;
            this.getTableList(flag);
        },
        /**
         * 改变每页条数
         */
        pageSizeChange(value, flag) {
            // this.tableData = [];
            this.tableComAttr.currentPage = 1;
            this.tableComAttr.pageSize = value;
            this.getTableList(flag);
        },
        // 处理modal确认异步
        changeLoading(load) {
            if (load) {
                this[load] = false;
                this.$nextTick(() => {
                    this[load] = true;
                });
            } else {
                this.modelLoading = false;
                this.$nextTick(() => {
                    this.modelLoading = true;
                });
            }
        },
        /**
         * 多选改变
         * @param value
         */
        selectionChange(value, key) {
            this.tableSelectValue = value.map(item => {
                return key ? item[key] : item.id;
            });

            if (this.exportFlag) {
                value.sort((a, b) => {
                    return a.exportDataIndex - b.exportDataIndex;
                });
            }

            this.tableSelectList = value;
        },
        /**
         * 编辑当前行表格数据
         * @param params
         */
        editTableData(params, modalTitle, callBack) {
            console.log(params, 'editTableData params');
            this.modalTitle = modalTitle;
            this.currentId = params.row.id;
            for (let key in this.formAttr) {
                this.formAttr[key] = params.row[key];
            }
            if (callBack) callBack(params.row);
            setTimeout(() => {
                this.modalShowFlag = true;
            }, 200);
        },
        // modal 关闭
        modalCancel(callBack) {
            if (this.modalShowFlag) this.modalShowFlag = false;
            setTimeout(() => {
                this.currentId = null;
                if (this.readonly) this.readonly = false;
                this.formAttr && resetObj(this.formAttr);
                this.callAgain(() => {
                    this.$refs['formValidate'] && this.$refs['formValidate'].resetFields();
                });
                if (typeof callBack === 'function') callBack();
            }, 300);
        },
        callAgain(fn) {
            if (fn && typeof fn === 'function') {
                fn();
                setTimeout(() => {
                    fn();
                }, 100);
            }
        },
        /**
         * modal 确认
         * @param msg
         */
        todoOver(msg) {
            this.modalShowFlag = false; // 关闭弹窗
            if (msg) this.$Message.success(msg); // 提示消息
            this.modalCancel(); // 执行取消操作重置信息
            this.tableComAttr.currentPage = 1;
            this.getTableList();
        },
        /**
         * 新增编辑
         * @param modalTitle
         */
        addItem(modalTitle) {
            setTimeout(() => {
                this.modalShowFlag = true;
            }, 200);
            this.modalTitle = modalTitle;
        },
        modalFormReset(formValidate, formAttr) {
            this.$refs[formValidate || 'formValidate'] && this.$refs[formValidate || 'formValidate'].resetFields();
            this[formAttr || 'formAttr'] && resetObj(this[formAttr || 'formAttr']);
        },
        /**
         * 重置
         * @param todoFlag  获取table前需要执行的开关
         */
        reset(cb) {
            this.tableComAttr.currentPage = 1;
            resetObj(this.tableQueryAttr, 1);
            this.search();
            this.$refs.filter && this.$refs.filter.setQuery(null);
            if (typeof cb === 'function') cb();
        },
        resetObj(obj) {
            if (Object.prototype.toString.call(obj) === '[object Object]') {
                resetObj(obj, 1);
            }
        },
        /**
         * 查询
         */
        search: _.throttle(
            function () {
                this.tableComAttr.currentPage = 1;
                this.getTableList();
            },
            300,
            {
                leading: true,
                trailing: false
            }
        ),
        /**
         * 获取table列表
         * @param getList 具体逻辑单独写
         * @param cb 导出excel
         */
        getTableListFn(getList, cb, flag) {
            this.tableLoading = true;

            if (!flag) {
                this.tableSelectList = [];
                this.tableSelectValue = [];
            }

            getList(res => {
                if (res.code === this.code) {
                    console.log(res);
                    let arr = (res.data && res.data.items) || res.data || [];

                    this.tableData = this.exportFlag
                        ? arr.map((i, index) => {
                              return {
                                  ...i,
                                  exportDataIndex:
                                      (this.tableComAttr.currentPage - 1) * this.tableComAttr.pageSize + index + 1
                              };
                          })
                        : arr;

                    this.setHeight();

                    if (cb) {
                        cb(res);
                    }
                    this.total = res.data && res.data.totalNum;
                }
                this.tableLoading = false;
            });
        },
        // 判断权限按钮
        judgeBtnRight(key) {
            return hasOneOf(this.getAccess, this.btnRightList[key]);
        },
        // 获取系统字段的值
        async getFieldValuesData(dicTypeId, arr, callBack, extra = {}) {
            if (this[arr] && this[arr].length) return;
            const params = {
                dicTypeId,
                ...extra
            };
            const res = await getFieldValues(params);
            if (res.code === this.code) {
                if (arr) {
                    this[arr] = res.data.map(item => {
                        return {
                            ...item,
                            label: item.value,
                            value: item.id
                        };
                    });
                }

                if (callBack) callBack(res.data);
            }
        },
        /**
         * 通过name获取value
         * @param value 根据值
         * @param arr 参考数组
         * @param wantValueFlag 是否想要value
         * @returns {*}
         */
        getNameByValue(value, arr, wantValueFlag) {
            for (let item of arr) {
                if (wantValueFlag) {
                    if (item.name === value) {
                        return item.value;
                    }
                } else {
                    if (item.value === value) {
                        return item.name || item.label;
                    }
                }
            }
        }
    }
};
