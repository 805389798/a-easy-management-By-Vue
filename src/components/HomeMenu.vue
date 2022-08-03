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
      <div class="menu_big_list">
        <el-button :class="{ btn_active: curPath == item.path }" v-for="item of list" :key="item.name" @click="jumpPage(item.path)">
          <i :class="item.meta.icon" style="font-size:18px;margin-right: 8px;"></i>
          <span>{{ item.meta.title }}</span>
        </el-button>
      </div>

      <div class="handle_div">
        <el-button @click="changeMenuStatus" style="color:white;padding-left: 0;">
          <i class="el-icon-s-fold" style="font-size:20px;"></i>
        </el-button>
      </div>
    </div>

    <!-- 小 -->
    <div class="menu" v-show="!this.GET_MENU_STATUS">
      <el-button class="title_img" round @click.stop="jumpPage()"><img src="/img/home/home_logo_small.png" /></el-button>
      <el-popover
        popper-class="sub_menu"
        v-for="item of list"
        :key="item.name"
        placement="right"
        v-model="isVisible"
        trigger="hover"
        :visible-arrow="false"
      >
        <el-button v-for="item of list" :key="item.name" @click.stop="jumpPage(item.path)">
          <i :class="item.meta.icon" style="color:white;font-size:20px;"></i>
          <span class="name">{{ item.name }}</span>
        </el-button>

        <!-- 外部按钮 -->
        <el-button :class="{ btn_active: curPath == item.path }" @click.stop="jumpPage(item.path)" slot="reference" @hover="changeVisible(item)">
          <i :class="item.meta.icon" style="color:white;font-size:20px;"></i>
        </el-button>
      </el-popover>

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
      list: [],
      visible: '',
      curItem: {},
      curPath: '',
    };
  },

  components: {},

  computed: {
    ...mapGetters('menu', ['GET_MENU_STATUS', 'GET_MENU_LIST']),
    isVisible: {
      get() {
        return this.visible == this.curItem.path;
      },
      set() {},
    },
  },

  created() {
    this.getNavList();
  },

  mounted() {},

  methods: {
    ...mapMutations('menu', ['UPDATE_MENU_STATUS']),
    getNavList() {
      this.list = this.GET_MENU_LIST.filter(item => {
        return !item.meta.hidden;
      });
    },
    //改变全局变量，控制侧边栏展开与收缩
    changeMenuStatus() {
      this.UPDATE_MENU_STATUS(!this.GET_MENU_STATUS);
    },
    //路由跳转
    jumpPage(path = '/home/welcome') {
      this.curPath = path;
      this.$router.push(path);
    },
    //切换是否可见
    changeVisible(item) {
      this.curItem = item;
      this.visible = this.curItem.path;
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
  .menu_big_list {
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    background-color: #7b80e3;
    .btn_active {
      background-color: #656acb !important;
    }
    &::-webkit-scrollbar {
      z-index: 100;
      width: 6px;
      /*滚动条宽度*/
      height: 8px;
      /*滚动条高度*/
      background-color: #7b80e3;
    }

    /*定义滑块 内阴影+圆角*/
    &::-webkit-scrollbar-thumb {
      z-index: 100;
      box-shadow: inset 0 0 0px #7b80e3;
      -webkit-box-shadow: inset 0 0 0px #7b80e3;
      background-color: #656acb;
      /*滚动条的背景颜色*/
      border-radius: 20px;
    }
  }
  /deep/ .el-button {
    background-color: #7b80e3;
    padding: 0;
    border: 0;
    margin: 0;
    margin-bottom: 5px;
    margin-top: 5px;
    border-radius: 10px;
    width: 80%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      display: flex;
      justify-content: center;
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
  .btn_active {
    background-color: #656acb !important;
  }
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
