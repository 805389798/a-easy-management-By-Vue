<!--
* @description 
* @fileName DictionaryManage.vue
* @author Miaoxy
* @date 2022/07/13 14:45:14
!-->
<template>
  <!-- 字典管理 -->
  <div class="dictionary_manage">
    <!-- 搜索区域 -->
    <div class="handle_field">
      <div class="search" style="padding-left:0;">
        <span>字典名称</span>
        <el-input clearable placeholder="请输入" v-model="searchText.dictionaryName"></el-input>
      </div>
      <div class="search">
        <span>字典类型</span>
        <el-input clearable placeholder="请输入" v-model="searchText.dictionaryType"></el-input>
      </div>
      <div class="search">
        <span>数据状态</span>
        <el-select v-model="searchText.status" clearable placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="search">
        <span>备注</span>
        <el-input clearable placeholder="请输入" v-model="searchText.remark"></el-input>
      </div>
      <div class="search_btn">
        <el-button @click="clearSearchText"><span>重置</span></el-button>
        <el-button @click="getDictionaryInfo" type="primary"><span>查询</span></el-button>
      </div>
    </div>

    <!-- 新增与状态切换按钮 -->
    <div class="add_btn">
      <el-button @click="showAdd" type="primary"><span>新增</span></el-button>
      <el-button @click="changeStatus" :disabled="!isSelected" type="primary"><span>状态切换</span></el-button>
    </div>

    <!-- 表格区域 -->
    <div class="table_field">
      <el-table
        :data="tableData"
        @selection-change="changeBtnState"
        style="width: 100%;"
        height="calc(100vh - 400px)"
        :show-overflow-tooltip="true"
        :header-cell-style="{ background: '#F0F0F0', color: '#333333' }"
      >
        <el-table-column type="selection" min-width="50" align="center"></el-table-column>
        <el-table-column fixed type="index" label="序号" min-width="80"></el-table-column>
        <el-table-column prop="dictionaryName" label="字典名称" min-width="120">
          <template slot-scope="scope">
            <span>
              {{
                scope.row.dictionaryName
                  ? scope.row.dictionaryName.length > 10
                    ? scope.row.dictionaryName.slice(0, 10) + '...'
                    : scope.row.dictionaryName
                  : ''
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="dictionaryType" label="字典类型" min-width="180">
          <template slot-scope="scope">
            <span>
              {{
                scope.row.dictionaryType
                  ? scope.row.dictionaryType.length > 10
                    ? scope.row.dictionaryType.slice(0, 10) + '...'
                    : scope.row.dictionaryType
                  : ''
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="120">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status == 0 ? 'danger' : 'success'">{{ scope.row.status == 0 ? '禁用' : '启用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" min-width="300">
          <template slot-scope="scope">
            {{ scope.row.remark ? (scope.row.remark.length > 10 ? scope.row.remark.slice(0, 10) + '...' : scope.row.remark) : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180"></el-table-column>
        <el-table-column fixed="right" label="操作" width="240" align="center">
          <template slot-scope="scope">
            <el-button style="color:#7B80E3;" @click.native.prevent="showUpdate(scope.row)" type="text">
              编辑
            </el-button>
            <span style="color:#E5E5E5;margin:0 16px;">|</span>
            <el-button style="color:#7B80E3;" @click.native.prevent="showEdit(scope.row)" type="text">
              字典配置
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

    <!-- 添加和编辑弹窗 -->
    <el-dialog :title="addOrUpdateTitle" :visible.sync="addOrUpdateDialog" width="60%" :close-on-click-modal="false" @close="handleClose">
      <div class="dialog_body">
        <el-form ref="addOrUpdateDialog" class="form" :rules="rules" :model="addOrUpdateData.ruleForm">
          <el-form-item prop="dictionaryName" label="字典名称" class="form_item" style="padding-left: 0;">
            <el-input clearable v-model="addOrUpdateData.ruleForm.dictionaryName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item prop="dictionaryType" label="字典类型" class="form_item" style="padding-right: 0;">
            <el-input clearable v-model="addOrUpdateData.ruleForm.dictionaryType" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>

        <el-radio-group v-model="addOrUpdateData.radio">
          <el-radio :label="0"><span>禁用</span></el-radio>
          <el-radio :label="1"><span>启用</span></el-radio>
        </el-radio-group>

        <div class="remark">
          <span>备注</span>
          <el-input clearable type="textarea" placeholder="请输入内容" v-model="addOrUpdateData.remark"></el-input>
        </div>
      </div>

      <span slot="footer" class="dialog_footer">
        <el-button @click="addOrUpdateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateDictionaryInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 确认删除弹窗 -->
    <el-dialog title="确认删除" :visible.sync="deleteDialog" width="50%" :close-on-click-modal="false" @close="cancelDelete">
      <div class="delete_dialog">
        <span class="title" style="font-size: 16px;">是否确认删除?</span>
        <span slot="footer" class="dialog_footer">
          <el-button @click="deleteDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmDelete">确 定</el-button>
        </span>
      </div>
    </el-dialog>

    <!-- 字段弹窗 -->
    <el-dialog title="字典配置" :visible.sync="editDialog" width="70%" :close-on-click-modal="false" @close="handleField">
      <!-- 字段头部区域 -->
      <div class="edit_body">
        <el-form class="edit_form" :model="fieldSearchText">
          <el-form-item prop="dictionaryName" label="字段名称" class="form_item" style="padding-left: 0;">
            <el-input clearable v-model="fieldSearchText.fieldName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item prop="dictionaryType" label="字段值" class="form_item" style="padding-right: 0;">
            <el-input clearable v-model="fieldSearchText.fieldValue" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>
        <div class="search_btn">
          <el-button @click="clearFieldSearchText"><span>重置</span></el-button>
          <el-button type="primary" @click="getFieldInfo"><span>查询</span></el-button>
        </div>
        <div class="add_btn">
          <el-button type="primary" @click="showFieldAdd"><span>新增</span></el-button>
        </div>
      </div>

      <!-- 字段表格区域 -->
      <div class="edit_table">
        <el-table
          :show-overflow-tooltip="true"
          :data="fieldData"
          style="width: 100%;"
          height="300px"
          :header-cell-style="{ background: '#F0F0F0', color: '#333333' }"
        >
          <el-table-column fixed type="index" label="序号" min-width="80"></el-table-column>
          <el-table-column prop="fieldName" label="字段名称" min-width="120">
            <template slot-scope="scope">
              <span>
                {{ scope.row.fieldName ? (scope.row.fieldName.length > 10 ? scope.row.fieldName.slice(0, 10) + '...' : scope.row.fieldName) : '' }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="fieldValue" label="字段值" min-width="180">
            <template slot-scope="scope">
              <span>
                {{
                  scope.row.fieldValue ? (scope.row.fieldValue.length > 10 ? scope.row.fieldValue.slice(0, 10) + '...' : scope.row.fieldValue) : ''
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" min-width="120">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status == 0 ? 'danger' : 'success'">{{ scope.row.status == 0 ? '禁用' : '启用' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="300">
            <template slot-scope="scope">
              {{ scope.row.remark ? (scope.row.remark.length > 10 ? scope.row.remark.slice(0, 10) + '...' : scope.row.remark) : '' }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" min-width="240" align="center">
            <template slot-scope="scope">
              <el-button style="color:#7B80E3;" @click.native.prevent="showFieldEdit(scope.row)" type="text">
                编辑
              </el-button>
              <span style="color:#E5E5E5;margin:0 16px;">|</span>
              <el-button @click.native.prevent="showFieldDelete(scope.row)" type="text" style="color:red;">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 字段分页 -->
      <div class="paging">
        <el-pagination
          class="msg-pagination-container"
          @size-change="handleFieldSizeChange"
          @current-change="handleFieldCurrentChange"
          :current-page="fieldCurrentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="fieldPageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="fieldTotalPage"
          background
        ></el-pagination>
      </div>

      <!-- 字段按钮 -->
      <div slot="footer" class="handle_btn">
        <span class="dialog_footer">
          <el-button @click="editDialog = false">取 消</el-button>
          <el-button type="primary" @click="editDialog = false">确 定</el-button>
        </span>
      </div>
    </el-dialog>

    <!-- 字段新增弹窗 -->
    <el-dialog :title="fieldTitle" :visible.sync="fieldDialog" width="60%" :close-on-click-modal="false" @close="handleFieldClose">
      <div class="dialog_body">
        <el-form ref="fieldDialog" class="form" :rules="fieldRules" :model="fieldAddOrUpdateData.ruleForm">
          <el-form-item prop="fieldName" label="字段名称" class="form_item" style="padding-left: 0;">
            <el-input clearable v-model="fieldAddOrUpdateData.ruleForm.fieldName" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item prop="fieldValue" label="字段值" class="form_item" style="padding-right: 0;">
            <el-input clearable v-model="fieldAddOrUpdateData.ruleForm.fieldValue" placeholder="请输入"></el-input>
          </el-form-item>
        </el-form>

        <el-radio-group v-model="fieldAddOrUpdateData.radio">
          <el-radio :label="0"><span>禁用</span></el-radio>
          <el-radio :label="1"><span>启用</span></el-radio>
        </el-radio-group>

        <div class="remark">
          <span>备注</span>
          <el-input clearable type="textarea" placeholder="请输入内容" v-model="fieldAddOrUpdateData.remark"></el-input>
        </div>
      </div>

      <span slot="footer" class="dialog_footer">
        <el-button @click="fieldDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateFieldInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 字段删除弹窗 -->
    <el-dialog title="确认删除" :visible.sync="deleteFieldDialog" width="50%" :close-on-click-modal="false" @close="cancelDeleteField">
      <div class="delete_dialog">
        <span class="title" style="font-size: 16px;">是否确认删除?</span>
        <span slot="footer" class="dialog_footer">
          <el-button @click="deleteFieldDialog = false">取 消</el-button>
          <el-button type="primary" @click="confirmDeleteField">确 定</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DictionaryManage',
  data() {
    return {
      //表单数据
      tableData: [],

      //下拉框选项
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

      //弹窗检验规则
      rules: {
        dictionaryName: [{ required: true, message: '请输入字典名称', trigger: 'change' }],
        dictionaryType: [{ required: true, message: '请输入字典类型', trigger: 'change' }],
      },

      //字段弹窗检测规则
      fieldRules: {
        fieldName: [{ required: true, message: '请输入字段名称', trigger: 'change' }],
        fieldValue: [{ required: true, message: '请输入字段值', trigger: 'change' }],
      },

      //搜索数据
      searchText: {
        dictionaryName: '',
        dictionaryType: '',
        status: '',
        remark: '',
      },

      //字段搜索数据
      fieldSearchText: {
        fieldName: '',
        fieldValue: '',
      },

      //下拉框
      value: '',

      //状态切换按钮是否可点击
      isSelected: false,
      curSelectedList: [],

      //控制弹窗是否显示
      addOrUpdateDialog: false,
      deleteDialog: false,
      editDialog: false,

      //外部表格分页
      currentPage: 1,
      pageSize: 10,
      totalPage: 40,
      curDictionary: {},

      //字段分页
      fieldCurrentPage: 1,
      fieldPageSize: 10,
      fieldTotalPage: 40,
      curField: {},

      //字段弹窗数据
      fieldData: [],
      fieldTitle: '新增',
      isAddingField: true,
      fieldDialog: false,
      deleteFieldDialog: false,
      dictionaryId: '',
      fieldAddOrUpdateData: {
        ruleForm: {
          fieldName: '',
          fieldValue: '',
        },
        radio: 1,
        remark: '',
      },

      //外部弹窗数据
      isAdding: true,
      addOrUpdateTitle: '新增',
      addOrUpdateData: {
        id: '',
        radio: 1,
        ruleForm: {
          dictionaryName: '',
          dictionaryType: '',
        },
        remark: '',
      },
    };
  },

  watch: {
    //字典搜索条件
    searchText: {
      handler() {
        this.$isEmpty(this.searchText) && this.getDictionaryInfo();
      },
      deep: true,
    },

    //字段搜索条件
    fieldSearchText: {
      handler() {
        this.editDialog && this.$isEmpty(this.fieldSearchText) && this.getFieldInfo();
      },
      deep: true,
    },
  },

  mounted() {
    this.getDictionaryInfo();
  },

  methods: {
    //获取字典信息
    getDictionaryInfo() {
      let data = {
        pageSize: this.pageSize,
        pageNum: this.currentPage,
      };
      Object.assign(data, this.searchText);
      this.$API
        .getDictionary(data)
        .then(res => {
          this.tableData = res.data.data || [];
          this.totalPage = res.data.total;
        })
        .catch(err => {
          this.$msg(err.data);
        });
    },

    //新增和编辑字典信息
    addOrUpdateDictionaryInfo() {
      this.$refs.addOrUpdateDialog.validate(valid => {
        let data = {
          id: this.addOrUpdateData.id,
          dictionaryName: this.addOrUpdateData.ruleForm.dictionaryName,
          dictionaryType: this.addOrUpdateData.ruleForm.dictionaryType,
          status: this.addOrUpdateData.radio,
          remark: this.addOrUpdateData.remark,
        };
        return valid ? (this.isAdding ? this.addDictionary(data) : this.updateDictionary(data)) : false;
      });
    },

    //新增字典接口
    addDictionary(data) {
      this.$API
        .addDictionary(data)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.addOrUpdateDialog = false;
          this.getDictionaryInfo();
        });
    },

    //编辑字典接口
    updateDictionary(data) {
      this.$API
        .updateDictionary(data)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.addOrUpdateDialog = false;
          this.getDictionaryInfo();
        });
    },

    //获取字段信息
    getFieldInfo() {
      let data = {
        dictionaryId: this.dictionaryId,
        pageSize: this.fieldPageSize,
        pageNum: this.fieldCurrentPage,
        fieldName: this.fieldSearchText.fieldName,
        fieldValue: this.fieldSearchText.fieldValue,
      };
      this.$API
        .getField(data)
        .then(res => {
          this.fieldData = res.data.data || [];
          this.fieldTotalPage = res.data.total;
        })
        .catch(err => {});
    },

    //新增或编辑字段信息
    addOrUpdateFieldInfo() {
      this.$refs.fieldDialog.validate(valid => {
        let data = {
          dictionaryId: this.dictionaryId,
          id: this.fieldAddOrUpdateData.id,
          fieldName: this.fieldAddOrUpdateData.ruleForm.fieldName,
          fieldValue: this.fieldAddOrUpdateData.ruleForm.fieldValue,
          status: this.fieldAddOrUpdateData.radio,
          remark: this.fieldAddOrUpdateData.remark,
        };
        return valid ? (this.isAddingField ? this.addField(data) : this.updateField(data)) : false;
      });
    },

    //新增字段接口
    addField(data) {
      this.$API
        .addField(data)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.fieldDialog = false;
          this.getFieldInfo();
        });
    },

    //编辑字段接口
    updateField(data) {
      this.$API
        .updateField(data)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.fieldDialog = false;
          this.getFieldInfo();
        });
    },

    //切换状态
    changeStatus() {
      let idList = [];
      for (let item of this.curSelectedList) {
        idList.push(item.id);
      }
      this.$API
        .changeDictionaryStatus(idList)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.getDictionaryInfo();
        });
    },

    //切换按钮状态
    changeBtnState(rows) {
      if (rows.length != 0) {
        //选中
        this.isSelected = true;
        this.curSelectedList = [...rows];
      } else {
        //没选
        this.isSelected = false;
      }
    },

    //显示字段新增弹窗
    showFieldAdd() {
      this.fieldTitle = '新增';
      this.fieldDialog = true;
      this.isAddingField = true;
    },

    //显示字段编辑弹窗
    showFieldEdit(row) {
      this.fieldTitle = '编辑';
      this.fieldDialog = true;
      this.isAddingField = false;
      let data = JSON.parse(JSON.stringify(row));
      this.fieldAddOrUpdateData.id = data.id;
      this.fieldAddOrUpdateData.radio = data.status;
      this.fieldAddOrUpdateData.ruleForm.fieldValue = data.fieldValue;
      this.fieldAddOrUpdateData.ruleForm.fieldName = data.fieldName;
      this.fieldAddOrUpdateData.remark = data.remark;
    },

    //显示新增框
    showAdd() {
      this.isAdding = true;
      this.addOrUpdateTitle = '新增';
      this.addOrUpdateDialog = true;
    },

    //显示编辑框
    showUpdate(row) {
      this.isAdding = false;
      this.addOrUpdateTitle = '编辑';
      this.addOrUpdateDialog = true;
      let data = JSON.parse(JSON.stringify(row));
      this.addOrUpdateData.id = data.id;
      this.addOrUpdateData.radio = data.status;
      this.addOrUpdateData.ruleForm.dictionaryType = data.dictionaryType;
      this.addOrUpdateData.ruleForm.dictionaryName = data.dictionaryName;
      this.addOrUpdateData.remark = data.remark;
    },

    //显示字典配置按钮
    showEdit(row) {
      this.editDialog = true;
      this.dictionaryId = row.id;
      this.getFieldInfo();
    },

    //字典配置取消按钮
    handleField() {
      this.fieldSearchText = {
        fieldName: '',
        fieldValue: '',
      };
      this.editDialog = false;
      this.getDictionaryInfo();
    },

    //显示删除确认框
    showDelete(row) {
      this.deleteDialog = true;
      this.curDictionary = row;
    },

    //显示字段删除弹窗
    showFieldDelete(row) {
      this.deleteFieldDialog = true;
      this.curField = JSON.parse(JSON.stringify(row));
    },

    //新增和编辑框退出时调用
    handleClose() {
      this.addOrUpdateData = {
        radio: 1,
        ruleForm: {
          dictionaryName: '',
          dictionaryType: '',
        },
        remark: '',
      };
      this.addOrUpdateDialog = false;
      this.addOrUpdateTitle = '新增';
      this.isAdding = true;
      this.$refs.addOrUpdateDialog.resetFields();
      this.getDictionaryInfo();
    },

    //字段新增和编辑框退出时调用
    handleFieldClose() {
      this.fieldAddOrUpdateData = {
        ruleForm: {
          fieldName: '',
          fieldValue: '',
        },
        radio: 1,
        remark: '',
      };
      this.$refs.fieldDialog.resetFields();
      this.getFieldInfo();
    },

    //取消字段新增或编辑
    cancelAddOrUpdateField() {
      this.fieldDialog = false;
      this.addOrUpdateTitle = '新增';
      this.isAddingField = true;
      this.$refs.fieldDialog.resetFields();
      this.getFieldInfo();
    },

    //清空搜索条件
    clearSearchText() {
      this.searchText = {
        dictionaryName: '',
        dictionaryType: '',
        status: '',
        remark: '',
      };
    },

    //清空字段搜索条件
    clearFieldSearchText() {
      this.fieldSearchText = {
        fieldName: '',
        fieldValue: '',
      };
    },

    //确认删除
    confirmDelete() {
      this.deleteDictionaryInfo(this.curDictionary);
    },

    //取消删除
    cancelDelete() {
      this.curDictionary = {};
      this.deleteDialog = false;
      this.getDictionaryInfo();
    },

    //删除接口
    deleteDictionaryInfo(data) {
      this.$API
        .deleteDictionary(data.id)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.deleteDialog = false;
          this.getDictionaryInfo();
        });
    },

    //字段确认删除
    confirmDeleteField() {
      this.deleteFieldInfo(this.curField);
    },

    //字段取消删除
    cancelDeleteField() {
      this.curField = {};
      this.deleteFieldDialog = false;
      this.getFieldInfo();
    },

    //字段删除接口
    deleteFieldInfo(data) {
      this.$API
        .deleteField(data.id)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.deleteFieldDialog = false;
          this.getFieldInfo();
        });
    },

    //设置每页多少条数据
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDictionaryInfo();
    },

    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDictionaryInfo();
    },

    //设置字段每页多少条数据
    handleFieldSizeChange(val) {
      this.fieldPageSize = val;
      this.getFieldInfo();
    },

    //字段翻页
    handleFieldCurrentChange(val) {
      this.fieldCurrentPage = val;
      this.getFieldInfo();
    },
  },
};
</script>

<style lang="less" scoped>
.dictionary_manage {
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
      width: 20%;
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
      width: 20%;
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
    .form {
      display: flex;
      justify-content: center;
      align-items: center;
      .form_item {
        width: 50%;
        padding: 0 10px;
        box-sizing: border-box;
      }
    }
    .remark {
      width: 100%;
      padding-top: 20px;
      box-sizing: border-box;
      span {
        display: block;
        margin-bottom: 10px;
      }
    }
  }
  .edit_body {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .edit_form {
      width: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      .el-form-item {
        padding: 0 10px;
        width: 50%;
      }
    }
    .search_btn {
      width: 50%;
      height: 80px;
      margin-bottom: 22px;
      display: flex;
      padding-left: 10px;
      box-sizing: border-box;
      justify-content: start;
      align-items: flex-end;
    }
    .add_btn {
      width: 100%;
    }
  }
  .handle_btn {
    width: 100%;
    display: flex;
    justify-content: end;
    align-items: center;
  }
}
</style>
