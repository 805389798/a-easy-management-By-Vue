<!--
* @description 
* @fileName HomeHeader.vue
* @author Miaoxy
* @date 2022/07/12 14:33:56
!-->
<template>
  <div class="home_header">
    <div class="user_field" ref="user_field">
      <el-breadcrumb>
        <transition-group
          appear
          mode="out-in"
          name="fade animate__animated "
          enter-active-class="animate__fadeInRight"
          leave-active-class="animate__fadeOutRight"
        >
          <el-breadcrumb-item :to="item.path" v-for="item in list" :key="item.path">{{ item.meta.title }}</el-breadcrumb-item>
        </transition-group>
      </el-breadcrumb>

      <div class="user_avatar">
        <el-avatar :src="detailInfo.avatar" fit="contain"></el-avatar>
        <span class="name">
          {{ detailInfo.nickName ? (detailInfo.nickName.length > 10 ? detailInfo.nickName.slice(0, 10) + '...' : detailInfo.nickName) : 'user' }}
        </span>
        <span class="post">
          {{ detailInfo.userType ? (detailInfo.userType.length > 10 ? detailInfo.userType.slice(0, 10) + '...' : detailInfo.userType) : '未知用户' }}
        </span>
        <el-popover class="list" placement="bottom" width="150" trigger="click">
          <div class="btn_list">
            <el-button @click="cancellation">退出登录</el-button>
          </div>
          <el-button class="trigger_btn" slot="reference">
            <i class="el-icon-arrow-down"></i>
          </el-button>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { clearAllIntervals } from '@/utils/clearAllIntervals';
import base from '@/network/base';
export default {
  name: 'HomeHeader',
  data() {
    return {
      detailInfo: {},
      userName: 'Jones',
      post: '职位',
      base,
    };
  },

  components: {},

  watch: {
    //监听侧边栏是否被点击，并实现展开功能
    status: {
      handler(newVal) {
        if (newVal) {
          let add_num = 80;
          this.$nextTick(() => {
            let id = setInterval(() => {
              add_num += 5;
              this.$refs.user_field.style.width = `calc(100% - ${add_num}px)`;
              this.$refs.user_field.style.paddingLeft = add_num + 'px';
              if (add_num >= 200) {
                clearInterval(id);
              }
            }, 5);
          });
        } else {
          let sub_num = 200;
          this.$nextTick(() => {
            let id = setInterval(() => {
              sub_num -= 5;
              this.$refs.user_field.style.width = `calc(100% - ${sub_num}px)`;
              this.$refs.user_field.style.paddingLeft = sub_num + 'px';
              if (sub_num <= 100) {
                clearInterval(id);
              }
            }, 5);
          });
        }
      },
    },
  },

  computed: {
    ...mapGetters('menu', ['GET_MENU_STATUS']),
    //动态返回侧边栏是否被点击
    status() {
      return this.GET_MENU_STATUS;
    },
    //返回匹配的路由列表
    list() {
      return this.$route.matched;
    },
  },

  created() {},

  mounted() {
    this.getUserInfo();
  },

  methods: {
    ...mapMutations('menu', ['UPDATE_MENU_STATUS']),
    //注销登录
    cancellation() {
      this.$API
        .logout()
        .then(res => {
          this.UPDATE_MENU_STATUS(false);
          clearAllIntervals();
          localStorage.removeItem('token');
          this.$router.push('/login');
        })
        .catch(err => {
          this.$msg(err.data);
        });
    },

    //获取用户详细信息
    getUserInfo() {
      this.detailInfo = {};
      this.$API
        .getUserInfo()
        .then(res => {
          this.detailInfo = res.data.data || {};
          if (this.detailInfo.avatar) {
            this.detailInfo.avatar = this.base.current.slice(0, this.base.current.length - 4) + '8888/' + this.detailInfo.avatar;
          } else {
            this.detailInfo.avatar = '/img/home/user-avatar.png';
          }
        })
        .catch(err => {
          this.$msg(err.data);
        });
    },
  },
};
</script>

<style lang="less" scoped>
.home_header {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: end;
  align-items: center;
  .header_seat {
    display: inline-block;
    width: 100px;
    height: 100%;
  }
  .user_field {
    display: flex;
    justify-content: start;
    align-items: center;
    width: calc(100% - 100px);
    height: 100%;
    --animate-duration: 0.5s;
    --animate-delay: 0s;
    .user_avatar {
      display: flex;
      justify-content: end;
      align-items: center;
      flex: 1;
      .el-avatar {
        background: #ffffff;
        margin-right: 12px;
        height: 40px;
        width: 40px;
        img {
          height: 40px;
          width: 40px;
        }
      }
      .name {
        color: #2c2d49;
      }
      .post {
        background-color: #656675;
        color: #ffffff;
        font-size: 12px;
        border-radius: 4px;
        margin-left: 14px;
        margin-right: 14px;
        padding: 2px 5px;
        height: 20px;
        line-height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .list {
        margin-right: 20px;
        .trigger_btn {
          border: 0;
          width: 20px;
          height: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
.btn_list {
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: column;
  /deep/ .el-button {
    width: 100%;
    border: 0;
    margin: 0;
    padding: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
