<template>
  <div class="login">
    <div class="login-list-post"  @keyup.enter="clickLogin">
      <div class="user-name">
        <input
          type="text"
          placeholder="请输入用户名"
          v-model="username"
          @input="changetxt"
        />
        <Icon type="md-person" />
      </div>
      <div class="user-password">
        <input
          type="password"
          placeholder="请输入密码"
          v-model="userpasd"
          @input="changetxt"
        />
        <Icon type="md-lock" />
      </div>
      <p>{{ ermsg }}</p>
      <button :class="{ changeColor: colorStates }" @click="clickLogin()">
        登录
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      userpasd: "",
      ermsg: "",
      name: "szdt",
      psd: "szdt2021",
      colorStates: false
    };
  },
  methods: {
    // 点击登录
    clickLogin() {
      if (this.username && this.userpasd) {
        if (this.username === this.name && this.userpasd === this.psd) {
          // 保存用户数据
          this.$UserData.saveUserData(this.username, this.userpasd);
          // 页面跳转
          this.$router.push("/index");
        } else {
          this.ermsg = "密码或用户名错误";
        }
      } else {
        this.ermsg = "密码或用户名不能为空";
      }
    },
    changetxt() {
      this.ermsg = "";
      this.colorStates = this.username.length && this.userpasd.length;
    },
  }
};
</script>

<style lang="less" scoped>
.login {
  width: 100%;
  height: calc(100vh - 62px);
  display: flex;
  align-items: center;
  justify-content: center;
  .login-list-post {
    height: 400px;
    position: relative;
    input {
      width: 332px;
      height: 32px;
      line-height: 32px;
      border-radius: 2px;
      border: 1px solid #a1c3ff;
      background: none;
      margin-top: 30px;
      margin-left: 8px;
      outline: none;
      cursor: pointer;
      padding-left: 45px;
      color: #fff;
      font-size: 16px;
    }
    input::-webkit-input-placeholder {
      font-size: 16px;
      font-weight: 400;
      line-height: 32px;
      color: rgba(255, 255, 255, 0.3);
    }
    .user-name,
    .user-password {
      position: relative;
      i {
        position: absolute;
        top: 37px;
        left: 20px;
        font-size: 18px;
        color: #a1c3ff;
      }
    }
    p {
      font-size: 16px;
      font-weight: 400;
      color: #e8575a;
      line-height: 22px;
      padding-left: 8px;
      margin-top: 14px;
    }
    button {
      width: 332px;
      height: 32px;
      background: rgba(154, 154, 154, 0.1);
      border-radius: 2px;
      border: 1px solid rgba(184, 184, 184, 0.5);
      color: rgba(255, 255, 255, 0.5);
      cursor: pointer;
      outline: none;
      position: absolute;
      top: 220px;
      left: 5px;
    }
    .changeColor {
      background: rgba(67, 176, 251, 0.5);
      color: #fff;
    }
    .login-list-post-logo {
      width: 63px;
      height: 59px;
      position: absolute;
      bottom: 20px;
      left: 0;
      right: 0;
      margin: auto;
      // left: 1.4rem;
    }
  }
}
</style>