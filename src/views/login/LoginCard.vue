<!--
* @description 
* @fileName LoginCard.vue
* @author Miaoxy
* @date 2022/07/12 09:36:04
!-->
<template>
  <div class="login_card">
    <div class="card_img">
      <img class="title_login" src="/img/login/title-login.png" />
      <img class="QR_login" src="/img/login/QR-login.png" />
      <img class="card_login" src="/img/login/card-login.png" />
    </div>
    <div class="card_handle">
      <img class="logo" src="/img/login/logo.png" />
      <div class="handle_field">
        <el-form :rules="rules" :model="user" ref="loginForm">
          <el-form-item prop="username">
            <el-input clearable placeholder="账号" v-model="user.username">
              <template slot="prefix">
                <img class="prefix_image" src="/img/login/Profile.png" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input clearable placeholder="密码" v-model="user.password" show-password>
              <template slot="prefix">
                <img class="prefix_image" src="/img/login/Lock.png" />
              </template>
            </el-input>
          </el-form-item>
        </el-form>

        <div class="mailbox">
          <el-input clearable placeholder="验证码" v-model="code" @keyup.enter.native="login">
            <template slot="prefix">
              <img class="prefix_image" src="/img/login/a-ShieldDone.png" />
            </template>
          </el-input>
          <el-button
            class="img"
            @click="getCaptcha"
            style="
            border:0;
            margin:0;
            padding:0;
            height: 42px;
            margin-left: 16px;
            width: 101px;"
          >
            <el-image :src="img"></el-image>
          </el-button>
        </div>

        <div class="save_password">
          <el-checkbox v-model="checked">记住密码</el-checkbox>
        </div>
        <el-button class="login_btn" @click="login">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginCard',
  data() {
    return {
      checked: false,
      user: {
        username: '',
        password: '',
      },
      //验证码
      code: '',
      //验证码的uuid
      uuid: '',
      img: '',
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'change' }],
        password: [{ required: true, message: '请输入密码', trigger: 'change' }],
      },
    };
  },

  components: {},

  computed: {},

  created() {},

  mounted() {
    this.getCaptcha();
    this.getUserInfo();
  },

  methods: {
    //获取验证码
    getCaptcha() {
      this.$API
        .captcha()
        .then(res => {
          this.img = 'data:image/jpg;base64,' + res.data.img;
          this.uuid = res.data.uuid;
        })
        .catch(err => {
          console.log(err.data);
        });
    },

    // 登录
    login() {
      this.$refs.loginForm.validate(valid => {
        let data = {
          code: this.code,
          uuid: this.uuid,
        };
        Object.assign(data, this.user);
        return valid ? this.loginPost(data) : false;
      });
    },

    //登录接口
    loginPost(data) {
      this.$API
        .login(data)
        .then(res => {
          this.setUserInfo();
          this.setToken(res.data.token);
          this.$msg(res.data);
          this.$router.push('/home');
        })
        .catch(err => {
          this.$msg(err.data);
        });
    },

    //验证是否填入用户名和密码
    checkUserInfo() {
      return this.user.username && this.user.password ? true : false;
    },

    //保存token
    setToken(token = '') {
      localStorage.setItem('token', token);
    },

    //保存用户名和密码
    setUserInfo() {
      this.checkUserInfo() ? localStorage.setItem('user_info', JSON.stringify(this.user)) : '';
    },

    //获取用户名和密码
    getUserInfo() {
      let user = JSON.parse(localStorage.getItem('user_info'));
      this.user = user || { username: '', password: '' };
      user ? (this.checked = true) : (this.checked = false);
    },
  },
};
</script>

<style lang="less" scoped>
.login_card {
  width: 850px;
  height: 500px;
  display: flex;
  justify-content: center;
  box-shadow: 0px 1px 8px 0px rgba(123, 128, 227, 0.2);
  .card_img {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 350px;
    height: 500px;
    background: #7b80e3;
    box-sizing: border-box;
    .title_login {
      width: 140px;
      height: 32px;
      margin-top: 141px;
      margin-bottom: 60px;
    }
    .QR_login {
      width: 90px;
      height: 90px;
      margin-bottom: 2px;
    }
    .card_login {
      position: relative;
      float: left;
      width: 196px;
      height: 199px;
      margin-right: 118px;
    }
  }
  .card_handle {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 500px;
    height: 500px;
    background: #ffffff;
    .logo {
      width: 99px;
      height: 42px;
      margin-top: 63px;
    }
    .handle_field {
      width: 350px;
      height: 395px;
      padding-top: 38px;
      box-sizing: border-box;
      .el-form-item {
        margin-bottom: 30px;
        .el-input {
          height: 42px;
          /deep/ .el-input__prefix {
            left: 0;
            height: 100%;
            width: 36px;
            display: flex;
            justify-content: end;
            align-items: center;
          }
          /deep/.el-input__inner {
            font-weight: 500;
            color: #9d9eb2;
            padding-left: 48px;
            padding-right: 0px;
          }
        }
      }

      .mailbox {
        height: 42px;
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        .el-input {
          width: calc(100% - 117px);
          height: 42px;
          margin-bottom: 0;
          /deep/ .el-input__prefix {
            left: 0;
            height: 100%;
            width: 36px;
            display: flex;
            justify-content: end;
            align-items: center;
          }
          /deep/.el-input__inner {
            font-weight: 500;
            padding-left: 48px;
            padding-right: 0px;
          }
        }
        .img {
          height: 42px;
          margin-left: 16px;
          width: 101px;
        }
      }
      .save_password {
        margin-bottom: 24px;
        /deep/ .el-checkbox__label {
          color: #656675;
        }
      }
      .login_btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 42px;
        background-color: #7b80e3;
        font-weight: 500;
        line-height: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        color: #ffffff;
        letter-spacing: 10px;
      }
    }
  }
}
</style>
