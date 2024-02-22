/*
 * @Author: 肖锦
 * @Date: 2021-03-17 09:13:22
 * @LastEditTime: 2021-10-18 10:51:11
 * @Description: file content
 * @LastEditors: Please set LastEditors
 */
export default {
    statusList: [
        {
            name: '有效',
            value: 1,
            label: '有效'
        },
        {
            name: '无效',
            value: 0,
            label: '无效'
        }
    ],
    flagList: [
        {
            name: '是',
            value: 1,
            label: '是'
        },
        {
            name: '否',
            value: 0,
            label: '否'
        }
    ], // 是否数组
    orderStatusList: [
        {
            name: '未提交',
            value: 1,
            label: '未提交'
        },
        {
            name: '待审核',
            value: 2,
            label: '待审核'
        },
        {
            name: '已审核',
            value: 3,
            label: '已审核'
        }
    ], // 单据状态
    orderStatusAuditList: [
        {
            name: '待审核',
            value: 2,
            label: '待审核'
        },
        {
            name: '已审核',
            value: 3,
            label: '已审核'
        }
    ], // 单据审核操作状态
    sexList: [
        // {
        //     value: 0,
        //     label: '未知'
        // },
        {
            value: 1,
            label: '男'
        },
        {
            value: 2,
            label: '女'
        }
    ]
};
