<!--
* @description 
* @fileName RoleManage.vue
* @author Miaoxy
* @date 2022/07/13 14:43:48
!-->
<template>
  <!-- 角色管理 -->
  <div class="role_manage">
    <!-- 搜索区域 -->
    <div class="handle_field">
      <div class="search" style="padding-left:0;">
        <span>角色名称</span>
        <el-input clearable v-model="searchText.roleName" placeholder="请输入"></el-input>
      </div>
      <div class="search">
        <span>角色编码</span>
        <el-input clearable v-model="searchText.roleCode" placeholder="请输入"></el-input>
      </div>
      <div class="search">
        <span>角色状态</span>
        <el-select clearable v-model="searchText.status" placeholder="请选择">
          <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="search">
        <span>应用名称</span>
        <el-select clearable v-model="searchText.applicationId" placeholder="请选择">
          <el-option v-for="item in applicationOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="search" style="padding-left: 0;margin-right:75%;">
        <span>创建时间</span>
        <el-date-picker
          v-model="searchText.curDate"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
    </div>

    <!-- 搜索与重置按钮 -->
    <div class="add_btn">
      <div class="search_btn">
        <el-button @click="clearSearchText"><span>重置</span></el-button>
        <el-button @click="getRoleInfo" type="primary"><span>查询</span></el-button>
      </div>
      <!-- 新增按钮 -->
      <el-button @click="showAdd" type="primary"><span>新增</span></el-button>
    </div>

    <!-- 表格区域 -->
    <div class="table_field">
      <el-table :data="tableData" style="width: 100%;" height="calc(100vh - 460px)" :header-cell-style="{ background: '#F0F0F0', color: '#333333' }">
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column fixed type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="120">
          <template slot-scope="scope">
            <span>
              {{ scope.row.roleName ? (scope.row.roleName.length > 10 ? scope.row.roleName.slice(0, 10) + '...' : scope.row.roleName) : '' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="roleCode" label="角色编码" width="180">
          <template slot-scope="scope">
            <span>
              {{ scope.row.roleCode ? (scope.row.roleCode.length > 10 ? scope.row.roleCode.slice(0, 10) + '...' : scope.row.roleCode) : '' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="角色状态" width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status == 0 ? 'danger' : 'success'">{{ scope.row.status == 0 ? '禁用' : '启用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="applicationId" label="应用名称" width="120">
          <template slot-scope="scope">
            <span>
              {{
                scope.row.applicationId
                  ? scope.row.applicationId.length > 10
                    ? scope.row.applicationId.slice(0, 10) + '...'
                    : scope.row.applicationId
                  : ''
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column fixed="right" label="操作" width="320" align="center">
          <template slot-scope="scope">
            <el-button style="color:#7B80E3;" @click.native.prevent="showUpdate(scope.row)" type="text">
              编辑
            </el-button>
            <span style="color:#E5E5E5;margin:0 16px;">|</span>
            <el-button style="color:#7B80E3;" @click.native.prevent="showMenu(scope.row)" type="text">
              菜单权限
            </el-button>
            <span style="color:#E5E5E5;margin:0 16px;">|</span>
            <el-button @click.native.prevent="showDelete(scope.row)" type="text" style="color:red;">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="paging">
      <el-pagination
        class="msg-pagination-container"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
        background
      ></el-pagination>
    </div>

    <!-- 新增或编辑 -->
    <el-dialog
      class="padding"
      :title="addOrUpdateTitle"
      :visible.sync="addOrUpdateDialog"
      width="60%"
      @close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="dialog_body">
        <el-form ref="addOrUpdateDialog" class="form" :rules="rules" :model="addOrUpdateData">
          <el-form-item prop="applicationId" label="应用名称" class="form_item form_item_title">
            <el-select clearable v-model="addOrUpdateData.applicationId" placeholder="请选择" style="width:100%;">
              <el-option v-for="item in applicationOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="roleName" label="角色名称" class="form_item">
            <el-input clearable v-model="addOrUpdateData.roleName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item prop="roleCode" label="角色编码" class="form_item">
            <el-input clearable v-model="addOrUpdateData.roleCode" placeholder="请输入"></el-input>
          </el-form-item>

          <el-form-item prop="status" label="状态" class="form_item">
            <el-radio-group v-model="addOrUpdateData.status" class="radio_group" style="width:100%;">
              <el-radio :label="0"><span>禁用</span></el-radio>
              <el-radio :label="1"><span>启用</span></el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item prop="roleRemark" label="角色描述" class="form_item form_item_title">
            <el-input type="textarea" clearable placeholder="请输入备注" v-model="addOrUpdateData.roleRemark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrUpdateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog title="确认删除" :visible.sync="deleteDialog" width="50%" :close-on-click-modal="false" @close="cancelDelete">
      <div class="delete_dialog">
        <span class="title" style="font-size: 16px;">是否确认删除数据?</span>
        <span slot="footer" class="dialog_footer">
          <el-button @click="deleteDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmDelete">确 定</el-button>
        </span>
      </div>
    </el-dialog>

    <el-dialog :title="menuTitle" :visible.sync="menuDialog" width="60%" :close-on-click-modal="false" @close="handleCloseMenu">
      <div class="dialog_body">
        <el-tree :data="menuOptions" :props="props" show-checkbox @check-change="handleCheckChange"></el-tree>
      </div>
      <span slot="footer" class="dialog_footer">
        <el-button @click="menuDialog = false">取 消</el-button>
        <el-button type="primary" @click="updateMenu">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'RoleManage',
  data() {
    return {
      tableData: [],

      //角色状态
      roleOptions: [
        {
          value: '0',
          label: '禁用',
        },
        {
          value: '1',
          label: '启用',
        },
      ],

      //应用类型选项
      applicationOptions: [
        {
          value: 'SPS',
          label: 'SPS',
        },
        {
          value: 'ECM',
          label: 'ECM',
        },
        {
          value: 'FGAP',
          label: 'FGAP',
        },
        {
          value: 'PPM',
          label: 'PPM',
        },
        {
          value: 'DPM',
          label: 'DPM',
        },
      ],

      //菜单数据
      menuOptions: [],
      props: {
        label: 'menuName',
      },

      //检验规则
      rules: {
        applicationId: [{ required: true, message: '请选择部门', trigger: 'change' }],
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'change' }],
        roleCode: [{ required: true, message: '请输入角色编码', trigger: 'change' }],
      },

      //分页
      currentPage: 1,
      pageSize: 10,
      totalPage: 40,

      //弹窗数据
      addOrUpdateData: {
        applicationId: '',
        roleName: '',
        roleCode: '',
        status: 0,
        roleRemark: '',
      },
      addOrUpdateTitle: '新增',
      addOrUpdateDialog: false,
      isAdding: true,

      //删除弹窗
      deleteDialog: false,
      curRole: {},

      //菜单弹窗
      menuTitle: '菜单权限',
      menuDialog: false,

      //搜索
      searchText: {
        roleName: '',
        roleCode: '',
        status: '',
        applicationId: '',
        curDate: [],
      },
    };
  },

  components: {},

  watch: {
    searchText: {
      handler() {
        this.$isEmpty(this.searchText) && this.getRoleInfo();
      },
      deep: true,
    },
  },

  mounted() {
    this.getRoleInfo();
    this.getMenuList();
  },

  methods: {
    //获取列表
    getRoleInfo() {
      let data = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
      };
      Object.assign(data, this.searchText);
      if (data.curDate) {
        data.beginTime = data.curDate[0];
        data.endTime = data.curDate[1];
        delete data.curDate;
      } else {
        data.curDate = [];
      }

      this.$API
        .getRole(data)
        .then(res => {
          this.tableData = res.data.data || [];
          this.totalPage = res.data.total;
        })
        .catch(err => {
          this.$msg(err.data);
        });
    },

    //获取菜单列表
    getMenuList() {
      let data = {
        status: 1,
      };
      this.$API
        .getMenuList(data)
        .then(res => {
          this.menuOptions = res.data.data;
        })
        .catch(err => {});
    },

    //新增接口
    addRole(data) {
      this.$API
        .addRole(data)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.addOrUpdateDialog = false;
          this.getRoleInfo();
        });
    },

    //编辑接口
    updateRole(data) {
      this.$API
        .updateRole(data)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.addOrUpdateDialog = false;
          this.getRoleInfo();
        });
    },

    //删除接口
    deleteRole(data) {
      this.$API
        .deleteRole(data.id)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.deleteDialog = false;
          this.getRoleInfo();
        });
    },

    //新增或编辑角色
    addOrUpdateRole() {
      this.$refs.addOrUpdateDialog.validate(valid => {
        return valid ? (this.isAdding ? this.addRole(this.addOrUpdateData) : this.updateRole(this.addOrUpdateData)) : false;
      });
    },

    //新增和编辑退出时的回调
    handleClose() {
      this.addOrUpdateDialog = false;
      this.addOrUpdateTitle = '新增';
      this.addOrUpdateData = {
        applicationId: '',
        roleName: '',
        roleCode: '',
        status: 0,
        roleRemark: '',
      };
      this.$refs.addOrUpdateDialog.resetFields();
      this.isAdding = true;
    },

    //清空搜索条件
    clearSearchText() {
      this.searchText = {};
    },

    //显示新增框
    showAdd() {
      this.addOrUpdateDialog = true;
      this.addOrUpdateTitle = '新增';
      this.isAdding = true;
    },

    //显示编辑框
    showUpdate(row) {
      this.addOrUpdateDialog = true;
      this.addOrUpdateTitle = '编辑';
      this.addOrUpdateData = row;
      this.isAdding = false;
    },

    //显示删除框
    showDelete(row) {
      this.deleteDialog = true;
      this.curRole = row;
    },

    //取消删除
    cancelDelete() {
      this.deleteDialog = false;
      this.curRole = {};
      this.getRoleInfo();
    },

    //确认删除
    confirmDelete() {
      this.deleteRole(this.curRole);
    },

    //确认修改菜单权限
    updateMenu() {},

    //显示菜单权限框
    showMenu(row) {
      this.menuDialog = true;
    },

    //选择菜单选项
    handleCheckChange (data, checked, indeterminate) {
      console.log(data, checked, indeterminate);
    },

    //菜单弹出框的关闭回调
    handleCloseMenu() {
      this.menuDialog = false;
    },

    //设置每页多少条数据
    handleSizeChange(val) {
      this.pageSize = val;
      this.getRoleInfo();
    },

    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getRoleInfo();
    },
  },
};
</script>

