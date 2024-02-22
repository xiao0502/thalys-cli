<template>
    <div class="user-avatar-dropdown">
        <Dropdown @on-click="handleClick">
            <Badge :dot="!!messageUnreadCount">
                <!-- <Avatar :src="userAvatar" /> -->
                {{ realName }}
            </Badge>
            <Icon :size="18" type="md-arrow-dropdown"></Icon>
            <DropdownMenu slot="list">
                <DropdownItem name="userInfo">个人资料</DropdownItem>
                <DropdownItem name="logout">退出登录</DropdownItem>
            </DropdownMenu>
        </Dropdown>

        <!--修改密码弹窗-->
        <Modal
            v-model="editPwdFlag"
            :title="modelTitle"
            :loading="modelLoading"
            :mask-closable="false"
            @on-ok="ok"
            @on-cancel="cancel"
        >
            <div class="wrapper">
                <Form ref="editForm" :model="form" :rules="rules" :label-width="100">
                    <FormItem prop="originalPwd" label="旧密码">
                        <Input v-model="form.originalPwd" type="password" placeholder="请输入旧密码"></Input>
                    </FormItem>
                    <FormItem prop="newPwd" label="新密码">
                        <Input v-model="form.newPwd" type="password" placeholder="请输入新密码"></Input>
                    </FormItem>
                    <FormItem prop="reUserPwd" label="确认密码">
                        <Input v-model="form.reUserPwd" type="password" placeholder="请再次输入新密码"></Input>
                    </FormItem>
                </Form>
            </div>
        </Modal>
        <!--个人信息抽屉-->
        <Drawer :closable="false" width="640" title="个人信息" v-model="drawerShowFlag">
            <div class="drawer-user-info">
                <Row>
                    <Col span="12"> <span class="info-name-left">用户姓名:</span>{{ userInfo.realName }} </Col>
                    <Col span="12"> <span class="info-name-left">用户名:</span>{{ userInfo.userName }} </Col>
                </Row>
                <div class="drawer-btn">
                    <Button type="warning" @click="handleClickChange">修改登录密码</Button>
                </div>
            </div>
        </Drawer>
    </div>
</template>

<script>
import './user.less';
import { mapActions, mapGetters } from 'vuex';
import { getUserInfo } from '@/api/user';
import { editPassword } from '@/api/user';

export default {
    name: 'User',
    data() {
        const validateReUserPwd = (rule, value, callback) => {
            if (value === '' || value === null) {
                callback(new Error('确认新密码不能为空'));
            } else if (value !== this.form.newPwd) {
                callback(new Error('两次密码不一致'));
            } else {
                callback();
            }
        };
        return {
            editPwdFlag: false,
            form: {
                originalPwd: '',
                newPwd: '',
                reUserPwd: ''
            },
            rules: {
                originalPwd: {
                    required: true,
                    message: '旧密码不能为空',
                    trigger: 'blur'
                },
                newPwd: {
                    required: true,
                    message: '新密码不能为空',
                    trigger: 'blur'
                },
                reUserPwd: {
                    required: true,
                    validator: validateReUserPwd,
                    trigger: 'blur'
                }
            },
            modelLoading: true,
            modelTitle: '',
            drawerShowFlag: false, // 信息抽屉开关
            userInfo: {}
        };
    },
    props: {
        userAvatar: {
            type: String,
            default: ''
        },
        messageUnreadCount: {
            type: Number,
            default: 0
        }
    },
    computed: {
        ...mapGetters(['realName', 'getAccess', 'userId'])
        // 判断是否有修改密码
        // judgePasswordRight () {
        //     return this.getAccess.includes('user/pwdModify');
        // }
    },
    methods: {
        ...mapActions(['handleLogOut']),
        logout() {
            this.handleLogOut().then(() => {
                this.$router.push({
                    name: 'login'
                });
            });
        },
        message() {
            this.$router.push({
                name: 'message_page'
            });
        },
        handleClick(name) {
            switch (name) {
                case 'logout':
                    this.logout();
                    break;
                case 'userInfo':
                    this.getMyUserInfo();

                    this.drawerShowFlag = true;
                    break;
            }
        },
        // 点击修改密码按钮
        handleClickChange() {
            this.modelTitle = '修改登录密码';
            this.editPwdFlag = true;
        },
        // 提交修改密码
        ok() {
            this.$refs.editForm.validate(async valid => {
                if (!valid) {
                    return this.changeLoading();
                }
                const res = await editPassword({ ...this.form });
                if (res.status === this.code) {
                    this.$Message.success(res.msg);
                    this.cancel();
                } else {
                    this.changeLoading();
                }
            });
        },
        // 关闭弹窗
        cancel() {
            this.editPwdFlag = false;
            this.form = {
                originalPwd: '',
                newPwd: '',
                reUserPwd: ''
            };
            this.$refs['editForm'].resetFields();
        },
        // 获取个人信息
        async getMyUserInfo() {
            const res = await getUserInfo();
            console.log(res);
            if (res.status === this.code) {
                this.userInfo = res.content;
            }
        },
        changeLoading() {
            this.modelLoading = false;
            this.$nextTick(() => {
                this.modelLoading = true;
            });
        }
    }
};
</script>
