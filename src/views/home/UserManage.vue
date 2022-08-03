<!--
* @description 
* @fileName UserManage.vue
* @author Miaoxy
* @date 2022/07/13 14:43:39
!-->
<template>
  <!-- 用户管理 -->
  <div class="user_manage">
    <!-- 搜索区域 -->
    <div class="handle_field">
      <div class="search" style="padding-left:0;">
        <span>用户名称</span>
        <el-input clearable placeholder="请输入" v-model="searchText.userName"></el-input>
      </div>
      <div class="search">
        <span>工号</span>
        <el-input clearable placeholder="请输入" v-model="searchText.workId"></el-input>
      </div>
      <div class="search">
        <span>在线状态</span>
        <el-select clearable v-model="searchText.onlineStatus" placeholder="请选择">
          <el-option v-for="item in onlineOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="search">
        <span>手机号码</span>
        <el-input clearable placeholder="请输入" v-model="searchText.phone"></el-input>
      </div>
      <!-- 第二行 -->
      <div class="search" style="padding-left:0;">
        <span>应用类型</span>
        <el-select clearable v-model="searchText.applicationId" placeholder="请选择">
          <el-option v-for="item in applicationOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="search">
        <span>用户类型</span>
        <el-select clearable v-model="searchText.userType" placeholder="请选择">
          <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="search">
        <span>状态</span>
        <el-select clearable v-model="searchText.status" placeholder="请选择">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="search">
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

    <!-- 新增按钮 -->
    <div class="add_btn">
      <!-- 功能按钮 -->
      <el-button @click="clearSearchText"><span>重置</span></el-button>
      <el-button @click="getUserList" type="primary"><span>查询</span></el-button>
      <el-button @click="showReset" :disabled="!isSelected" type="primary">重置密码</el-button>
      <el-button @click="showAdd" type="primary"><span>新增</span></el-button>
    </div>

    <!-- 表格区域 -->
    <div class="table_field">
      <el-table
        @selection-change="changeBtnState"
        :data="tableData"
        style="width: 100%;"
        height="calc(100vh - 460px)"
        :show-overflow-tooltip="true"
        :header-cell-style="{ background: '#F0F0F0', color: '#333333' }"
      >
        <el-table-column type="selection" width="50" align="center"></el-table-column>
        <el-table-column fixed type="index" label="序号" min-width="80"></el-table-column>
        <el-table-column fixed prop="account" label="账号" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.account ? (scope.row.account.length > 10 ? scope.row.account.slice(0, 10) + '...' : scope.row.account) : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed prop="name" label="用户名称" min-width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.name ? (scope.row.name.length > 10 ? scope.row.name.slice(0, 10) + '...' : scope.row.name) : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed prop="nickName" label="用户昵称" min-width="140">
          <template slot-scope="scope">
            <span>
              {{ scope.row.nickName ? (scope.row.nickName.length > 10 ? scope.row.nickName.slice(0, 10) + '...' : scope.row.nickName) : '' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="userType" label="用户类型" min-width="140">
          <template slot-scope="scope">
            <span>
              {{ scope.row.userType ? (scope.row.userType.length > 10 ? scope.row.userType.slice(0, 10) + '...' : scope.row.userType) : '' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="workId" label="工号" min-width="180">
          <template slot-scope="scope">
            <span>
              {{ scope.row.workId ? (scope.row.workId.length > 10 ? scope.row.workId.slice(0, 10) + '...' : scope.row.workId) : '' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="departmentName" label="部门" min-width="180">
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
        <el-table-column prop="rolesName" label="角色" min-width="240">
          <template slot-scope="scope">
            <span>
              <el-tag style="margin:2px;">{{ scope.row.rolesName[0] }}</el-tag>
              <el-tag v-if="scope.row.rolesName.length > 1" style="margin:2px;">+{{ scope.row.rolesName.length - 1 }}</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="postName" label="岗位" min-width="160">
          <template slot-scope="scope">
            <span>
              {{ scope.row.postName ? (scope.row.postName.length > 10 ? scope.row.postName.slice(0, 10) + '...' : scope.row.postName) : '' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号码" min-width="140"></el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="160"></el-table-column>
        <el-table-column prop="applicationId" label="应用类型" min-width="200"></el-table-column>
        <el-table-column prop="status" label="状态" min-width="160">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status == 0 ? 'danger' : 'success'">{{ scope.row.status == 0 ? '禁用' : '启用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="onlineStatus" label="在线状态" min-width="160">
          <template slot-scope="scope">
            <el-tag :type="scope.row.onlineStatus == 0 ? 'info' : ''">{{ scope.row.onlineStatus == 0 ? '离线' : '在线' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="180"></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="240" align="center">
          <template slot-scope="scope">
            <el-button style="color:#7B80E3;" @click.native.prevent="showEdit(scope.row)" type="text">
              编辑
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

    <!-- 新增或编辑弹窗 -->
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
          <el-form-item prop="name" label="用户名称" class="form_item">
            <el-input clearable placeholder="请输入用户名称" v-model="addOrUpdateData.name"></el-input>
          </el-form-item>
          <el-form-item prop="nickName" label="用户昵称" class="form_item">
            <el-input clearable placeholder="请输入用户昵称" v-model="addOrUpdateData.nickName"></el-input>
          </el-form-item>
          <el-form-item prop="account" label="登录账号" class="form_item">
            <el-input clearable placeholder="请输入登录账号" v-model="addOrUpdateData.account"></el-input>
          </el-form-item>
          <el-form-item v-if="isAdding" prop="password" label="用户密码" class="form_item">
            <el-input clearable show-password placeholder="请输入用户密码" v-model="addOrUpdateData.password"></el-input>
          </el-form-item>
          <el-form-item prop="userType" label="用户类型" class="form_item">
            <el-select :disabled="true" clearable v-model="addOrUpdateData.userType" placeholder="请选择" style="width:100%;">
              <el-option v-for="item in userOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="workId" label="工号" class="form_item">
            <el-input clearable placeholder="请输入工号" v-model="addOrUpdateData.workId"></el-input>
          </el-form-item>
          <el-form-item prop="phone" label="手机号码" class="form_item">
            <el-input clearable placeholder="请输入手机号码" v-model="addOrUpdateData.phone"></el-input>
          </el-form-item>
          <el-form-item prop="email" label="邮箱" class="form_item">
            <el-input clearable placeholder="请输入邮箱" v-model="addOrUpdateData.email"></el-input>
          </el-form-item>
          <el-form-item prop="rolesId" label="角色" class="form_item">
            <el-select collapse-tags multiple clearable placeholder="请选择角色信息" v-model="addOrUpdateData.rolesId" style="width:100%;">
              <el-option v-for="item in rolesOptions" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="departmentId" label="所属部门" class="form_item" style="height: 80px;">
            <treeselect
              v-model="addOrUpdateData.departmentId"
              :options="departmentList"
              :normalizer="departmentNormalizer"
              placeholder="根部门"
              style="width:100%;"
            ></treeselect>
          </el-form-item>
          <el-form-item prop="postId" label="所属主岗" class="form_item">
            <treeselect
              v-model="addOrUpdateData.postId"
              :options="postList"
              :normalizer="postNormalizer"
              placeholder="根目录"
              style="width:100%;"
            ></treeselect>
          </el-form-item>
          <el-form-item prop="deputyPostIds" label="副岗" class="form_item">
            <treeselect
              :limit="3"
              :multiple="true"
              v-model="addOrUpdateData.deputyPostIds"
              :options="postList"
              :normalizer="postNormalizer"
              placeholder="根目录"
              style="width:100%;"
            ></treeselect>
          </el-form-item>
          <el-form-item prop="status" label="状态" class="form_item">
            <el-radio-group v-model="addOrUpdateData.status" style="width:100%;">
              <el-radio :label="0"><span>禁用</span></el-radio>
              <el-radio :label="1"><span>启用</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="upload">
            <el-upload
              ref="myUpload"
              action="mxy"
              :on-success="handleSuccess"
              :on-error="handleError"
              :file-list="fileList"
              accept=".jpg,.png,.jpeg"
              drag
              :limit="1"
              list-type="picture"
              :http-request="uploadImage"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="tip" slot="tip">一次只能上传一张jpg、jpeg、png格式的图片</div>
            </el-upload>
          </div>

          <el-form-item prop="remark" label="备注" class="form_item form_item_title">
            <el-input type="textarea" clearable placeholder="请输入备注" v-model="addOrUpdateData.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除弹窗 -->
    <el-dialog title="确认删除" :visible.sync="deleteDialog" width="50%" :close-on-click-modal="false" @close="cancelDelete">
      <div class="delete_dialog">
        <span class="title" style="font-size: 16px;">是否确认删除数据?</span>
        <span slot="footer" class="dialog_footer">
          <el-button @click="cancelDelete">取 消</el-button>
          <el-button type="primary" @click="confirmDelete">确 定</el-button>
        </span>
      </div>
    </el-dialog>

    <!-- 重置密码弹窗 -->
    <el-dialog title="重置密码" :visible.sync="resetDialog" width="60%" :close-on-click-modal="false" @close="cancelReset">
      <div class="reset_dialog">
        <el-form ref="resetDialog" class="form" :rules="passwordRules" :model="resetingUser">
          <el-form-item prop="password" label="新密码" class="form_item">
            <el-input clearable show-password placeholder="请输入新密码" v-model="resetingUser.password"></el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword" label="确认密码" class="form_item">
            <el-input clearable show-password placeholder="请确认密码" v-model="resetingUser.confirmPassword"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelReset">取 消</el-button>
        <el-button type="primary" @click="resetPassword">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import base from '@/network/base';
export default {
  name: 'UserManage',
  data() {
    return {
      //列表数据
      tableData: [],
      //在线状态选项
      onlineOptions: [
        {
          value: '0',
          label: '离线',
        },
        {
          value: '1',
          label: '在线',
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
      //用户选项
      userOptions: [
        {
          value: '内部用户',
          label: '内部用户',
        },
        {
          value: '供应商',
          label: '供应商',
        },
      ],
      //状态选项
      statusOptions: [
        {
          value: '0',
          label: '禁用',
        },
        {
          value: '1',
          label: '启用',
        },
      ],
      rolesOptions: [
        {
          value: '0',
          label: '0',
        },
        {
          value: '1',
          label: '1',
        },
      ],

      //弹窗数据
      //部门树形结构数据
      departmentList: [],
      //岗位树形结构数据
      postList: [],
      addOrUpdateDialog: false,
      addOrUpdateData: {
        applicationId: '',
        name: '',
        nickName: '',
        account: '',
        password: '',
        userType: '内部用户',
        workId: '',
        phone: '',
        email: '',
        rolesId: [],
        departmentId: null,
        postId: null,
        deputyPostIds: [],
        status: 1,
        //备注
        remark: '',
      },
      addOrUpdateTitle: '新增',
      isAdding: true,

      //删除弹窗数据
      curUser: {},
      deleteDialog: false,

      //重置密码弹窗数据
      resetingUser: {
        id: '',
        password: '',
        confirmPassword: '',
      },
      resetDialog: false,

      //规则
      rules: {
        applicationId: [{ required: true, message: '请选择部门', trigger: 'change' }],
        name: [{ required: true, message: '请输入用户名称', trigger: 'change' }],
        nickName: [{ required: true, message: '请输入用户昵称', trigger: 'change' }],
        account: [{ required: true, message: '请输入登录账号', trigger: 'change' }],
        password: [{ required: true, message: '请输入用户密码', trigger: 'change' }],
        userType: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
        phone: [{ required: true, message: '请输入手机号码', trigger: 'change' }],
        email: [{ required: true, message: '请输入邮箱', trigger: 'change' }],
        rolesId: [{ required: true, message: '请选择角色', trigger: 'change' }],
        departmentId: [{ required: true, message: '请选择部门', trigger: 'change' }],
        postId: [{ required: true, message: '请选择所属主岗', trigger: 'change' }],
        rolesId: [{ required: true, message: '请选择角色信息', trigger: 'change' }],
      },
      passwordRules: {
        password: [{ required: true, message: '请输入新密码', trigger: 'change' }],
        confirmPassword: [{ required: true, message: '请确认密码', trigger: 'change' }],
      },

      //分页
      currentPage: 1,
      pageSize: 10,
      totalPage: 40,

      //状态切换按钮是否可点击
      isSelected: false,
      curSelectedList: [],

      //搜索
      searchText: {
        userName: '',
        workId: '',
        onlineStatus: '',
        phone: '',

        //实际是string名称
        applicationId: '',
        userType: '',

        status: '',
        curDate: [],
      },

      //文件
      fileList: [],
      curFile: null,
      base,
    };
  },

  watch: {
    searchText: {
      handler() {
        this.$isEmpty(this.searchText) && this.getUserList();
      },
      deep: true,
    },
  },

  components: {
    Treeselect,
  },

  mounted() {
    this.getUserList();
    this.getPostInfo();
    this.getDepartmentInfo();
    this.getRoleList();
  },

  methods: {
    //获取用户列表
    getUserList() {
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
        .getUserList(data)
        .then(res => {
          this.tableData = res.data.data || [];
          this.totalPage = res.data.total;
        })
        .catch(err => {
          this.$msg(err.data);
        });
    },

    //获取角色信息列表
    getRoleList() {
      this.$API
        .getRoleTree()
        .then(res => {
          this.rolesOptions = res.data.data || [];
        })
        .catch(err => {});
    },

    //新增用户
    addUserInfo(data) {
      data.password = this.$Base64.encode(data.password);
      let form = new FormData();
      form.append('userVoString', JSON.stringify(data));
      form.append('file', this.curFile);

      this.$API
        .addUser(form)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.addOrUpdateDialog = false;
          this.getUserList();
        });
    },

    //编辑用户
    updateUserInfo(data) {
      delete data.createTime;
      delete data.modifyTime;
      let form = new FormData();
      form.append('userVoString', JSON.stringify(data));
      form.append('file', this.curFile);

      this.$API
        .updateUser(form)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.addOrUpdateDialog = false;
          this.getUserList();
        });
    },

    //删除用户
    deleteUserInfo(data) {
      this.$API
        .deleteUser(data.id)
        .then(res => {
          this.$msg(res.data);
        })
        .catch(err => {
          this.$msg(err.data);
        })
        .finally(() => {
          this.deleteDialog = false;
          this.getUserList();
        });
    },

    //获取部门信息列表
    getDepartmentInfo() {
      this.$API
        .getDepartmentTree()
        .then(res => {
          this.departmentList = res.data.data || [];
        })
        .catch(err => {
          this.$msg(err.data);
        });
    },

    //获取岗位信息列表
    getPostInfo() {
      this.$API
        .getPostTree()
        .then(res => {
          this.postList = res.data.data || [];
        })
        .catch(err => {
          this.$msg(err.data);
        });
    },

    //新增或编辑用户
    addOrUpdateUser() {
      this.$refs.addOrUpdateDialog.validate(valid => {
        return valid ? (this.isAdding ? this.addUserInfo(this.addOrUpdateData) : this.updateUserInfo(this.addOrUpdateData)) : false;
      });
    },

    //展示新增框
    showAdd() {
      this.addOrUpdateDialog = true;
      this.isAdding = true;
      this.addOrUpdateTitle = '新增';
      this.fileList = [];
    },

    //展示编辑框
    showEdit(row) {
      this.addOrUpdateDialog = true;
      this.isAdding = false;
      this.addOrUpdateTitle = '编辑';
      this.addOrUpdateData = JSON.parse(JSON.stringify(row));
      if (this.addOrUpdateData.avatar) {
        let data = {
          name: this.addOrUpdateData.imgName,
          url: this.base.current.slice(0, this.base.current.length - 4) + '8888/' + this.addOrUpdateData.avatar,
        };
        this.fileList.push(data);
      }
    },

    //修改按钮状态
    changeBtnState(row) {
      if (row.length == 1) {
        //选中一个
        this.isSelected = true;
        this.curSelectedList = [...row];
      } else {
        //没选或选不止一个
        this.isSelected = false;
      }
    },

    //弹窗框的回调
    handleClose() {
      this.addOrUpdateData = {
        applicationId: '',
        name: '',
        nickName: '',
        account: '',
        password: '',
        userType: '内部用户',
        workId: '',
        phone: '',
        email: '',
        rolesId: '',
        departmentId: null,
        postId: null,
        deputyPostIds: [],
        status: 1,
        //备注
        remark: '',
      };
      this.fileList = [];
      this.curFile = null;
      this.addOrUpdateDialog = false;
      this.$refs.addOrUpdateDialog.resetFields();
    },

    //清空搜索条件
    clearSearchText() {
      this.searchText = {};
    },

    //展示删除框
    showDelete(row) {
      this.curUser = JSON.parse(JSON.stringify(row));
      this.deleteDialog = true;
    },

    //取消删除
    cancelDelete() {
      this.deleteDialog = false;
      this.curUser = {};
      this.getUserList();
    },

    //确认删除
    confirmDelete() {
      this.deleteUserInfo(this.curUser);
    },

    //部门数据树形化
    departmentNormalizer(node) {
      return {
        id: node.id,
        label: node.departmentName,
        children: node.children,
      };
    },

    //岗位数据树形化
    postNormalizer(node) {
      return {
        id: node.id,
        label: node.postName,
        children: node.children,
      };
    },

    //取消重置密码及关闭时的回调
    cancelReset() {
      this.resetingUser = {
        password: '',
        confirmPassword: '',
        id: '',
      };
      this.resetDialog = false;
      this.$refs.resetDialog.resetFields();
      this.getUserList();
    },

    //确认重置密码
    resetPassword() {
      this.$refs.resetDialog.validate(valid => {
        return valid ? this.reset(this.resetingUser) : false;
      });
    },

    //重置密码接口
    reset(user) {
      if (user.password == user.confirmPassword) {
        let data = {
          id: user.id,
          password: this.$Base64.encode(user.password),
        };
        this.$API
          .updateUserPassword(data)
          .then(res => {
            this.resetDialog = false;
            this.$msg(res.data);
          })
          .catch(err => {
            this.$msg(err.data);
          });
      } else {
        let data = {
          msg: '两次密码输入不一致，请重新输入',
        };
        this.$msg(data);
      }
    },

    //显示重置密码弹出框
    showReset() {
      this.resetDialog = true;
      this.resetingUser.id = this.curSelectedList[0].id;
      this.resetingUser.password = '';
      this.resetingUser.confirmPassword = '';
    },

    //设置每页多少条数据
    handleSizeChange(val) {
      this.pageSize = val;
      this.getUserList();
    },

    //翻页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getUserList();
    },

    //文件上传
    uploadImage(file) {
      this.curFile = file.file;
    },

    //上传成功
    handleSuccess(res) {
      this.$msg(res.data);
    },

    //上传失败
    handleError(err) {
      this.$msg(err.data);
    },
  },
};
</script>

<style lang="less" scoped>
.user_manage {
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
    height: 50vh;
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
      .upload {
        margin: 20px 0;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .tip {
          margin-top: 10px;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
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
