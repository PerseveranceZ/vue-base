<template>
    <div class="main" v-if="!$store.state.toLogin">
        <div class="sidebar-menu-con" :style="{width: shrink?'60px':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <LayoutShrinkableMenu
                :shrink="shrink">
                <div slot="top" class="logo-con">
                    <img v-show="!shrink"  src="../assets/image/logo.jpg" key="max-logo" />
                    <img v-show="shrink" src="../assets/image/logo-min.jpeg" key="min-logo" />
                </div>
            </LayoutShrinkableMenu>
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'60px':'200px'}">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{transform: 'rotateZ(' + (this.shrink ? '-90' : '0') + 'deg)'}" type="text" @click="shrink = !shrink;">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <LayoutBreadcrumb></LayoutBreadcrumb>
                    </div>
                </div>
                <div class="header-avator-con">
                    <MessageTip v-model="mesCount"></MessageTip>
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ userinfoGetter.userName }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar :src="userinfoGetter.avatorPath" style="background: #619fe7;margin-left: 10px;"></Avatar>
                        </Row>
                    </div>
                </div>
            </div>
            <div class="tags-con">
                <TagsPageOpened></TagsPageOpened>
            </div>
        </div>
        <div class="single-page-con" :style="{left: shrink?'60px':'200px'}">
            <div class="single-page">
                <transition name="move" mode="out-in">
                    <router-view></router-view>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
    import TagsPageOpened from 'Common/tagsPageOpened';
    import MessageTip from 'Common/messageTip';
    import LayoutBreadcrumb from 'Common/breadcrumb';
    import LayoutShrinkableMenu from 'Common/shrinkableMenu';
    import {
        mapActions,
        mapGetters
    } from 'vuex';
    export default {
        components: {
            MessageTip,
            TagsPageOpened,
            LayoutBreadcrumb,
            LayoutShrinkableMenu
        },
        data() {
            return {
                shrink: false,
                userName: '',
                isFullScreen: false,
                mesCount: 3
            }
        },
        computed: {
            ...mapGetters(['userinfoGetter']),
        },
        methods :{
            handleClickUserDropdown(name){
                if(name === 'loginout'){
                    this.$store.commit('SET_TO_LOGOU')
                }
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
<style scope lang="scss" src="./index.scss">
</style>
