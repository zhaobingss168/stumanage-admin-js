<template>
  <!--赵冰 2019.12 系统管理，系统日志-->
  <div class="app-container" style="width:99%;margin-top:-35px;">
    <!--工具栏-->
    <div class="filter-container" style="float:left;margin-bottom: 10px;">
      <el-input :size="size" v-model="listQuery.userName" placeholder="操作人" clearable style="width: 200px;" class="filter-item"
                @keyup.enter.native="handleFilter"/>
      <!--查找按钮-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter" :size="size">
        查找
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
      <el-table-column label="操作人" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求方法" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.method }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求参数" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.params }}</span>
        </template>
      </el-table-column>
      <el-table-column label="耗时" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求IP" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" width="180" align="center" sortable="true">
        <template slot-scope="scope">
          <span v-if="scope.row.createTime != null"> <i class="el-icon-time"></i>{{ (scope.row.createTime) }}</span>
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
          userName: ''
        },
        temp: {
          id: null,
          configName: null,
          configCode: null,
          configValue: null,
          remark: null,
          status: null
        },
        rules: {
        },
        dialogFormVisible: false,
        dialogStatus: '',
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
          'userName': this.listQuery.userName,
        }
        this.$api.sysLog.findPage(reqData).then((response) => {
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

