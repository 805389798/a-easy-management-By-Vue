<!--
* @description 
* @fileName HomeNav.vue
* @author Miaoxy
* @date 2022/07/12 14:34:18
!-->
<template>
  <div class="home_nav" ref="nav">
    <keep-alive>
      <HomeMenu></HomeMenu>
    </keep-alive>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import HomeMenu from '@/components/HomeMenu';
export default {
  name: 'HomeNav',
  data() {
    return {};
  },

  components: {
    HomeMenu,
  },

  watch: {
    status: {
      handler(newVal, oldVal) {
        if (newVal) {
          let add_num = 0;
          this.$nextTick(() => {
            let id = setInterval(() => {
              add_num += 4;
              this.$refs.nav.style.width = add_num + 'px';
              if (add_num >= 160) {
                clearInterval(id);
              }
            }, 2);
          });
        } else {
          let sub_num = 160;
          this.$nextTick(() => {
            let id = setInterval(() => {
              sub_num -= 4;
              this.$refs.nav.style.width = sub_num + 'px';
              if (sub_num <= 60) {
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
.home_nav {
  height: 100%;
  width: 60px;
  box-sizing: border-box;
  position: fixed;
  left: 20px;
  top: 20px;
}
</style>
