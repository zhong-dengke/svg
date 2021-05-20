<template>
  <div class="topbar">
    <img class="logo-style" @click="$router.push({name:'index'})" src="../../assets/images/logo.png">
    <Select
      :value='tunnelId'
      @on-change="changeTunnel"
      class="select-project"
      v-show="showState"
    >
      <Option v-for="item in tunnels" :value="item._id" :key="item._id">{{
        item.name
      }}</Option>
    </Select>
    <img class="config-logo-style map-logo-style" src="../../assets/images/map.png">
    <span class="parameter-configuration digital-map" @click="$router.push({name:'digitalMap'})">数字地图</span>
    <img class="config-logo-style" src="../../assets/images/parameterConfiguration.png">
    <span class="parameter-configuration" @click="$router.push({name:'projectManage'})">参数配置</span>
    <img class="user-logo" src="../../assets/images/user.svg" />
    <span class="user-name" @click="$router.push({name:'login'})">admin</span>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      tunnels: [], // 隧道列表
    }
  },
  methods: {
    // 切换项目触发
    changeTunnel (id) {
      console.log('id', id)
      this.$store.commit("setTunnelId", id);
    }
  },
  computed: {
    ...mapState(["showState"]),
    ...mapState(["tunnelId"]),
  },
  mounted () {
    this.tunnels = [
      {
        name: '怀福区隧道',
        _id: 'dsds21a234545s4d4s21d545d4s'
      },
      {
        name: '留仙洞隧道',
        _id: 'hjhj2j1hj1h45h21h2j21hj2j12'
      },
      {
        name: '石芽岭隧道',
        _id: 'erer21e15r0d1r2d1r5e4r41e21'
      }
    ]
  }
}
</script>

<style lang="less" scoped>
.topbar{
  position: relative;
  width: 1920px;
  height: 62px;
  background: url('../../assets/images/topbarBG.png');
  background-size:1920px 62px;
  background-repeat:no-repeat;
  .logo-style {
    position: absolute;
    width: 90px;
    height: 25px;
    top: 5px;
    left: 20px;
    cursor: pointer;
  }
  .config-logo-style {
    position: absolute;
    width: 14px;
    height: 14px;
    top: 13px;
    right: 228px;
  }
  .map-logo-style {
    right: 375px;
  }
  .parameter-configuration {
    position: absolute;
    top: 9px;
    right: 156px;
    width: 64px;
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 22px;
    cursor: pointer;
  }
  .digital-map {
    right: 300px;
  }
  .user-logo {
    position: absolute;
    width: 28px;
    height: 28px;
    top: 5px;
    right: 88px;
  }
  .user-name {
    position: absolute;
    top: 7px;
    right: 30px;
    width: 48px;
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 22px;
  }
  .select-project {
    position: absolute;
    top: 3px;
    left: 139px;
    width: 163px;
    height: 32px;
    border-radius: 4px;
    border: 1px solid #45699C;
  }
}
</style>