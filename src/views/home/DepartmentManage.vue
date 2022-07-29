<!--
* @description 
* @fileName DepartmentManage.vue
* @author Miaoxy
* @date 2022/07/13 14:44:14
!-->
<template>
  <!-- 部门管理 -->
  <div class="department_manage">
    <!-- 搜索区域 -->
    <div class="handle_field">
      <div class="search" style="padding-left:0;">
        <span>部门名称</span>
        <el-input clearable v-model="searchText.departmentName" placeholder="请输入"></el-input>
      </div>
      <div class="search">
        <span>部门状态</span>
        <el-select v-model="searchText.status" clearable placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="search">
        <span>部门编号</span>
        <el-input clearable v-model="searchText.departmentNumber" placeholder="请输入"></el-input>
      </div>
      <div class="search_btn">
        <el-button @click="clearSearchText"><span>重置</span></el-button>
        <el-button @click="getDepartmentInfo" type="primary"><span>查询</span></el-button>
      </div>
    </div>
    <!-- 新增按钮 -->
    <div class="add_btn">
      <el-button @click="showAdd" type="primary"><span>新增</span></el-button>
    </div>

    <!-- 表格区域 -->
    <div class="table_field">
      <el-table
        row-key="id"
        :data="tableData"
        style="width: 100%;"
        height="calc(100vh - 340px)"
        :header-cell-style="{ background: '#F0F0F0', color: '#333333' }"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column type="selection" min-width="50" align="center"></el-table-column>
        <el-table-column fixed type="index" label="序号" min-width="100"></el-table-column>
        <el-table-column prop="departmentName" label="部门名称" min-width="260">
          <template slot-scope="scope">
            <span>
              {{
                scope.row.departmentName
                  ? scope.row.departmentName.length > 10
                    ? scope.row.departmentName.slice(0, 10) + '...'
                    : scope.row.departmentName
                  : ''
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="departmentID" label="部门标识" min-width="160">
          <template slot-scope="scope">
            <span>
              {{
                scope.row.departmentID
                  ? scope.row.departmentID.length > 10
                    ? scope.row.departmentID.slice(0, 10) + '...'
                    : scope.row.departmentID
                  : ''
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="departmentNumber" label="部门编号" min-width="180">
          <template slot-scope="scope">
            <span>
              {{
                scope.row.departmentNumber
                  ? scope.row.departmentNumber.length > 10
                    ? scope.row.departmentNumber.slice(0, 10) + '...'
                    : scope.row.departmentNumber
                  : ''
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="160">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status == 0 ? 'danger' : 'success'">{{ scope.row.status == 0 ? '禁用' : '启用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="200" align="center">
          <template slot-scope="scope">
            <el-button style="color:#7B80E3;" @click.native.prevent="showEdit(scope.row)" type="text">
              编辑
            </el-button>
            <span style="color:#E5E5E5;margin:0 16px;">|</span>
            <el-button style="color:red;" @click.native.prevent="showDelete(scope.row)" type="text">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增和编辑弹窗 -->
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
          <el-form-item prop="departmentParentId" label="上级部门" class="select_form" style="padding-left: 0;width: 100%;">
            <treeselect v-model="addOrUpdateData.departmentParentId" :options="treeList" :normalizer="normalizer" placeholder="根部门">
              <div v-if="addOrUpdateData.departmentParentId != ''" slot="value-label" slot-scope="{ node }">{{ node.label }}</div>
              <span v-else>根部门</span>
            </treeselect>
          </el-form-item>
          <el-form-item prop="departmentName" label="部门名称" class="form_item" style="padding-left: 0;">
            <el-input clearable v-model="addOrUpdateData.departmentName"></el-input>
          </el-form-item>
          <el-form-item prop="departmentID" label="部门标识" class="form_item" style="padding-left: 0;">
            <el-input clearable v-model="addOrUpdateData.departmentID"></el-input>
          </el-form-item>
          <el-form-item prop="departmentNumber" label="部门编号" class="form_item" style="padding-left: 0;">
            <el-input clearable v-model="addOrUpdateData.departmentNumber"></el-input>
          </el-form-item>
          <el-form-item class="form_item radio_form" prop="status" label="部门状态" style="padding-left: 0;">
            <el-radio-group v-model="addOrUpdateData.status" class="radio_group">
              <el-radio :label="0"><span>禁用</span></el-radio>
              <el-radio :label="1"><span>启用</span></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrUpdateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateDepartment">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="确认删除" :visible.sync="deleteDialog" width="50%" :close-on-click-modal="false" @close="cancelDelete">
      <div class="delete_dialog">
        <span class="title" style="font-size: 16px;">是否删除名为 {{ curDepartment.departmentName }} 的数据?</span>
        <span slot="footer" class="dialog_footer">
          <el-button @click="deleteDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmDelete">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
export default {
  name: 'DepartmentManage',
  data() {
    return {
      tableData: [],

      //选项列表
      options: [
        {
          value: '0',
          label: '禁用',
        },
        {
          value: '1',
          label: '启用',
        },
      ],

      //检验规则
      rules: {
        departmentParentId: [{ required: true, message: '请选择上级部门', trigger: 'change' }],
        departmentName: [{ required: true, message: '请输入部门名称', trigger: 'change' }],
        departmentID: [{ required: true, message: '请输入部门标识 ', trigger: 'change' }],
      },

      //新增与编辑弹窗
      treeList: [],
      addOrUpdateDialog: false,
      addOrUpdateTitle: '新增',
      isAdding: true,
      addOrUpdateData: {
        id: '',
        //检验
        departmentParentId: '',
        departmentName: '',
        departmentID: '',
        //不检验
        departmentNumber: '',
        status: 0,
      },

      //删除弹窗
      deleteDialog: false,
      curDepartment: {},

      //搜索
      searchText: {
        departmentName: '',
        status: '',
        departmentNumber: '',
      },
    };
  },

  components: {
    Treeselect,
  },

  watch: {
    searchText: {
      handler() {
        this.$isEmpty(this.searchText) && this.getDepartmentInfo();
      },
      deep: true,
    },
  },

  mounted() {
    this.getDepartmentInfo();
  },

  methods: {
    //获取部门信息
    getDepartmentInfo() {
      this.$API
        .getDepartment(this.searchText)
        .then(res => {
          this.tableData = res.data.data || [];
        })
        .catch(err => {
          this.$msg(err.data);
        });
    },

    //添加或更新部门
    addOrUpdateDepartment() {
      if (this.addOrUpdateData.departmentParentId == '' || this.addOrUpdateData.departmentParentId == undefined) {
        this.addOrUpdateData.departmentParentId = 0;
      }
      this.$refs.addOrUpdateDialog.validate(valid => {
        return valid ? (this.isAdding ? this.addDepartment(this.addOrUpdateData) : this.updateDepartment(this.addOrUpdateData)) : false;
      });
    },

    //新增接口
    addDepartment(data) {
      this.$API
        .addDepartment(data)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.addOrUpdateDialog = false;
          this.getDepartmentInfo();
        });
    },

    //编辑接口
    updateDepartment(data) {
      this.$API
        .updateDepartment(data)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.addOrUpdateDialog = false;
          this.getDepartmentInfo();
        });
    },

    //删除接口
    deleteDepartment(data) {
      this.$API
        .deleteDepartment(data.id)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.deleteDialog = false;
          this.getDepartmentInfo();
        });
    },

    //获取树形下拉框的数据
    getTreeList() {
      let data = {
        departmentName: '',
        status: '',
        departmentNumber: '',
      };
      this.$API
        .getDepartment(data)
        .then(res => {
          this.treeList = res.data.data;
        })
        .catch(err => {
          this.$msg(err.data);
        });
    },

    //展示新增框
    showAdd() {
      this.getTreeList();
      this.addOrUpdateDialog = true;
      this.isAdding = true;
      this.addOrUpdateTitle = '新增';
    },

    //展示编辑框
    showEdit(row) {
      this.getTreeList();
      this.addOrUpdateDialog = true;
      this.isAdding = false;
      this.addOrUpdateTitle = '编辑';
      this.addOrUpdateData = row;
      this.addOrUpdateData.departmentParentId == 0 ? (this.addOrUpdateData.departmentParentId = '') : '';
    },

    //对数据进行提前处理
    normalizer(node) {
      return {
        id: node.id,
        label: node.departmentName,
        children: node.children,
      };
    },

    //重置按钮
    clearSearchText() {
      this.searchText = {
        departmentName: '',
        status: '',
        departmentNumber: '',
      };
    },

    //弹窗关闭的回调
    handleClose() {
      this.addOrUpdateDialog = false;
      this.isAdding = true;
      this.addOrUpdateTitle = '新增';
      this.addOrUpdateData = {
        //检验
        departmentParentId: '',
        departmentName: '',
        departmentID: '',
        //不检验
        departmentNumber: '',
        status: 0,
      };
      this.$refs['addOrUpdateDialog'].resetFields();
      this.getDepartmentInfo();
    },

    //显示删除弹窗
    showDelete(row) {
      this.curDepartment = row;
      this.deleteDialog = true;
    },

    //取消删除
    cancelDelete() {
      this.deleteDialog = false;
      this.curDepartment = {};
      this.getDepartmentInfo();
    },

    //确认删除
    confirmDelete() {
      this.deleteDepartment(this.curDepartment);
    },
  },
};
</script>

