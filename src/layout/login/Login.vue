<!--
* @description 
* @fileName Login.vue
* @author Miaoxy
* @date 2022/07/12 09:19:26
!-->
<template>
  <div class="login">
    <LoginCard></LoginCard>
  </div>
</template>

<script>
import LoginCard from '@/views/login/LoginCard';
import { clearAllIntervals } from '@/utils/clearAllIntervals';
export default {
  name: 'Login',
  data() {
    return {};
  },

  components: {
    LoginCard,
  },

  computed: {},

  created() {},

  mounted() {
    clearAllIntervals();
    this.closeAllModal();
  },

  methods: {
    //删除所有遮罩层
    closeAllModal() {
      let modalList = document.getElementsByClassName('v-modal');

      for (let item of modalList) {
        let parent = item.parentElement;
        //删除节点
        parent.removeChild(item);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background: url(/img/login/bg-login.png) no-repeat center / cover;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