<style lang="less" scoped>
.role_manage {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .handle_field {
    width: 100%;
    height: 140px;
    margin: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .search {
      width: 25%;
      padding-left: 10px;
      padding-right: 10px;
      padding-bottom: 10px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: start;
      flex-direction: column;
      /deep/ .el-select {
        width: 100%;
      }
      /deep/ .el-date-editor {
        width: 100%;
      }
      span {
        margin-bottom: 8px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 20px;
      }
    }
  }
  .add_btn {
    width: 100%;
    margin-bottom: 25px;
    display: flex;
    justify-content: start;
    align-items: center;
    .search_btn {
      box-sizing: border-box;
      height: 100%;
      padding-right: 10px;
    }
  }
  .table_field {
    width: 100%;
  }
  .paging {
    display: flex;
    justify-content: end;
    align-items: center;
    margin-top: 30px;
    width: 100%;
  }

  .dialog_body {
    width: 100%;
    overflow-y: auto;
    .form {
      display: flex;
      justify-content: start;
      align-items: center;
      flex-wrap: wrap;
      margin-bottom: 10px;
      .form_item {
        width: 48%;
        margin: 1%;
        display: inline-block;
      }
      .form_item_title {
        width: 98%;
        margin: 1%;
      }
      /deep/ .vue-treeselect__control {
        height: 42px;
        box-sizing: border-box;
        .vue-treeselect__multi-value {
          height: 42px;
          margin: 0;
          .vue-treeselect__multi-value-item-container {
            position: relative;
            height: 42px;
            margin: 0 4px;
            padding: 0;
            .vue-treeselect__multi-value-item {
              position: relative;
              height: 42px;
              padding: 0;
            }
          }
        }
      }
    }
  }
}
</style>
