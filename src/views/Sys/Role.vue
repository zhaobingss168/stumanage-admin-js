<template>
  <!--赵冰 2020 1 系统管理，角色管理-->
  <div class="page-container" style="width:99%;margin-top:-35px;">
	<!--工具栏-->
	<div class="toolbar" style="float:left;">
		<el-form :inline="true" :size="size">
      <!--查询条件-->
			<el-form-item>
        <el-input :size="size" v-model="pageRequest.roleName" placeholder="角色名称" clearable style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
			</el-form-item>

      <!--查找-->
			<el-form-item>
				<kt-button icon="fa fa-search" :label="$t('action.search')" perms="sys:role:view" type="primary" @click="findPage(null)"/>
			</el-form-item>

      <!--新增-->
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" perms="sys:role:add" type="primary" @click="handleAdd" />
			</el-form-item>
		</el-form>
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

	<!--表格内容栏-->
	<kt-table :height="300" permsEdit="sys:role:edit" permsDelete="sys:role:delete" :highlightCurrentRow="true" :stripe="false"
		:data="pageResult" :columns="columns" :showBatchDelete="false" @handleCurrentChange="handleRoleSelectChange"
		@findPage="findPage" @handleEdit="handleEdit" @handleDelete="handleDelete" :border="true">
	</kt-table>

    <!--分页-->
    <pagination
      v-show="pageResult.totalElements > 0"
      :total="pageResult.totalElements"
      :page.sync="pageRequest.page"
      :limit.sync="pageRequest.size"
      style="float:right;margin-top: -40px"
      @pagination="findPage"
    />
  <br>


	<!--新增编辑界面-->
	<el-dialog :title="operation?'新增':'编辑'" width="40%" top="10%" :visible.sync="dialogVisible" :close-on-click-modal="false">
		<el-form :model="dataForm" label-width="80px" :rules="dataFormRules" ref="dataForm" :size="size">
			<el-form-item label="ID" prop="id" v-if="false">
				<el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item label="角色名" prop="name">
				<el-input v-model="dataForm.name" clearable auto-complete="off"></el-input>
			</el-form-item>
      <el-form-item label="备注">
        <el-input v-model="dataForm.remark" clearable auto-complete="off"></el-input>
      </el-form-item>
		</el-form>
		<div slot="footer" class="dialog-footer">
      <!--取消-->
			<el-button :size="size" @click.native="dialogVisible = false">{{$t('action.cancel')}}</el-button>
      <!--提交-->
			<el-button :size="size" type="primary" @click.native="submitForm" :loading="editLoading">{{$t('action.submit')}}</el-button>
		</div>
	</el-dialog>

	<!--角色菜单，表格树内容栏-->
	<div class="menu-container" :v-if="true">
		<div class="menu-header">
			<span><B>角色菜单授权</B></span>
		</div>
		<el-tree :data="menuData" size="mini" show-checkbox node-key="id" :props="defaultProps"
             :default-expanded-keys="defaultCheckedList"
             :default-checked-keys="defaultCheckedList"
			style="width: 100%;pading-top:20px;" ref="menuTree" :render-content="renderContent"
			v-loading="menuLoading" element-loading-text="加载中..." :check-strictly="true"
			@check-change="handleMenuCheckChange">
		</el-tree>
    <!--全选-->
		<div style="float:left;padding-left:24px;padding-top:12px;padding-bottom:4px;">
			<el-checkbox v-model="checkAll" @change="handleCheckAll" :disabled="this.selectRole.id == null"><b>全选</b></el-checkbox>
		</div>
		<div style="float:right;padding-right:15px;padding-top:4px;padding-bottom:4px;">
      <!--重置-->
      <el-button :label="$t('action.reset')" type="primary" :size="size" :disabled="this.selectRole.id == null" @click="resetSelection">重置</el-button>
      <!--提交-->
      <el-button :label="$t('action.submit')" type="primary" :size="size" @click="submitAuthForm" :disabled="this.selectRole.id == null" :loading="authLoading">提交</el-button>
		</div>
	</div>
  </div>
