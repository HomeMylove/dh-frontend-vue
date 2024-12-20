<template>
    <div class="settings">
        <div class="container">
            <el-form class="setting-form" ref="form" size="small" :model="form" label-width="80px">
                <el-form-item label="用户名">
                    <el-input class="in-username" v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="账户名">
                    {{ form.account }}
                </el-form-item>
                <el-form-item label="签名">
                    <el-input class="in-signature" type="textarea" v-model="form.signature"></el-input>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="form.gender">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <!-- <el-button>取消</el-button> -->
                </el-form-item>
            </el-form>
        </div>


    </div>
</template>
  
<script>
import { mapState } from "vuex";
import { } from '@/api/index'
export default {
    name: "Settings",
    data() {
        return {
            form: {
                username:'',
                account:'',
                signature:'',
                gender:1
            }
        }
    },
    async mounted() {
        const {id} = this.$route.params
        await this.$store.dispatch('user/getUserInfo',id)
        this.form = {...this.user}
    },
    methods: {
       async onSubmit(){
            const result = await this.$store.dispatch('user/updateUserInfo',this.form)
            if(result){
                this.$message.success('成功')
            }

        }
    },
    computed: {
        ...mapState("user", ["user"]),
    },
};
</script>
  
<style lang="less" scoped>
.settings {
    position: relative;
    width: 960px;
    // background-color: red;
    box-sizing: border-box;
    padding: 0 60px;
    border: 1px solid #eee;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);


    .container {
        margin: 0 auto;

        .setting-form {
            width: 800px;

            .in-username {
                width: 300px;
            }
        }
    }

}
</style>
  