<!--
* @description 
* @fileName MenuManage.vue
* @author Miaoxy
* @date 2022/07/13 14:43:27
!-->
<template>
  <!-- 菜单管理 -->
  <div class="menu_manage">
    <!-- 搜索区域 -->
    <div class="handle_field">
      <div class="search" style="padding-left:0;">
        <span>菜单名称</span>
        <el-input clearable v-model="searchText.menuName" placeholder="请输入"></el-input>
      </div>
      <div class="search">
        <span>菜单状态</span>
        <el-select clearable v-model="searchText.status" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="search_btn">
        <el-button @click="clearSearchText"><span>重置</span></el-button>
        <el-button @click="getMenuList" type="primary"><span>查询</span></el-button>
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
        :show-overflow-tooltip="true"
        height="calc(100vh - 340px)"
        :header-cell-style="{ background: '#F0F0F0', color: '#333333' }"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column fixed type="index" label="序号" width="80"></el-table-column>
        <el-table-column fixed prop="menuName" label="菜单名称" width="200"></el-table-column>
        <el-table-column fixed prop="menuType" label="菜单类型" width="120">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.menuType == '' || scope.row.menuType == undefined" type="success">菜单</el-tag>
            <el-tag v-show="scope.row.menuType == 0">目录</el-tag>
            <el-tag v-show="scope.row.menuType == 1" type="success">菜单</el-tag>
            <el-tag v-show="scope.row.menuType == 2" type="info">按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column fixed prop="applicationId" label="应用名称" width="120"></el-table-column>
        <el-table-column prop="authorityID" label="权限标识" width="180"></el-table-column>
        <el-table-column prop="menuIcon" label="菜单图标" width="100" align="center">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.menuIcon">
              <i :class="scope.row.menuIcon"></i>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="componentPath" label="组件路径" width="180"></el-table-column>
        <el-table-column prop="status" label="状态" width="180">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status == 0 ? 'danger' : 'success'">{{ scope.row.status == 0 ? '禁用' : '启用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column fixed="right" label="操作" width="240" align="center">
          <template slot-scope="scope">
            <el-button style="color:#7B80E3;" @click.native.prevent="showUpdate(scope.row)" type="text">
              编辑
            </el-button>
            <span style="color:#E5E5E5;margin:0 16px;">|</span>
            <el-button style="color:#7B80E3;" @click.native.prevent="showAdd(scope.row)" type="text">
              新增
            </el-button>
            <span style="color:#E5E5E5;margin:0 16px;">|</span>
            <el-button @click.native.prevent="showDelete(scope.row)" type="text" style="color:red;">
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
      :destroy-on-close="true"
    >
      <div class="dialog_body">
        <el-form ref="addOrUpdateDialog" class="form" :rules="rules" :model="addOrUpdateData">
          <el-form-item prop="applicationId" label="应用名称" class="form_item">
            <el-select clearable v-model="addOrUpdateData.applicationId" placeholder="请选择" style="width:100%;">
              <el-option v-for="item in applicationOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="menuParentId" label="上级菜单" class="form_item">
            <Treeselect v-model="addOrUpdateData.menuParentId" :options="treeList" :normalizer="normalizer" placeholder="根目录">
              <div v-if="addOrUpdateData.menuParentId != ''" slot="value-label" slot-scope="{ node }">{{ node.label }}</div>
              <span v-else>根目录</span>
            </Treeselect>
          </el-form-item>
          <el-form-item prop="menuName" label="菜单名称" class="form_item">
            <el-input clearable v-model="addOrUpdateData.menuName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item prop="routingPath" label="路由地址" class="form_item">
            <el-input clearable v-model="addOrUpdateData.routingPath" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item prop="componentPath" label="组件路径" class="form_item">
            <el-input clearable v-model="addOrUpdateData.componentPath" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item prop="authorityID" label="权限字符" class="form_item">
            <el-input clearable v-model="addOrUpdateData.authorityID" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item prop="menuWeight" label="菜单权重" class="form_item form_number">
            <el-input-number controls-position="right" v-model="addOrUpdateData.menuWeight" placeholder="请选择" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item prop="status" label="显示状态" class="form_item radio_form">
            <el-radio-group v-model="addOrUpdateData.showStatus">
              <el-radio :label="0"><span>隐藏</span></el-radio>
              <el-radio :label="1"><span>显示</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="status" label="菜单状态" class="form_item radio_form">
            <el-radio-group v-model="addOrUpdateData.status">
              <el-radio :label="0"><span>禁用</span></el-radio>
              <el-radio :label="1"><span>启用</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="menuIcon" label="菜单图标" class="form_icon">
            <div class="flex">
              <IconSelect @mySelect="handleSelect" :selectName="addOrUpdateData.menuIcon"></IconSelect>
              <el-input v-model="addOrUpdateData.menuIcon" disabled></el-input>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrUpdateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateMenu">确 定</el-button>
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
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import IconSelect from '@/components/IconSelect';
export default {
  name: 'MenuManage',
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

      //校验规则
      rules: {
        applicationId: [{ required: true, message: '请选择部门', trigger: 'change' }],
        menuParentId: [{ required: true, message: '请选择上级菜单', trigger: 'change' }],
        menuName: [{ required: true, message: '请输入菜单名称', trigger: 'change' }],
        routingPath: [{ required: true, message: '请输入路由地址', trigger: 'change' }],
        componentPath: [{ required: true, message: '请输入组件路径', trigger: 'change' }],
        menuWeight: [{ required: true, message: '请选择菜单权重', trigger: 'change' }],
      },

      //新增或编辑弹窗
      addOrUpdateData: {
        applicationId: '',
        menuParentId: '',
        menuName: '',
        routingPath: '',
        componentPath: '',
        status: 1,
        menuIcon: '',
        showStatus: 1,
        menuWeight: 0,
      },
      addOrUpdateDialog: false,
      isAdding: false,
      addOrUpdateTitle: '新增',
      treeList: [],

      //删除弹窗
      deleteDialog: false,
      curMenu: {},

      //搜索
      searchText: {
        menuName: '',
        status: '',
      },
    };
  },

  components: {
    Treeselect,
    IconSelect,
  },

  watch: {
    searchText: {
      handler() {
        this.$isEmpty(this.searchText) && this.getMenuList();
      },
      deep: true,
    },
  },

  mounted() {
    this.getMenuList();
    this.getMenuTree();
  },

  methods: {
    //获取菜单列表
    getMenuList() {
      this.$API
        .getMenuList(this.searchText)
        .then(res => {
          this.tableData = res.data.data || [];
        })
        .catch(err => {
          this.$msg(err.data);
        });
    },

    //获取菜单树形列表
    getMenuTree() {
      this.$API
        .getMenuList()
        .then(res => {
          this.treeList = res.data.data || [];
        })
        .catch(err => {
          this.$msg(err.data);
        });
    },

    //删除接口
    deleteMenu(data) {
      this.$API
        .deleteMenu(data.id)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.deleteDialog = false;
          this.getMenuList();
        });
    },

    //新增或编辑菜单
    addOrUpdateMenu() {
      if (this.addOrUpdateData.menuParentId == '' || this.addOrUpdateData.menuParentId == undefined) {
        this.addOrUpdateData.menuParentId = 0;
      }
      this.$refs.addOrUpdateDialog.validate(valid => {
        return valid ? (this.isAdding ? this.addMenu(this.addOrUpdateData) : this.updateMenu(this.addOrUpdateData)) : false;
      });
    },

    //新增接口
    addMenu(data) {
      this.$API
        .addMenu(data)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.addOrUpdateDialog = false;
          this.getMenuList();
        });
    },

    //编辑接口
    updateMenu(data) {
      this.$API
        .updateMenu(data)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.addOrUpdateDialog = false;
          this.getMenuList();
        });
    },

    //新增或编辑弹窗的关闭回调
    handleClose() {
      this.addOrUpdateDialog = false;
      this.addOrUpdateData = {
        applicationId: '',
        menuParentId: '',
        menuName: '',
        routingPath: '',
        componentPath: '',
        status: 1,
        menuIcon: '',
        menuWeight: 0,
      };
      this.$refs.addOrUpdateDialog.resetFields();
      this.getMenuList();
    },

    //清空搜索条件
    clearSearchText() {
      this.searchText = {};
    },

    //对数据进行提前处理
    normalizer(node) {
      return {
        id: node.id,
        label: node.menuName,
        children: node.children,
      };
    },

    //新增弹出框
    showAdd() {
      this.addOrUpdateDialog = true;
      this.addOrUpdateTitle = '新增';
      this.isAdding = true;
    },

    //编辑弹出框
    showUpdate(row) {
      this.addOrUpdateDialog = true;
      this.addOrUpdateTitle = '编辑';
      this.isAdding = false;
      this.addOrUpdateData = JSON.parse(JSON.stringify(row));
      this.addOrUpdateData.menuParentId == 0 ? (this.addOrUpdateData.menuParentId = '') : '';
    },

    //删除弹出框
    showDelete(row) {
      this.deleteDialog = true;
      this.curMenu = JSON.parse(JSON.stringify(row));
    },

    //取消删除
    cancelDelete() {
      this.deleteDialog = false;
      this.curMenu = {};
      this.getMenuList();
    },

    //确认删除
    confirmDelete() {
      this.deleteMenu(this.curMenu);
    },

    //选择图标
    handleSelect(name) {
      this.addOrUpdateData.menuIcon = name;
    },
  },
};
</script>

<style lang="less" scoped>
.menu_manage {
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
      justify-content: start;
      align-items: flex-end;
      padding-right: 10px;
      box-sizing: border-box;
      width: 50%;
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
  .paging {
    display: flex;
    justify-content: end;
    align-items: center;
    margin-top: 30px;
    width: 100%;
  }

  .dialog_body {
    width: 100%;
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
      .form_number {
        width: 48%;
        margin: 1%;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
        /deep/ .el-input-number {
          width: 100%;
        }
      }
      .form_item_title {
        width: 98%;
        margin: 1%;
      }
      .form_icon {
        width: 98%;
        margin: 1%;
        .el-form-item__content {
          width: 100%;
          .flex {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            /deep/ .el-button {
              margin-right: 10px;
            }
          }
        }
      }

      .radio_form {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
        width: 48%;
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
