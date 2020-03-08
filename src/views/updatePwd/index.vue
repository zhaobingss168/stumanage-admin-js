<template>
  <!--赵冰 2019.12 修改密码 -->
  <div class="app-container">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"  class="demo-ruleForm">
      <el-form-item label="原始密码" prop="oldPass">
        <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="新的密码" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" style="width: 300px"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="back()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    let validateOldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入原始密码'))
      } else {
        callback()
      }
    }
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        oldPass: '', // 原始密码
        pass: '', // 新密码
        checkPass: '' // 确认新密码
      },
      rules: {
        oldPass: [
          { required: true, validator: validateOldPass, trigger: 'blur' }
        ],
        pass: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let userInfo = eval('(' + sessionStorage.getItem("userInfo") + ')')
          const reqData = {
            'username': userInfo.username,
            'oldPwd': this.ruleForm.oldPass,
            'newPwd': this.ruleForm.checkPass
          }
          this.$api.user.updatePwd(reqData).then((res) => {
            if (res.code != "0") {
              this.$notify({
                title: '修改失败',
                message: '原始密码错误',
                type: 'error',
                duration: 2000
              })
            } else {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
              this.resetForm(formName)
            }
          })
        } else {
          return false
        }
      })
    },
    // 清空
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 返回上一层
    back() {
      this.$router.go(-1) // 返回上一层
    }
  }
}
</script>

<style scoped>
.app-container{
  text-align: left;
  margin-left: 50px;
}
</style>
