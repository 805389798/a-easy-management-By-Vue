<!--
* @description 
* @fileName PostManage.vue
* @author Miaoxy
* @date 2022/07/13 14:44:35
!-->
<template>
  <!-- 岗位管理 -->
  <div class="post_manage">
    <!-- 搜索区域 -->
    <div class="handle_field">
      <div class="search" style="padding-left:0;">
        <span>岗位编码</span>
        <el-input clearable v-model="searchText.postCode" placeholder="请输入"></el-input>
      </div>
      <div class="search">
        <span>岗位名称</span>
        <el-input clearable v-model="searchText.postName" placeholder="请输入"></el-input>
      </div>
      <div class="search">
        <span>岗位状态</span>
        <el-select clearable v-model="searchText.status" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="search_btn">
        <el-button @click="clearSearchText"><span>重置</span></el-button>
        <el-button @click="getPostInfo" type="primary"><span>查询</span></el-button>
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
        :show-overflow-tooltip="true"
        :header-cell-style="{ background: '#F0F0F0', color: '#333333' }"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column type="selection" min-width="50" align="center"></el-table-column>
        <el-table-column fixed type="index" label="序号" min-width="100"></el-table-column>
        <el-table-column prop="postName" label="岗位名称" min-width="260">
          <template slot-scope="scope">
            <span>
              {{ scope.row.postName ? (scope.row.postName.length > 10 ? scope.row.postName.slice(0, 10) + '...' : scope.row.postName) : '' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="postCode" label="岗位编码" min-width="180">
          <template slot-scope="scope">
            <span>
              {{ scope.row.postCode ? (scope.row.postCode.length > 10 ? scope.row.postCode.slice(0, 10) + '...' : scope.row.postCode) : '' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="岗位状态" min-width="160">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status == 0 ? 'danger' : 'success'">{{ scope.row.status == 0 ? '禁用' : '启用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="240" align="center">
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
          <el-form-item prop="postParentId" label="上级岗位" class="form_item" style="padding-left: 0;">
            <Treeselect v-model="addOrUpdateData.postParentId" :options="treeList" :normalizer="normalizer" placeholder="根目录">
              <div v-if="addOrUpdateData.postParentId != ''" slot="value-label" slot-scope="{ node }">{{ node.label }}</div>
              <span v-else>根目录</span>
            </Treeselect>
          </el-form-item>
          <el-form-item prop="postName" label="岗位名称" class="form_item" style="padding-left: 0;">
            <el-input clearable v-model="addOrUpdateData.postName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item prop="postCode" label="岗位编码" class="form_item" style="padding-left: 0;">
            <el-input clearable v-model="addOrUpdateData.postCode" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item prop="postLevel" label="岗位等级" class="form_item" style="padding-left: 0;">
            <el-select v-model="addOrUpdateData.postLevel" placeholder="请选择" style="width: 100%;">
              <el-option v-for="item in levelList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="form_item radio_form" prop="status" label="岗位状态" style="padding-left: 0;">
            <el-radio-group v-model="addOrUpdateData.status">
              <el-radio :label="0"><span>禁用</span></el-radio>
              <el-radio :label="1"><span>启用</span></el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrUpdateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdatePost">确 定</el-button>
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
export default {
  name: 'PostManage',
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
        postName: [{ required: true, message: '请输入岗位名称', trigger: 'change' }],
        postCode: [{ required: true, message: '请输入岗位编码', trigger: 'change' }],
        postLevel: [{ required: true, message: '请选择岗位等级', trigger: 'change' }],
      },

      //等级列表
      levelList: [
        {
          value: 'CEO',
          label: 'CEO',
        },
        {
          value: '副总',
          label: '副总',
        },
        {
          value: '部长',
          label: '部长',
        },
        {
          value: '高级经理',
          label: '高级经理',
        },
        {
          value: '经理',
          label: '经理',
        },
      ],

      //搜索信息
      searchText: {
        postCode: '',
        postName: '',
        status: '',
      },

      //新增或更新弹窗
      treeList: [],
      isAdding: true,
      addOrUpdateData: {
        id: '',
        //检验
        postName: '',
        postCode: '',
        postLevel: '',
        //不检验
        postParentId: '',
        status: 1,
      },
      addOrUpdateDialog: false,
      addOrUpdateTitle: '新增',

      //删除弹窗
      deleteDialog: false,
      curPost: {},
    };
  },

  components: {
    Treeselect,
  },

  watch: {
    searchText: {
      handler() {
        this.$isEmpty(this.searchText) && this.getPostInfo();
      },
      deep: true,
    },
  },

  mounted() {
    this.getPostInfo();
    this.getTreeList();
  },

  methods: {
    //获取岗位信息
    getPostInfo() {
      this.$API
        .getPost(this.searchText)
        .then(res => {
          this.tableData = res.data.data || [];
        })
        .catch(err => {
          this.$msg(err.data);
        });
    },

    //获取下拉选择框数据
    getTreeList() {
      this.$API
        .getPostTree()
        .then(res => {
          this.treeList = res.data.data || [];
        })
        .catch(err => {
          this.$msg(err.data);
        });
    },

    //新增或编辑岗位
    addOrUpdatePost() {
      if (this.addOrUpdateData.postParentId == '' || this.addOrUpdateData.postParentId == undefined) {
        this.addOrUpdateData.postParentId = 0;
      }
      this.$refs.addOrUpdateDialog.validate(valid => {
        return valid ? (this.isAdding ? this.addPost(this.addOrUpdateData) : this.updatePost(this.addOrUpdateData)) : false;
      });
    },

    //新增接口
    addPost(data) {
      this.$API
        .addPost(data)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.addOrUpdateDialog = false;
          this.getPostInfo();
        });
    },

    //编辑接口
    updatePost(data) {
      this.$API
        .updatePost(data)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.addOrUpdateDialog = false;
          this.getPostInfo();
        });
    },

    //删除接口
    deletePost(data) {
      this.$API
        .deletePost(data.id)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.deleteDialog = false;
          this.getPostInfo();
        });
    },

    //显示新增弹窗
    showAdd() {
      this.addOrUpdateDialog = true;
      this.addOrUpdateTitle = '新增';
      this.isAdding = true;
    },

    //显示编辑弹窗
    showEdit(row) {
      this.addOrUpdateDialog = true;
      this.isAdding = false;
      this.addOrUpdateTitle = '编辑';
      this.addOrUpdateData = JSON.parse(JSON.stringify(row));
      this.addOrUpdateData.postParentId == 0 ? (this.addOrUpdateData.postParentId = '') : '';
    },

    //对数据进行提前处理
    normalizer(node) {
      return {
        id: node.id,
        label: node.postName,
        children: node.children,
      };
    },

    //清空搜索条件
    clearSearchText() {
      this.searchText = {
        postCode: '',
        postName: '',
        status: '',
      };
    },

    //弹窗关闭后的回调
    handleClose() {
      this.addOrUpdateDialog = false;
      this.isAdding = true;
      this.addOrUpdateTitle = '新增';
      this.addOrUpdateData = {
        //检验
        postName: '',
        postCode: '',
        postLevel: '',
        //不检验
        postParentId: '',
        status: 1,
      };
      this.$refs.addOrUpdateDialog.resetFields();
      this.getPostInfo();
    },

    //显示删除弹窗
    showDelete(row) {
      this.curPost = row;
      this.deleteDialog = true;
    },

    //取消删除
    cancelDelete() {
      this.deleteDialog = false;
      this.curPost = {};
      this.getPostInfo();
    },

    //确认删除
    confirmDelete() {
      this.deletePost(this.curPost);
    },
  },
};
</script>

<style lang="less" scoped>
.post_manage {
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
      .form_item {
        width: 48%;
        margin: 1%;
        display: inline-block;
      }
      .radio_form {
        width: 100%;
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
