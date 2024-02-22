<template>
    <div class="btn-list">
        <div class="action-btn" v-for="(item, index) in list" :key="index">
            <template v-if="!Array.isArray(item)">
                <!-- <Upload action="" :format="item.uploadAttr.format"></Upload> -->
                <div class="action-btn" @click="handleAction(item)">
                    {{ item.label }}
                </div>
            </template>
            <template v-else>
                <Dropdown transfer class="action-btn" @on-click="handleAction">
                    <a href="javascript:void(0)"> 更多 </a>
                    <DropdownMenu slot="list">
                        <DropdownItem v-for="(it, index) in item" :key="index" :name="it.label">
                            {{ it.label }}
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </template>
        </div>
    </div>
</template>

<script>
import btnRightList from '@/libs/btnRightList';
export default {
    data() {
        return {
            btnRightList
        };
    },
    props: {
        // 按钮集合
        btnList: {
            type: Array,
            default: () => []
        },
        // 按钮当前所在行
        currentRow: {
            type: Object,
            default: () => {}
        },
        statusKey: {
            type: [String, Array],
            default: 'status'
        }
    },
    methods: {
        handleAction(item) {
            if (typeof item.click === 'function') {
                item.click(this.currentRow);
            } else {
                const index = this.btnList.findIndex(it => it.label === item);
                if (index !== -1 && typeof this.btnList[index].click === 'function') {
                    this.btnList[index].click(this.currentRow);
                } else {
                    console.warn('click is empty');
                }
            }
        }
    },
    computed: {
        // 通过状态和权限判断按钮是否显示，超过2个按钮显示更多
        list() {
            const arr = this.btnList.filter(item => {
                let statusKey = '';
                // statusKey是数组，则判断取值, 用户statusKey是不同的情况下
                if (Array.isArray(this.statusKey)) {
                    statusKey = this.statusKey.find(value => {
                        return item[value];
                    });
                } else {
                    statusKey = this.statusKey;
                }
                if (Array.isArray(item[statusKey])) {
                    return (
                        item[statusKey].includes(this.currentRow[statusKey]) &&
                        this.$store.getters.getAccess.includes(item.permissions) &&
                        (item.customJudgment && typeof item.customJudgment === 'function'
                            ? item.customJudgment(this.currentRow)
                            : true)
                    );
                } else {
                    return !item[statusKey]
                        ? this.$store.getters.getAccess.includes(item.permissions)
                        : item[statusKey] === this.currentRow[statusKey] &&
                              this.$store.getters.getAccess.includes(item.permissions) &&
                              (item.customJudgment && typeof item.customJudgment === 'function'
                                  ? item.customJudgment(this.currentRow)
                                  : true);
                }
            });

            if (arr.length > 2) {
                return [arr[0], [...arr.filter((it, i) => i !== 0)]];
            } else {
                return arr;
            }
        }
    }
};
</script>

<style lang="less" scoped></style>
