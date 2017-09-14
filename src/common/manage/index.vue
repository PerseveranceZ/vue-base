<template>
    <div class="layout-userinfo">
        <div v-if="!editing" style="height:200px">
            <h3 class="username">
                {{userInfo.userName}}
            </h3>
            <div class="userinfo">
                <!--<Row class="mg-bt-10">
                            <Col :span="8" style="text-align:right;">uid:</Col>
                            <Col :span="12" style="text-align:left;word-wrap: break-word;" :offset="2">{{userInfo.uid}}</Col>
                        </Row>-->
                <Row class="mg-bt-10">
                    <Col :span="12" style="text-align:right;">所属部门:</Col>
                    <Col :span="10" style="text-align:left;word-wrap: break-word;" :offset="1">{{userInfo.deptName}}</Col>
                </Row>
                <Row class="mg-bt-10">
                    <Col :span="12" style="text-align:right;">所属组:</Col>
                    <Col :span="10" style="text-align:left;word-wrap: break-word;" :offset="1">{{userInfo.projectName}}</Col>
                </Row>
            </div>
        </div>
        <Form ref="infoForm" :model="infoForm" :rules="infoRules" v-show="editing" style="height:200px">
            <Form-item prop="userName" label="用户名">
                <Input type="text" v-model="infoForm.userName" placeholder="请输入，必填"></Input>
            </Form-item>
            <Form-item prop="allId" label="部门信息">
                <Cascader v-model="infoForm.allId" :data="deptList" change-on-select placeholder="请选择，必选"></Cascader>
            </Form-item>
        </Form>
        <div class="userhandle">
            <Button-group shape="circle" v-if="!editing">
                <Button icon="edit" type="primary" @click="edit">编辑</Button>
                <!--todo delete-->
                <Button icon="edit" type="primary" @click="aboutme">与我相关</Button>
                <Button icon="log-out" @click="loginout">登出</Button>
            </Button-group>
            <Button-group shape="circle" v-else>
                <Button icon="ios-sunny-outline" type="primary" @click="save" :loading="saveLoading">保存</Button>
                <Button icon="ios-crop" @click="editing = false">取消</Button>
            </Button-group>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            editing: false,
            saveLoading: false,
            userInfo: {},
            deptList: [],

            infoForm: {
                userName: '',
                allId: [],
            },
            infoRules: {
                userName: [{
                    required: true,
                    message: '请填写您的姓名',
                }],
                allId: [{
                    required: true,
                    message: '请选择所属部门和组',
                }]
            }
        }
    },
    created() {
        this.getUserInfo()
    },
    methods: {
        edit() {
            this.editing = true
            this.$apis['other/allGroup']().then(resData => {
                this.deptList = this.handleDeptList(resData)
                this.$nextTick(() => {
                    this.infoForm.userName = this.userInfo.userName
                    this.infoForm.allId = [this.userInfo.deptId, this.userInfo.projectId]
                })
            })
        },
        handleDeptList(deptList) {
            return deptList.map(dept => {
                let children = dept.groupList.map(group => {
                    return {
                        label: group.name,
                        value: group.groupId,
                    }
                })
                return {
                    label: dept.name,
                    value: dept.groupId,
                    children
                }
            })
        },
        save() {
            this.$refs.infoForm.validate((valid) => {
                if (valid) {
                    this.saveLoading = true
                    let {userName, allId} = this.infoForm
                    let params = {
                        uid: this.userInfo.uid,
                        userName: userName,
                        deptId: allId[0],
                        projectId: allId[1]
                    }
                    this.$apis['user/save'](params).then(() => {
                        setTimeout(() => {
                            this.$Message.info('修改成功!若数据未修改刷新页面即可')
                            this.editing = false
                            this.getUserInfo()
                            this.saveLoading = false
                        }, 1500)
                    }, error => {
                        this.saveLoading = false
                    })
                } else {
                    this.$Message.error('表单验证失败!')
                }
            })
        },
        getUserInfo() {
            this.$apis['user/info']().then(resData => {
                this.userInfo = resData
            })
        },
        loginout() {
            this.$store.commit('SET_TO_LOGIN_PATH', this.$route.path)
            this.$store.commit('SET_TO_LOGIN', true)
        },
        aboutme() {
            this.$apis['user/aboutme']()
        }
    }
}
</script>
