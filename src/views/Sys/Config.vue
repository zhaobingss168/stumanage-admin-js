<template>
  <!--赵冰 2019.12 系统管理，系统参数配置-->
  <div class="app-container" style="width:99%;margin-top:-35px;">
    <!--工具栏-->
    <div class="filter-container" style="float:left;margin-bottom: 10px;">
      <el-input :size="size" v-model="listQuery.configName" placeholder="配置名称" clearable style="width: 200px;" class="filter-item"
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
      <el-table-column label="配置名称" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.configName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配置Key" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.configCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="配置值" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.configValue }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1"><el-button :size="size" type="success">正常</el-button></span>
          <span v-if="scope.row.status == 0"><el-button :size="size" type="info">失效</el-button></span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180" align="center" sortable="true">
        <template slot-scope="scope">
          <span v-if="scope.row.createTime != null"> <i class="el-icon-time"></i>{{ (scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
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
        <el-form-item label="配置名称" prop="configName">
          <el-input v-model="temp.configName" clearable auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="配置key" prop="configCode">
          <el-input v-model="temp.configCode" clearable auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="配置值" prop="configValue">
          <el-input v-model="temp.configValue" clearable auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" placeholder="状态" clearable class="filter-item" style="width: 440px">
            <el-option v-for="item in userStatusS" :key="item.key" :label="item.value" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="temp.remark" auto-complete="off"  rows="5" cols="5"></el-input>
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
          configName: ''
        },
        temp: {
          id: null,
          configName: null,
          configCode: null,
          configValue: null,
          remark: null,
          status: null
        },
        userStatusS: [ // 状态
          {key: 0, value: '锁定'},
          {key: 1, value: '正常'}
        ],
        rules: { // 验证数据是否为必填项，如果是空，给出错误提示
          configName: [{required: true, message: '配置名不能为空', trigger: 'blur'}],
          configCode: [{required: true, message: '配置KEY不能为空', trigger: 'blur'}],
          configValue: [{required: true, message: '配置值不能为空', trigger: 'blur'}],
          status: [{required: true, message: '配置状态不能为空', trigger: 'blur'}],
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
        this.success()
      },
      // 分页查询
      getList() {
        // 查询条件
        const reqData = {
          'page': this.listQuery.page,
          'size': this.listQuery.limit,
          'configName': this.listQuery.configName
        }
        this.$api.sysConfig.findPage(reqData).then((response) => {
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
          this.$api.sysConfig.del(reqData).then((res) => {
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
          name: null,
          sysconfigKey: null,
          value: null,
          remark: null,
          status: null,
          createTime: null
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
            this.$api.sysConfig.save(this.temp).then((res) => {
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
            this.$api.sysConfig.update(tempData).then((res) => {
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

