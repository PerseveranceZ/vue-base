<template>
    <div>
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
        <Login></Login>
        <Back-top ref="backTop"></Back-top>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import { LOGIN_CODE } from 'Config/index';
import Login from 'Common/login'

export default {
    components: {
        Login
    },
    methods: {
        ...mapActions(['getUserInfo']),
        bindEvent() {
            GLOBAL.vbus.$on('ajax_handle_error', (resData) => {
                if(!!resData.config.noShowDefaultError) return
                if (resData.data.resCode === LOGIN_CODE) {
                    this.$store.commit('SET_TO_LOGIN_PATH', this.$route.path)
                    this.$store.commit('SET_TO_LOGIN', true)
                    return
                }
                this.$Notice.warning({
                    title: '操作失败',
                    desc: resData.data.msg,
                    onClose() { }
                });
            })
            GLOBAL.vbus.$on('request_error', (resData) => {
                this.$Notice.error({
                    title: '请求服务器失败',
                    desc: '请检查您的网络连接情况',
                    onClose() {
                        //放入接口错误处理
                    }
                });
            })
            GLOBAL.vbus.$on('response_error', (resData) => {
                this.$Notice.error({
                    // TODO: 添加code码
                    title: '服务器在开小差',
                    desc: '请稍后重试',
                    onClose() {
                        //放入接口错误处理
                    }
                });
            })
            GLOBAL.vbus.$on('scrollToTop', (resData) => {
                this.$refs.backTop.back()
            })
        },
        init() {
            this.getUserInfo()
            
        }
    },
    created() {
        this.init()
        this.bindEvent()
        this.$Notice.config({
            top: 70,
            duration: 5
        })
        this.$Message.config({
            top: 10,
            duration: 5
        });
    }
}
</script>
<style>
@import './assets/style/index.scss';
</style>