</template>

<script>
import KtTable from "@/views/Core/KtTable"
import KtButton from "@/views/Core/KtButton"
import TableTreeColumn from '@/views/Core/TableTreeColumn'
import { format } from "@/utils/datetime"
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
export default {
	components:{
		KtTable,
		KtButton,
    Pagination,
		TableTreeColumn
	},
  directives: { waves },
	data() {
		return {
			size: 'small',// 样式 medium / small / mini
			columns: [
				{prop:"name", label:"角色名", minWidth:120,sortable:false},
				{prop:"remark", label:"备注", minWidth:120,sortable:false},
				{prop:"createTime", label:"创建时间", minWidth:120, formatter:this.dateFormat}
			],
      statusS: [ // 状态
        {key: 0, value: '锁定'},
        {key: 1, value: '正常'}
      ],
			pageRequest: { page: 1, size: 10 ,roleName:''},// 请求条件
			pageResult: {
			  'totalElements' : 0 // 设置个默认值
      },// 分页查询结果数据
			operation: false, // true:新增, false:编辑
			dialogVisible: false, // 新增编辑界面是否显示
			editLoading: false,// 编辑loading
			dataFormRules: { // 填写规则
        name: [{ required: true, message: '角色名不能为空', trigger: 'blur' }],
			},
			// 新增编辑界面数据
			dataForm: {
				id: 0,
        name: '',// 角色名
        remark: ''// 备注
			},
			selectRole: {},// 当前表格中选中的角色信息 id、name
			menuData: [],// 树结构菜单数据
			//menuSelections: [],
			menuLoading: false,// 菜单加载loading
			authLoading: false,// 菜单提交loading
			checkAll: false,// 全选
			currentRoleMenus: [],// 当前角色数结构
      defaultCheckedList: [],// 树结构默认选中展开
			defaultProps: {// 渲染嵌套数据的配置选项
				children: 'children',
				label: 'name'
			}
		}
	},
  mounted() {
  },
	methods: {
    // 刷新
    refresh() {
      this.findPage()
      this.success()
    },
		// 获取分页数据
    findPage: function (data) {
      /*查询条件*/
      const reqData = {
        'page': this.pageRequest.page,
        'size': this.pageRequest.size,
        'roleName': this.pageRequest.roleName
      }
      this.$api.role.findPage(reqData).then((res) => {
        this.pageResult = res.data// 将结果放到分页中
        this.findTreeData()
      }).then(data != null ? data.callback : '')
    },
		// 显示新增界面
    handleAdd: function () {
      this.dialogVisible = true
      this.operation = true
      this.dataForm = {
        id: 0,
        name: '',
        remark: ''
      }
    },
    // 显示编辑界面
    handleEdit: function (params) {
      this.dialogVisible = true
      this.operation = false
      this.dataForm = Object.assign({}, params.row)
    },
    // 编辑
    submitForm: function () {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.editLoading = true
            let params = Object.assign({}, this.dataForm)
            if (this.operation) { // 如果是新增，则调用新增接口
              this.$api.role.save(params).then((res) => {
                if (res.code == '0') {
                  this.success()
                } else {
                  this.error()
                }
                this.editLoading = false
                this.dialogVisible = false
                this.$refs['dataForm'].resetFields()
                this.findPage(null)
              })
            } else { // 如果是修改，则调用修改接口
              this.$api.role.update(params).then((res) => {
                if (res.code == '0') {
                  this.success()
                } else {
                  this.error()
                }
                this.editLoading = false
                this.dialogVisible = false
                this.$refs['dataForm'].resetFields()
                this.findPage(null)
              })
            }
          })
        }
      })
    },
    // 根据id删除一个
    handleDelete: function (data) {
      this.$confirm('确认删除选中记录吗？', '提示', {}).then(() => {
        this.loading = true
        let reqData = []
        reqData.push({'id':data.row.id})
        this.$api.role.del(reqData).then((res) => {
          if (res.code == '0') {
            this.success()
          } else {
            this.error()
          }
          this.loading = false
          this.findPage(null)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
		// 获取角色菜单权限树结构数据
    findTreeData: function () {
      this.menuLoading = true
      this.$api.menu.findMenuTree().then((res) => {
        this.menuData = res.data
        this.menuLoading = false
      })
    },
		// 表格行选中角色选择改变监听,根据角色id获取相对应的菜单
		handleRoleSelectChange(val) {
			if(val == null || val.val == null) {
				return
			}
			this.selectRole = val.val
      this.$api.role.findRoleMenus({'roleId':val.val.id}).then((res) => {
        this.currentRoleMenus = res.data
        this.$refs.menuTree.setCheckedNodes(res.data)
      })
		},
		// 树节点选择监听
    handleMenuCheckChange(data, check, subCheck) {
      if (check) {
        // 节点选中时同步选中父节点
        let parentId = data.parentId
        this.$refs.menuTree.setChecked(parentId, true, false)
      } else {
        // 节点取消选中时同步取消选中子节点
        if (data.children != null) {
          data.children.forEach(element => {
            this.$refs.menuTree.setChecked(element.id, false, false)
          });
        }
      }
    },
		// 重置选择
    resetSelection() {
      this.checkAll = false
      this.$refs.menuTree.setCheckedNodes(this.currentRoleMenus)
    },
		// 全选操作
    handleCheckAll() {
      if (this.checkAll) {
        let allMenus = []
        this.checkAllMenu(this.menuData, allMenus)
        this.$refs.menuTree.setCheckedNodes(allMenus)
      } else {
        this.$refs.menuTree.setCheckedNodes([])
      }
    },
		// 递归全选
    checkAllMenu(menuData, allMenus) {
      menuData.forEach(menu => {
        allMenus.push(menu)
        if (menu.children) {
          this.checkAllMenu(menu.children, allMenus)
        }
      });
    },
		// 角色菜单授权提交
    submitAuthForm() {
      let roleId = this.selectRole.id
      if('admin' == this.selectRole.name) {
        this.$message({message: '超级管理员拥有所有菜单权限，不允许修改！', type: 'error'})
        return
      }
      this.authLoading = true
      let checkedNodes = this.$refs.menuTree.getCheckedNodes(false, true)
      let roleMenus = []
      for(let i=0, len=checkedNodes.length; i<len; i++) {
        let roleMenu = { roleId:roleId, menuId:checkedNodes[i].id }
        roleMenus.push(roleMenu)
      }
      this.$api.role.saveRoleMenus(roleMenus).then((res) => {
        if (res.code == '0') {
          this.success()
        } else {
          this.error()
        }
        this.authLoading = false
      })
    },
		renderContent(h, { node, data, store }) {
			return (
			<div class="column-container">
				<span style="text-algin:center;margin-right:80px;">{data.name}</span>
				<span style="text-algin:center;margin-right:80px;">
					<el-tag type={data.type === 0?'':data.type === 1?'success':'info'} size="small">
						{data.type === 0 ?'目录' : data.type === 1?'菜单':'按钮'}
					</el-tag>
				</span>
				<span style="text-algin:center;margin-right:80px;"> <i class={ data.icon }></i></span>
				<span style="text-algin:center;margin-right:80px;">{data.parentName?data.parentName:'顶级菜单'}</span>
				<span style="text-algin:center;margin-right:80px;">{data.url?data.url:'\t'}</span>
			</div>
      )
    },

		// 时间格式化
    dateFormat: function (row, column, cellValue, index) {
      return format(row[column.property])
    },
    // 角色状态
    statusFormatter: function (row, column, cellValue, index) {
      if (row[column.property] == 1) {
        return "正常"
      } else if (row[column.property] == 0) {
        return "锁定"
      }
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
	},
}
</script>
<style scoped>
.menu-container {
	margin-top: 10px;
}
.menu-header {
	padding-left: 8px;
	padding-bottom: 5px;
	text-align: left;
	font-size: 16px;
	color: rgb(20, 89, 121);
}
</style>
