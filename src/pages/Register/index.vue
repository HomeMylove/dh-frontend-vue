<template>
    <div>
      <el-form ref="registerForm" :model="form" :rules="rules" label-width="80px" class="login-box">
        <h3 class="login-title">欢迎注册</h3>
        <el-form-item label="账号" prop="account">
          <el-input type="text" placeholder="请输入账号" v-model="form.account"/>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" placeholder="请输入密码" v-model="form.password"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="onSubmit('registerForm')" class="login-btn">注册</el-button>
        </el-form-item>
        <el-form-item>
            <router-link to="/login" class="register-btn"
              >已有账号？去登陆</router-link>
        </el-form-item>
      </el-form>
  
      <el-dialog
        title="温馨提示"
        :visible.sync="dialogVisible"
        width="30%"
       >
        <span>请输入账号和密码</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
    export default {
      name: "Register",
      data() {
        return {
          form: {
            account: '',
            password: ''
          },
  
          // 表单验证，需要在 el-form-item 元素中增加 prop 属性
          rules: {
            account: [
              {required: true, message: '账号不可为空', trigger: 'blur'}
            ],
            password: [
              {required: true, message: '密码不可为空', trigger: 'blur'}
            ]
          },
  
          // 对话框显示和隐藏
          dialogVisible: false
        }
      },
      methods: {
        onSubmit(formName) {
          // 为表单绑定验证功能
          this.$refs[formName].validate(async (valid) => {
            if (valid) {
               const result = await this.$store.dispatch("user/regisger", this.form);
                // let result = true
                if(result.code === 200){
                    this.$message.success("注册成功！")
                    // 使用 vue-router 路由到指定页面，该方式称之为编程式导航
              this.$router.push("/login");
                }else{
                    this.$message.warning('登陆失败，'+result.msg)
                    this.form = {}
                }
              
            } else {
              this.dialogVisible = true;
              return false;
            }
          });
        }
      }
    }
  </script>
  
  <style scoped>
    .login-box {
        position: relative;
      border: 1px solid #DCDFE6;
      width: 350px;
      margin: 20px auto;
      padding: 35px 35px 35px 35px;
      border-radius: 5px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      box-shadow: 0 0 25px #909399;
      text-align: center;
    }
  
    .login-title {
      text-align: center;
      margin: 0 auto 40px auto;
      color: #303133;
    }

    .login-btn{
        position: absolute;
        text-align: center;
        width: 180px;
        /* margin-bottom: 40px; */
        left: 40%;
        transform:translateX(-50%);
        
    }
    .register-btn{
        position: absolute;
        text-align: center;
        bottom: -55px;
        left: 40%;
        transform:translateX(-50%);
        text-decoration: none;
    }
  </style>