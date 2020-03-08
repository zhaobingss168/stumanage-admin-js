<template>
  <!--赵冰 2019.12 系统管理，系统用户管理-->
  <div class="app-container" style="width:99%;margin-top:-35px;">
    <!--工具栏-->
    <div class="filter-container" style="float:left;margin-bottom: 10px;">
      <el-input :size="size" v-model="listQuery.username" placeholder="用户名" clearable style="width: 200px;"
                class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select :size="size" v-model="listQuery.status" placeholder="用户状态" clearable class="filter-item"
                 style="width: 200px">
        <el-option v-for="item in statusS" :key="item.key" :label="item.value" :value="item.key"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" :size="size">
        查找
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="fa fa-plus"
        @click="handleCreate"
        :size="size"
        perms="sys:user:add"
      >
        新增
      </el-button>
    </div>
    <div class="toolbar" style="float:right;padding-right:15px;">
      <el-form :inline="true" :size="size">
        <el-form-item>
          <el-button-group>
            <el-tooltip content="刷新" placement="top">
              <el-button icon="fa fa-refresh" @click="refresh"></el-button>
            </el-tooltip>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <br>
    <!--表格内容-->
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;font-size: 14px"
      size="mini"
    >
      <el-table-column
        align="center"
        label="序号"
        type="index"
        width="50">
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.roleNames }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1"><el-button size="mini" type="success">正常</el-button></span>
          <span v-if="scope.row.status == 0"><el-button size="mini" type="info">锁定</el-button></span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180" align="center" sortable="true">
        <template slot-scope="scope">
          <span v-if="scope.row.createTime != null"><i class="el-icon-time"></i>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后登录时间" width="180" align="center" sortable="true">
      <template slot-scope="scope">
      <span v-if="scope.row.lastLoginTime != null"><i class="el-icon-time"></i>{{ scope.row.lastLoginTime }}</span>
      </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            <i class="el-icon-edit"></i>编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
            <i class="el-icon-delete"></i>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="float:left;"
      @pagination="getList"
    />
    <!--编辑、新增页面-->
    <el-dialog :title="textMap[dialogStatus]" width="40%" top="10%" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style=" margin-left:30px;">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" clearable auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="temp.phone" clearable auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="temp.nickName" clearable auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="userRoles" >
          <el-select v-model="temp.userRoles" multiple placeholder="请选择" style="width: 100%;">
            <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户状态" prop="status" v-if="dialogStatus == 'update'">
          <el-select v-model="temp.status" placeholder="请选择" clearable class="filter-item" style="width: 445px">
            <el-option v-for="item in statusS" :key="item.key" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination

  export default {
    name: 'Config',
    components: {Pagination},
    directives: {waves},
    filters: {},
    data() {
      return {
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        size: "small",// 样式 medium / small / mini
        listQuery: { // 查询条件
          page: 1,
          limit: 10,
          username: '',
          status: '',
        },
        temp: {
          id: null,
          name: null,
          roleId: null,
          username: null,
          status: null,
          phone: null,
          nickName: null,
          userRoles: [],
        },
        statusS: [ // 状态
          {key: 0, value: '锁定'},
          {key: 1, value: '正常'}
        ],
        roleS: '',
        rules: { // 验证数据是否为必填项，如果是空，给出错误提示
          username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
          phone: [{required: true, message: '电话不能为空', trigger: 'blur'}],
          nickName: [{required: true, message: '昵称不能为空', trigger: 'blur'}],
          userRoles: [{required: true, message: '角色不能为空', trigger: 'blur'}],
          status: [{required: true, message: '用户状态不能为空', trigger: 'blur'}]
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        roles: [],
      }
    },
    mounted() {
      this.roleS = []
    },
    created() {
      this.getList()
      this.findRoles()
    },
    methods: {
      // 刷新
      refresh() {
        this.getList()
        this.success()
      },
      // 分页查询
      getList() {
        // 查询条件
        const reqData = {
          'page': this.listQuery.page,
          'size': this.listQuery.limit,
          'username': this.listQuery.username,
          'status': this.listQuery.status,
        }
        this.$api.user.findPage(reqData).then((response) => {
          this.list = response.data.list
          this.total = response.data.totalElements
          this.listLoading = false
        })
      },
      // 加载用户角色信息
      findRoles: function () {
        this.$api.role.findAllRoles().then((res) => {
          // 加载角色集合
          this.roles = res.data
        })
      },
      // 条件查找
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      // 删除一条
      handleModifyStatus(row, status) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let params = []
          params.push({'id':row.id})
          this.$api.user.del(params).then((res) => {
            if (res.code == '0') {
              this.success()
            } else {
              this.error()
            }
            this.dialogFormVisible = false
            this.resetTemp()
            this.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 重置
      resetTemp() {
        this.temp = {
          id: undefined,
          userName: '',
          nickName: '',
          status: ''
        }
      },
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      // 创建
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.temp)
            let userRoles = []
            for(let i=0,len=params.userRoles.length; i<len; i++) {
              let userRole = {
                userId: params.id,
                roleId: params.userRoles[i]
              }
              userRoles.push(userRole)
            }
            params.userRoles = userRoles
            this.$api.user.save(params).then((res) => {
              if (res.code == '0') {
                this.success()
                this.dialogFormVisible = false
                this.resetTemp()
                this.getList()
              } else {
                this.error(res.msg)
              }
            })
          }
        })
      },
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        let userRoles = []
        for (let i = 0, len = row.userRoles.length; i < len; i++) {
          userRoles.push(row.userRoles[i].roleId)
        }
        this.temp.userRoles = userRoles
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      // 修改
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            let params = Object.assign({}, this.temp)
            let userRoles = []
            for(let i=0,len=params.userRoles.length; i<len; i++) {
              let userRole = {
                userId: params.id,
                roleId: params.userRoles[i]
              }
              userRoles.push(userRole)
            }
            params.userRoles = userRoles
            this.$api.user.update(params).then((res) => {
              if (res.code == '0') {
                this.success()
                this.dialogFormVisible = false
                this.resetTemp()
                this.getList()
              } else {
                this.error(res.msg)
              }
            })
          }
        })
      },
      // 操作成功
      success() {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 3000
        })
      },
      // 操作失败
      error(msg) {
        this.$notify({
          title: '失败',
          message: msg,
          type: 'error',
          duration: 3000
        })
      }
    }
  }
</script>

<style scoped>

</style>

