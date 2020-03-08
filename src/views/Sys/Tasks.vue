<template>
  <!--赵冰 2020.2 系统管理，计划任务-->
  <div class="app-container" style="width:99%;margin-top:-35px;">
    <!--工具栏-->
    <div class="filter-container" style="float:left;margin-bottom: 10px;">
      <el-input :size="size" v-model="listQuery.jobName" placeholder="任务名称" clearable style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <!--查找按钮-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" :size="size">
        查找
      </el-button>
      <!--新增按钮-->
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="fa fa-plus"
        @click="handleCreate"
        :size="size"
      >
        新增
      </el-button>
    </div>
    <!--刷新按钮-->
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
      <el-table-column label="任务名称" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.jobName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执行类" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.jobClassName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="任务组别" align="center" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.jobGroupName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="表达式" align="center" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.cronExpression }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上次执行时间" width="180" align="center" sortable="true">
        <template slot-scope="scope">
          <span v-if="scope.row.prevFireTime != null"> <i class="el-icon-time"></i>{{ (scope.row.prevFireTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="下次执行时间" width="180" align="center" sortable="true">
        <template slot-scope="scope">
          <span v-if="scope.row.nextFireTime != null"> <i class="el-icon-time"></i>{{ (scope.row.nextFireTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.triggerStatus == 0"><el-button :size="size" type="success">运行中</el-button></span>
          <span v-if="scope.row.triggerStatus == 1"><el-button :size="size" type="info">已删除</el-button></span>
          <span v-if="scope.row.triggerStatus == 2"><el-button :size="size" type="info">暂停</el-button></span>
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.jobDescription }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180" align="center" sortable="true">
        <template slot-scope="scope">
          <span v-if="scope.row.createTime != null"> <i class="el-icon-time"></i>{{ (scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="360" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="info" size="mini" @click="handlePause(row)">
            <i class="el-icon-video-pause"></i>暂停
          </el-button>
          <el-button type="success" size="mini" @click="handleResume(row)">
            <i class="el-icon-video-play"></i>恢复
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            <i class="el-icon-edit"></i>编辑
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDel(row)">
            <i class="el-icon-delete"></i>删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      style="float:left;"
      @pagination="getList"
    />

    <!--编辑、新增页面-->
    <el-dialog :title="textMap[dialogStatus]" width="40%" top="5%" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px"
               style=" margin-left:30px;">
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="temp.jobName" clearable auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="执行类" prop="jobClassName">
          <el-input v-model="temp.jobClassName" clearable auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="任务组别" prop="jobGroupName">
          <el-input v-model="temp.jobGroupName" clearable auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="表达式" prop="cronExpression">
          <el-input v-model="temp.cronExpression" clearable auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="temp.jobDescription" auto-complete="off"  rows="5" cols="5"></el-input>
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
          jobName: ''
        },
        temp: {
          id: null,
          jobName: null,
          jobDescription: null,
          jobGroupName: null,
          jobClassName: null,
          cronExpression: null
        },
        rules: { // 验证数据是否为必填项，如果是空，给出错误提示
          jobName: [{required: true, message: '任务名不能为空', trigger: 'blur'}],
          jobGroupName: [{required: true, message: '任务组别不能为空', trigger: 'blur'}],
          jobClassName: [{required: true, message: '执行类不能为空', trigger: 'blur'}],
          cronExpression: [{required: true, message: '表达式不能为空', trigger: 'blur'}],
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新增'
        },
      }
    },
    // mounted:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
    mounted() {
    },
    // created:在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
    created() {
      this.getList()
    },
    methods: {
      // 刷新
      refresh() {
        this.getList()
        this.$message({
          message: '刷新成功',
          type: 'success'
        })
      },
      // 分页查询
      getList() {
        // 查询条件
        const reqData = {
          'page': this.listQuery.page,
          'size': this.listQuery.limit,
          'jobName': this.listQuery.jobName
        }
        this.$api.scheduledTasks.findPage(reqData).then((response) => {
          this.list = response.data.list
          this.total = response.data.totalElements
          this.listLoading = false
        })
      },
      // 条件查找
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      // 删除一条
      handleDel(row) {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let reqData = []
          reqData.push({'id':row.id})
          this.$api.scheduledTasks.del(reqData).then((res) => {
            if (res.code == '0') {
              this.success()
            } else {
              this.error()
            }
            this.getList()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      // 重置表单
      resetTemp() {
        this.temp = {
          id: null,
          jobName: null,
          jobDescription: null,
          jobGroupName: null,
          jobClassName: null,
          cronExpression: null
        }
      },
      // 创建页面显示
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
            this.$api.scheduledTasks.save(this.temp).then((res) => {
              if (res.code == '0') {
                this.success()
              } else {
                this.error()
              }
              this.dialogFormVisible = false
              this.resetTemp()
              this.getList()
            })
          }
        })
      },
      // 显示编辑页面
      handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      // 编辑保存
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            this.$api.scheduledTasks.update(tempData).then((res) => {
              if (res.code == '0') {
                this.success()
              } else {
                this.error()
              }
              this.dialogFormVisible = false
              this.resetTemp()
              this.getList()
            })
          }
        })
      },
      // 执行
      handleResume(row){
        this.temp = Object.assign({}, row) // copy obj
        const reqData = {
          'id':this.temp.id
        }
        this.$api.scheduledTasks.resume(reqData).then((res) => {
          if (res.code == '0') {
            this.success()
          } else {
            this.error()
          }
          this.resetTemp()
          this.getList()
        })

      },
      // 暂停
      handlePause(row){
        this.temp = Object.assign({}, row) // copy obj
        const reqData = {
          'id':this.temp.id
        }
        this.$api.scheduledTasks.pause(reqData).then((res) => {
          if (res.code == '0') {
            this.success()
          } else {
            this.error()
          }
          this.resetTemp()
          this.getList()
        })
      },
      // 操作成功
      success() {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          duration: 2000
        })
      },
      // 操作失败
      error() {
        this.$notify({
          title: '失败',
          message: '操作失败',
          type: 'error',
          duration: 2000
        })
      }
    }
  }
</script>

<style scoped>

</style>

