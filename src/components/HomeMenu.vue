<!--
* @description 
* @fileName HomeMenu.vue
* @author Miaoxy
* @date 2022/07/12 16:20:38
!-->
<template>
  <div>
    <!-- 大 -->
    <div class="menu_big" v-show="this.GET_MENU_STATUS">
      <el-button class="title_img" @click="jumpPage()"><img src="/img/home/home_logo_big.png" /></el-button>
      <el-button v-for="item of list" :key="item.name" @click="jumpPage(item.path)">
        <i :class="item.url" style="font-size:18px;margin-right: 8px;"></i>
        <span>{{ item.name }}</span>
      </el-button>
      <div class="handle_div">
        <el-button @click="changeMenuStatus" style="color:white;padding-left: 0;">
          <i class="el-icon-s-fold" style="font-size:20px;"></i>
        </el-button>
      </div>
    </div>
    <!-- 小 -->
    <div class="menu" v-show="!this.GET_MENU_STATUS">
      <el-button class="title_img" round @click.stop="jumpPage()"><img src="/img/home/home_logo_small.png" /></el-button>
      <el-button v-for="item of list" :key="item.name" @click.stop="jumpPage(item.path)">
        <i :class="item.url" style="color:white;font-size:20px;"></i>
      </el-button>
      <div class="handle_div">
        <el-button @click="changeMenuStatus" style="color:white;">
          <i class="el-icon-s-unfold" style="font-size:20px;"></i>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'HomeMenu',
  data() {
    return {
      list: [
        {
          url: 'el-icon-cloudy-and-sunny',
          name: '部门管理',
          path: '/home/departmentManage',
        },
        {
          url: 'el-icon-hot-water',
          name: '岗位管理',
          path: '/home/postManage',
        },
        {
          url: 'el-icon-user',
          name: '用户管理',
          path: '/home/userManage',
        },

        {
          url: 'el-icon-apple',
          name: '角色管理',
          path: '/home/roleManage',
        },
        {
          url: 'el-icon-menu',
          name: '菜单管理',
          path: '/home/menuManage',
        },
        {
          url: 'el-icon-pear',
          name: '字典管理',
          path: '/home/dictionaryManage',
        },
      ],
    };
  },

  components: {},

  computed: {
    ...mapGetters('menu', ['GET_MENU_STATUS']),
  },

  created() {},

  mounted() {},

  methods: {
    ...mapMutations('menu', ['UPDATE_MENU_STATUS']),
    //改变全局变量，控制侧边栏展开与收缩
    changeMenuStatus() {
      this.UPDATE_MENU_STATUS(!this.GET_MENU_STATUS);
    },
    //路由跳转
    jumpPage(path = '/home/welcome') {
      this.$router.push(path);
    },
  },
};
</script>

<style lang="less" scoped>
.menu_big {
  width: 100%;
  height: calc(100vh - 40px);
  background-color: #7b80e3;
  box-shadow: 0px 0px 12px 0px rgba(123, 128, 227, 0.4), 0px 0px 12px 0px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: column;
  /deep/ .el-button {
    padding: 0;
    background-color: #7b80e3;
    border: 0;
    margin: 0;
    margin-bottom: 5px;
    margin-top: 5px;
    padding-left: 15px;
    border-radius: 10px;
    width: 80%;
    height: 40px;
    display: flex;
    justify-content: start;
    align-items: center;
    &:active {
      background-color: #656acb;
    }
    span {
      display: flex;
      justify-content: start;
      align-items: center;
      color: white;
    }
  }
  /deep/.title_img {
    padding: 0;
    background-color: #656acb;
    border: 0;
    margin: 0;
    margin-bottom: 10px;
    margin-top: 15px;
    height: 40px;
    span {
      display: flex;
      justify-content: start;
      align-items: center;
      color: white;
      img {
        padding-left: 0;
        width: 100%;
      }
    }
  }
  .handle_div {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex: 1;
    width: 100%;
    /deep/ .el-button {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80%;
    }
  }
}
.menu {
  width: 100%;
  height: calc(100vh - 40px);
  background-color: #7b80e3;
  box-shadow: 0px 0px 12px 0px rgba(123, 128, 227, 0.4), 0px 0px 12px 0px rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  display: flex;
  justify-content: start;
  align-items: center;
  flex-direction: column;
  /deep/ .el-button {
    background-color: #7b80e3;
    border: 0;
    margin: 0;
    margin-bottom: 5px;
    margin-top: 5px;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:active {
      background-color: #656acb;
    }
    img {
      width: 60px;
      height: 60px;
    }
  }
  /deep/.title_img {
    padding: 0;
    background-color: #656acb;
    border: 0;
    margin: 0;
    margin-bottom: 10px;
    margin-top: 15px;
    height: 40px;
  }
  .handle_div {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    flex: 1;
  }
}
</style>
