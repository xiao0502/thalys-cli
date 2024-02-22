<!--
 * @Author: 肖锦
 * @Date: 2021-06-04 09:24:03
 * @LastEditTime: 2021-10-18 11:19:20
 * @Description: file content
 * @LastEditors: Please set LastEditors
-->
<style lang="less">
@import './login.less';
</style>

<template>
    <div class="login">
        <div class="login-con">
            <Card icon="log-in" title="欢迎登录" :bordered="false">
                <div class="form-con">
                    <login-form @on-success-valid="handleSubmit"></login-form>
                    <p class="login-tip">输入任意用户名和密码即可</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import LoginForm from '_c/login-form';
import { mapActions } from 'vuex';
export default {
    components: {
        LoginForm
    },
    data() {
        return {
            loginLoading: false
        };
    },
    methods: {
        ...mapActions(['handleLogin', 'getUserInfo']),
        handleSubmit({ userName, password }) {
            this.loginLoading = true;
            this.handleLogin({ userName, password }).then(res => {
                if (res.status === this.code) {
                    this.loginLoading = false;
                    this.$router.push({
                        name: this.$config.homeName
                    });
                }
            });
        }
    }
};
</script>

<style></style>
