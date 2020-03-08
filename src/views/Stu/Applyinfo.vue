<template>
  <!--赵冰 2019.12 学生管理，报名信息管理-->
  <div class="app-container" style="width:99%;margin-top:-35px;">
    <!--工具栏-->
    <div class="filter-container" style="float:left;margin-bottom: 10px;">
      <el-input :size="size" v-model="listQuery.stuName" clearable placeholder="学生姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select :size="size" v-model="listQuery.payStatus" clearable placeholder="支付状态" clearable class="filter-item" style="width: 200px">
        <el-option v-for="item in payStatusS" :key="item.key" :label="item.value" :value="item.key"/>
      </el-select>
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
      <el-button :size="size" v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
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
      <el-table-column label="学生姓名" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stuName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学生电话" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stuPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="在读学校" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.readingSchool }}</span>
        </template>
      </el-table-column>
      <el-table-column label="在读专业" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.readingMajor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报名学校" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.applySchool }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报名专业" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.applyMajor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.payStatus == 1"><el-button size="mini" type="success">已支付</el-button></span>
          <span v-if="scope.row.payStatus == 0"><el-button size="mini" type="info">未支付</el-button></span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{ scope.row.createTime }}</span>
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
        <el-form-item label="学生姓名" prop="stuName">
          <el-input v-model="temp.stuName" />
        </el-form-item>
        <el-form-item label="学生电话" prop="stuPhone">
          <el-input v-model="temp.stuPhone" />
        </el-form-item>
        <el-form-item label="在读学校" prop="readingSchool">
          <el-input v-model="temp.readingSchool" />
        </el-form-item>
        <el-form-item label="在读专业" prop="readingMajor">
          <el-input v-model="temp.readingMajor" />
        </el-form-item>
        <el-form-item label="报名学校" prop="applySchool">
          <el-input v-model="temp.applySchool" />
        </el-form-item>
        <el-form-item label="报名专业" prop="applyMajor">
          <el-input v-model="temp.applyMajor" />
        </el-form-item>
        <el-form-item label="支付状态" prop="payStatus">
          <el-select v-model="temp.payStatus" placeholder="支付状态" clearable class="filter-item" style="width: 445px">
            <el-option v-for="item in payStatusS" :key="item.key" :label="item.value" :value="item.key"/>
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
  // 付款状态
  const payStatusS = [
    { key: 0, value: '未支付' },
    { key: 1, value: '已支付' }
  ]
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
        payStatusS, // 付款状态
        listQuery: { // 查询条件
          page: 1,
          limit: 10,
          stuName: '',
          payStatus: ''
        },
        size: "small",// 样式 medium / small / mini
        getAllList: null, // 导出时根据查询条件查询出的所有数据
        importanceOptions: [1, 2, 3],
        showReviewer: false,
        temp: {
          id: undefined,
          stuName: '',
          stuPhone: '',
          readingSchool: '',
          readingMajor: '',
          applySchool: '',
          applyMajor: '',
          payStatus: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '创建'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          stuName: [{ required: true, message: '学生姓名不能为空', trigger: 'blur' }],
          stuPhone: [{ required: true, message: '学生电话不能为空', trigger: 'blur' }],
          readingSchool: [{ required: true, message: '在读学校不能为空', trigger: 'blur' }],
          readingMajor: [{ required: true, message: '在读专业不能为空', trigger: 'blur' }],
          applySchool: [{ required: true, message: '报名学校不能为空', trigger: 'blur' }],
          applyMajor: [{ required: true, message: '报名专业不能为空', trigger: 'blur' }],
          payStatus: [{ required: true, message: '支付状态不能为空', trigger: 'blur' }]
        },
        downloadLoading: false
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
          'stuName': this.listQuery.stuName,
          'payStatus': this.listQuery.payStatus
        }
        this.$api.applyInfo.findPage(reqData).then((response) => {
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
          this.$api.applyInfo.del(reqData).then((res) => {
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
          id: undefined,
          stuName: '',
          stuPhone: '',
          readingSchool: '',
          readingMajor: '',
          applySchool: '',
          applyMajor: '',
          payStatus: ''
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
            this.$api.applyInfo.save(this.temp).then((res) => {
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
            this.$api.applyInfo.update(tempData).then((res) => {
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
      // 导出
      handleDownload() {
        this.downloadLoading = true
        // 根据查询条件查询出所有要导出的数据
        const reqData = {
          'stuName': this.listQuery.stuName,
          'payStatus': this.listQuery.payStatus
        }
        this.$api.applyInfo.queryAll(reqData).then((res) => {
          if (res.code === '0') {
            import('@/vendor/Export2Excel').then(excel => {
              const tHeader = ['学生姓名', '学生电话', '在读学校', '在读专业', '报名学校', '报名专业', '支付状态', '创建时间']
              const filterVal = ['stuName', 'stuPhone', 'readingSchool', 'readingMajor', 'applySchool', 'applyMajor', 'payStatus', 'createTime']
              const data = this.formatJson(filterVal, res.data)
              excel.export_json_to_excel({
                header: tHeader,
                data,
                filename: '报名信息'
              })
              this.downloadLoading = false
            })
          }
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'payStatus') {
            if (v[j] === 0) {
              return '未支付'
            } else {
              return '已支付'
            }
          }
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
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

