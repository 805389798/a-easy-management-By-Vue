<!--
* @description 
* @fileName Home.vue
* @author Miaoxy
* @date 2022/07/12 14:24:49
!-->
<template>
  <div class="home">
    <keep-alive>
      <HomeHeader class="home_header"></HomeHeader>
    </keep-alive>
    <section class="home_main">
      <HomeNav></HomeNav>
      <div class="home_body" ref="home_body">
        <el-card>
          <transition
            appear
            mode="out-in"
            name="fade animate__animated "
            enter-active-class="animate__fadeInRight"
            leave-active-class="animate__fadeOutRight"
          >
            <router-view></router-view>
          </transition>
        </el-card>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import HomeHeader from '@/layout/home/HomeHeader';
import HomeNav from '@/layout/home/HomeNav';
export default {
  name: 'Home',
  data() {
    return {};
  },

  components: {
    HomeHeader,
    HomeNav,
  },

  watch: {
    //实现侧边栏变化
    status: {
      handler(newVal) {
        if (newVal) {
          let add_num = 0;
          this.$nextTick(() => {
            let id = setInterval(() => {
              add_num += 4;
              this.$refs.home_body.style.paddingLeft = add_num + 'px';
              if (add_num >= 120) {
                clearInterval(id);
              }
            }, 2);
          });
        } else {
          let sub_num = 120;
          this.$nextTick(() => {
            let id = setInterval(() => {
              sub_num -= 4;
              this.$refs.home_body.style.paddingLeft = sub_num + 'px';
              if (sub_num <= 20) {
                clearInterval(id);
              }
            }, 2);
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
  },

  created() {},

  mounted() {},

  methods: {},
};
</script>

<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  background-color: #fafafa;
  .home_header {
    width: 100%;
    height: 68px;
    background: #ffffff;
    border-radius: 0px 0px 12px 12px;
  }
  .home_main {
    width: 100%;
    height: calc(100% - 68px);
    display: flex;
    justify-content: end;
    align-items: center;
    .home_body {
      width: calc(100% - 80px);
      height: 100%;
      padding: 20px;
      box-sizing: border-box;
      .el-card {
        width: 100%;
        height: 100%;
      }
      --animate-duration: 0.5s;
      --animate-delay: 0s;
    }
  }
}
</style>
