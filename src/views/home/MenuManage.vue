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
        <el-button type="primary"><span>查询</span></el-button>
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
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column fixed type="index" label="序号" width="80"></el-table-column>
        <el-table-column fixed prop="menuName" label="菜单名称" width="280"></el-table-column>
        <el-table-column fixed prop="menuType" label="菜单类型" width="120"></el-table-column>
        <el-table-column fixed prop="applicationId" label="应用名称" width="120"></el-table-column>
        <el-table-column prop="authorityID" label="权限标识" width="300"></el-table-column>
        <el-table-column prop="menuIcon" label="菜单图标" width="180"></el-table-column>
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
    <el-dialog :title="addOrUpdateTitle" :visible.sync="addOrUpdateDialog" width="50%" @close="handleClose">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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

      //新增或编辑弹窗
      addOrUpdateData: {},
      addOrUpdateDialog: false,
      isAdding: false,
      addOrUpdateTitle: '新增',

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

    //新增或编辑弹窗的关闭回调
    handleClose() {
      this.addOrUpdateDialog = false;
      this.$refs.addOrUpdateDialog.resetFields();
    },

    //清空搜索条件
    clearSearchText() {
      this.searchText = {};
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
      this.addOrUpdateData = row;
    },

    //删除弹出框
    showDelete(row) {
      this.deleteDialog = true;
      this.curMenu = row;
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
}
</style>
