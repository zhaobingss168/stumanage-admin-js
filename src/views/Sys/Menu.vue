<template>
  <!--赵冰 2020.1 系统管理，菜单管理-->
  <div class="page-container" style="width:99%;margin-top:-35px;">
	<!--工具栏-->
	<div class="toolbar" style="float:left;">
		<el-form :inline="true" :model="filters" :size="size">
      <!--新增按钮-->
			<el-form-item>
				<kt-button icon="fa fa-plus" :label="$t('action.add')" type="primary" @click="handleAdd"/>
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
	<!--表格树内容栏-->
    <el-table :data="tableTreeDdata" stripe size="mini" style="width: 100%;"
      rowKey="id" v-loading="loading" element-loading-text="$t('action.loading')">
      <el-table-column align="center" width="80"></el-table-column>

      <!--名称-->
      <table-tree-column
        prop="name" header-align="center" align="center" treeKey="id" width="150" label="名称">
      </table-tree-column>

      <!--图标-->
      <el-table-column header-align="center" align="center" label="图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon || ''"></i>
        </template>
      </el-table-column>

      <!--类型-->
      <el-table-column prop="type" header-align="center" align="center" label="类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
        </template>
      </el-table-column>

      <!--上级菜单-->
      <el-table-column
        prop="parentName" header-align="center" align="center" width="120" label="上级菜单">
      </el-table-column>

      <!--菜单URL-->
      <el-table-column
        prop="url" header-align="center" align="center" width="150"
        :show-overflow-tooltip="true" label="菜单URL">
      </el-table-column>

      <!--排序-->
      <el-table-column
        prop="orderNum" header-align="center" align="center" label="排序">
      </el-table-column>

      <!--操作栏-->
      <el-table-column
        fixed="right" header-align="center" align="center" width="185" :label="$t('action.operation')">
        <template slot-scope="scope">
          <!--编辑按钮-->
          <kt-button icon="fa fa-edit" :label="$t('action.edit')"  @click="handleEdit(scope.row)"/>
          <!--删除按钮-->
          <kt-button icon="fa fa-trash" :label="$t('action.delete')"  type="danger" @click="handleDelete(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>

    <!-- 新增修改界面 -->
    <el-dialog :title="textMap[dialogStatus]" width="40%" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="submitForm()"
        label-width="80px" :size="size" style="text-align:left;">
        <el-form-item label="菜单类型" prop="type">
          <el-radio-group v-model="dataForm.type">
            <el-radio v-for="(type, index) in menuTypeList" :label="index" :key="index">{{ type }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="menuTypeList[dataForm.type] + '名称'" prop="name">
          <el-input v-model="dataForm.name" :placeholder="menuTypeList[dataForm.type] + '名称'"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parentName">
            <popup-tree-input
              :data="popupTreeData" :props="popupTreeProps" :prop="dataForm.parentName==null||dataForm.parentName==''?'顶级菜单':dataForm.parentName"
              :nodeKey="''+dataForm.parentId" :currentChangeHandle="handleTreeSelectChange">
            </popup-tree-input>
        </el-form-item>
        <el-form-item v-if="dataForm.type === 1" label="菜单路由" prop="url">
          <el-row>
            <el-col :span="22">
                <el-input v-model="dataForm.url" placeholder="菜单路由"></el-input>
            </el-col>
            <el-col :span="2" class="icon-list__tips">
                <el-tooltip placement="top" effect="light" style="padding: 10px;">
                  <div slot="content">
                    <p>URL格式：</p>
                    <p>1.常规业务开发的功能URL，如用户管理，Views目录下页面路径为 /Sys/User, 此处填写 /sys/user。</p>
                    <p>2.嵌套外部网页，如通过菜单打开百度网页，此处填写 http://www.baidu.com，http:// 不可省略。</p>
                    <p>示例：用户管理：/sys/user 嵌套百度：http://www.baidu.com 嵌套网页：http://127.0.0.1:8000</p></div>
                  <i class="el-icon-warning"></i>
                </el-tooltip>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item v-if="dataForm.type !== 2" label="排序编号" prop="orderNum">
          <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0" label="排序编号"></el-input-number>
        </el-form-item>
        <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
          <el-row>
            <el-col :span="22">
              <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="false" placeholder="菜单图标名称（如：fa fa-home fa-fw）" class="icon-list__input"></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :size="size"  @click="dialogVisible = false">{{$t('action.cancel')}}</el-button>
         <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{$t('action.comfirm')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import KtButton from "@/views/Core/KtButton";
import TableTreeColumn from "@/views/Core/TableTreeColumn";
import PopupTreeInput from "@/components/PopupTreeInput";
import FaIconTooltip from "@/components/FaIconTooltip";
import QS from 'qs' // 请求参数序列化
export default {
  components: {
    PopupTreeInput,
    KtButton,
    TableTreeColumn,
    FaIconTooltip
  },
  data() {
    return {
      dialogStatus: '',// 存放是新增还是编辑的，create新增，update编辑
      textMap: {// 用来显示是新增还是编辑
        update: '编辑',
        create: '新增'
      },
      size: "small",// // 样式 medium / small / mini
      loading: false,
      filters: {
        name: ""
      },
      tableTreeDdata: [],
      dialogVisible: false,
      menuTypeList: ["目录", "菜单", "按钮"],
      dataForm: {
        id: 0,
        type: 1,
        name: "",
        parentId: 0,
        parentName: "",
        url: "",
        perms: "",
        orderNum: 0,
        icon: "",
        iconList: []
      },
      dataRule: {
        name: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }]
      },
      popupTreeData: [],
      popupTreeProps: {
        label: "name",
        children: "children"
      }
    };
  },
  mounted() {
    this.findTreeData();
  },
  methods: {
    // 刷新
    refresh() {
      this.findTreeData()
      this.success()
    },
    // 获取表格树数据
    findTreeData: function() {
      this.loading = true;
      this.$api.menu.findMenuTree().then(res => {
        this.tableTreeDdata = res.data;
        this.popupTreeData = this.getParentMenuTree(res.data);
        this.loading = false;
      });
    },
    // 获取上级菜单树
    getParentMenuTree: function(tableTreeDdata) {
      let parent = {
        parentId: 0,
        name: "顶级菜单",
        children: tableTreeDdata
      };
      return [parent];
    },
    // 重置模板
    resetTemp() {
      this.temp = {
        id: undefined,
        userName: '',
        nickName: '',
        status: ''
      }
    },
    // 显示新增界面
    handleAdd: function() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogVisible = true;
      this.dataForm = {
        id: 0,
        type: 1,
        typeList: ["目录", "菜单", "按钮"],
        name: "",
        parentId: 0,
        parentName: "",
        url: "",
        perms: "",
        orderNum: 0,
        icon: "",
        iconList: []
      };
    },

    // 保存新增数据
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$api.menu.save(this.dataForm).then((res) => {
            if (res.code == '0') {
              this.success()
            } else {
              this.error()
            }
            this.findTreeData()
            this.dialogVisible = false;
            this.$refs["dataForm"].resetFields();
          })
        }
      })
    },

    // 显示编辑界面
    handleEdit: function(row) {
      this.dialogStatus = 'update'
      this.dialogVisible = true;
      Object.assign(this.dataForm, row);
    },

    // 编辑提交
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.dataForm)
          this.$api.menu.save(tempData).then((res) => {
            if (res.code == '0') {
              this.success()
            } else {
              this.error()
            }
            this.findTreeData()
            this.dialogVisible = false;
            this.$refs["dataForm"].resetFields();
          })
        }
      })
    },

    //删除一条
    handleDelete(row) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let reqData = []
        reqData.push({'id':row.id})
        this.$api.menu.del(reqData).then((res) => {
          if (res.code == '0') {
            this.success()
          } else {
            this.error()
          }
          this.findTreeData()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 获取删除的包含子菜单的id列表
    getDeleteIds(ids, row) {
      ids.push({ id: row.id });
      if (row.children != null) {
        for (let i = 0, len = row.children.length; i < len; i++) {
          this.getDeleteIds(ids, row.children[i]);
        }
      }
      return ids;
    },
    // 菜单树选中
    handleTreeSelectChange(data, node) {
      this.dataForm.parentId = data.id;
      this.dataForm.parentName = data.name;
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName;
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
};
</script>

<style scoped>
</style>
