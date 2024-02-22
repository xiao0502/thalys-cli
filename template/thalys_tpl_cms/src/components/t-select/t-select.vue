<template>
    <!--    父组件使用
    <select-list
        v-model="tableQueryAttr.brandId"
        :selectData="brandNameList"
        @on-change="selectSearch"
        @on-search="search"
        child-label="fieldValue"
        child-value="id"
        placeholder="品牌"
    ></select-list>-->

    <vxe-pulldown v-if="!disabled" ref="xDown" :transfer="transfer">
        <template v-slot>
            <Input
                :size="size"
                v-model="inputLabel"
                :placeholder="placeholder"
                @on-focus="focusEvent"
                @on-blur="hidePanel"
                @on-change="keyupEvent"
                clearable
                @on-clear="clearValue"
                :disabled="disabled"
                @on-keydown="keydownEnter"
            >
                <Icon type="ios-arrow-down" slot="suffix" @click="judgeDropdown"></Icon>
            </Input>
        </template>
        <template v-slot:dropdown>
            <vxe-list
                height="200"
                class="my-dropdown"
                :data="curList"
                auto-resize
                :loading="loading"
                :transfer="transfer"
            >
                <template v-slot="{ items }">
                    <div
                        class="list-item"
                        :class="{ active: item[childValue] === inputValue }"
                        v-for="(item, index) in items"
                        :key="index"
                        @click="selectEvent(item)"
                    >
                        <span>{{ item[childLabel] }}</span>
                    </div>
                </template>
            </vxe-list>
        </template>
    </vxe-pulldown>
    <Input v-else :size="size" :value="inputLabel" disabled> </Input>
</template>

<script>
import Vue from 'vue';
import { Pulldown, List } from 'vxe-table';
Vue.use(Pulldown).use(List);
export default {
    name: 'SelectList',
    props: {
        size: {
            default: 'default'
        },
        // 父组件v-model传过来的值
        value: {
            default: 'value'
        },
        // 下拉数据源label
        childLabel: {
            default: 'label'
        },
        // 下拉数据源Value
        childValue: {
            default: ''
        },
        // 默认文字
        placeholder: {
            default: ''
        },
        // 下拉数据源
        selectData: {
            type: Array,
            default: () => {
                return [];
            }
        },
        disabled: {
            type: Boolean,
            default: false
        },
        // 获取数据源loading
        loading: {
            type: Boolean,
            default: false
        },
        // 是否开启远程搜索
        remote: {
            type: Boolean,
            default: false
        },
        // 弹窗和表格内建议开启
        transfer: {
            type: Boolean,
            default: false
        },
        // 是否返回label
        labelInValue: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            inputValue: '', // input的真实value
            inputLabel: '', // input的显示值
            allData: [], // 全部的下拉数据源
            curList: [] // 模糊搜索出来的list
        };
    },
    created() {},
    methods: {
        changeParent(value) {
            this.$emit('input', value); // 这儿必须用input 发送数据，发送的数据会被父级v-model=“test”接受到，再被value=test传回来。
        },
        // 获取焦点展开下拉
        focusEvent() {
            this.$refs.xDown.showPanel();
        },
        // 文本框改变搜索出对应list
        keyupEvent(value) {
            if (this.remote) {
                this.$emit('remote-search', this.inputLabel);
            } else {
                this.curList = this.inputLabel
                    ? this.allData.filter(
                          item => item[this.childLabel] && item[this.childLabel].indexOf(this.inputLabel) > -1
                      )
                    : this.allData;
            }
        },
        // 选择某行list
        selectEvent(item) {
            this.inputLabel = item[this.childLabel];
            this.inputValue = item[this.childValue];
            this.$refs.xDown.hidePanel().then(() => {
                const value = this.labelInValue
                    ? {
                          label: this.inputLabel,
                          value: this.inputValue
                      }
                    : this.inputValue;
                this.changeParent(value);
                this.$emit('on-change', value);
                this.dispatch('FormItem', 'on-form-change', this.inputValue);
                this.curList = this.allData;
            });
        },
        // 点击回车
        keydownEnter(e) {
            const code = e.keyCode || e.which || e.charCode;
            if (code === 13) {
                if (this.curList.length === 1) {
                    this.selectEvent(this.curList[0]);
                    this.$emit('on-search');
                }
            }
        },
        // 文本框失去焦点后
        hidePanel() {
            setTimeout(() => {
                const curData = this.allData.filter(item => item[this.childLabel] === this.inputLabel);
                if (curData.length === 0) {
                    this.clearValue();
                    this.curList = this.allData;
                }
            }, 100);
        },
        // 点击清除按钮
        clearValue() {
            this.inputLabel = '';
            this.inputValue = '';
            this.changeParent('');
            this.$emit('on-change', '');
        },
        // 向上级派发事件
        dispatch(componentName, eventName, params) {
            let parent = this.$parent || this.$root;
            let name = parent.$options.name;

            while (parent && (!name || name !== componentName)) {
                parent = parent.$parent;

                if (parent) {
                    name = parent.$options.name;
                }
            }
            if (parent) {
                parent.$emit.apply(parent, [eventName].concat(params));
            }
        },
        // 点击下拉图片
        judgeDropdown() {
            if (!this.disabled) {
                const isVisible = this.$refs.xDown.isPanelVisible();
                if (isVisible) {
                    this.$refs.xDown.hidePanel();
                } else {
                    this.$refs.xDown.showPanel();
                }
            }
        }
    },
    watch: {
        value: {
            handler(val) {
                this.inputValue = val;
                if (!val && val !== 0) this.inputLabel = '';
                if (this.selectData.length) {
                    const curData = this.selectData.filter(item => item[this.childValue] === this.inputValue);
                    if (curData.length) {
                        this.inputLabel = curData[0][this.childLabel];
                    }
                } else {
                    this.inputLabel = '';
                }
            },
            immediate: true,
            deep: true
        },
        selectData: {
            handler(value) {
                this.allData = value;
                this.curList = value;
                const curData = this.allData.filter(item => item[this.childValue] === this.inputValue);
                if (curData.length) {
                    this.inputLabel = curData[0][this.childLabel];
                    this.inputValue = curData[0][this.childValue];
                }
            },
            deep: true,
            immediate: true
        }
    }
};
</script>

<style scoped lang="less">
.vxe-pulldown {
    width: 100%;
    &.is--visivle {
        /deep/ .ivu-input-suffix {
            .ivu-icon-ios-arrow-down {
                transform: rotate(180deg);
                transition: all 0.2s ease-in-out;
            }
        }
    }
    /deep/ .ivu-input-wrapper {
        display: block;
        .ivu-input-icon {
            width: 28px;
            height: 28px;
            line-height: 28px;
        }
    }
}

.my-dropdown {
    border-radius: 4px;
    background-color: #fff;
    border: 1px solid #dcdfe6;
    padding: 5px 0 5px 6px;
}

.list-item {
    padding: 5px 8px;
    color: #515a6e;
    line-height: 20px;

    &.active {
        color: #1a53e5;
        background: #f3f3f3;
    }

    &:hover {
        background: #f3f3f3;
    }
}
</style>
