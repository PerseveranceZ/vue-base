<template>
    <!--<div class="layout" v-if="!$store.state.toLogin">
        <div class="layout-content">
            <div class="layout-left">
                <LayoutHeader></LayoutHeader>
                <LayoutNavbar></LayoutNavbar>
                <LayoutManage></LayoutManage>
            </div>
            <div class="layout-content-wapper">
                <div class="layout-content-main">
                    <transition name="move" mode="out-in">
                        <router-view></router-view>
                    </transition>
                    <div class="layout-copy">
                    Copyright © 2017 
                    </div>
                </div>
            </div>
        </div>
    </div>-->
    <div>
        主页
        <div class="ccccccccccccc">样式测试</div>
        <Button @click="jump">路由懒加载跳转</Button>
        <Button @click="getApi">发送Service层请求</Button>
        <Button @click="popDownLogin">弹出登录页</Button>
        <Button @click="popUpLogin">收起登录页</Button>
        {{$consts['other/MENU']}}
        <transition name="move" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
    // import LayoutHeader from 'Common/header/index'
    // import LayoutNavbar from 'Common/navbar/index'
    // import LayoutManage from 'Common/manage/index'
    // import LayoutBreadcrumb from 'Common/breadcrumb/index'

    export default {
    //     components: {
    //         LayoutHeader,
    //         LayoutNavbar,
    //         LayoutManage,
    //         LayoutBreadcrumb,
    //         IndexModal
    //     }
    // }
        methods :{
            jump() {
                this.$router.push({
                    name: 'dashboard'
                })
            },
            getApi() {
                this.$apis['other/test']({
                    a:2,
                    b:2,
                    c:3
                }, {
                    noShowDefaultError: true
                }).then(resData => {
                    console.log(resData)
                })
            },
            popDownLogin() {
                this.$store.commit('SET_TO_LOGIN_PATH', this.$route.path)
                this.$store.commit('SET_TO_LOGIN', true)
            },
            popUpLogin() {
                this.$store.commit('SET_TO_LOGIN', false)
            }
        }
    }
</script>