<style lang="less" scoped>
.department_manage {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .handle_field {
    width: 100%;
    height: 67.2px;
    margin: 20px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .search {
      width: 25%;
      padding-left: 10px;
      padding-right: 10px;
      box-sizing: border-box;
      display: flex;
      justify-content: center;
      align-items: start;
      flex-direction: column;
      /deep/ .el-select {
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
    .search_btn {
      display: flex;
      justify-content: end;
      align-items: flex-end;
      padding-right: 10px;
      box-sizing: border-box;
      width: 25%;
      height: 100%;
    }
  }
  .add_btn {
    width: 100%;
    margin-bottom: 25px;
    display: flex;
    justify-content: start;
    align-items: center;
  }
  .table_field {
    width: 100%;
  }

  .dialog_body {
    width: 100%;
    .form {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;

      .select_form {
        width: 100%;
        margin: 1%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
        .el-form-item__label {
          width: 100%;
          display: flex;
          justify-content: start;
          align-items: center;
        }
        .el-form-item__content {
          width: 100%;
          height: 40px;
          display: flex;
          justify-content: start;
          align-items: center;
          .el-select {
            width: 100%;
          }
        }
      }
      .form_item {
        width: 48%;
        margin: 1%;
        display: inline-block;
        .vue-treeselect {
          .vue-treeselect__input {
            height: 40px !important;
          }
        }
      }
      .radio_form {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
        .el-form-item__label {
          width: 100%;
          display: flex;
          justify-content: start;
          align-items: center;
        }
        .el-form-item__content {
          width: 100%;
          height: 40px;
          display: flex;
          justify-content: start;
          align-items: center;
        }
      }
    }
  }
}
</style>
