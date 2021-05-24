<template>
  <div class="projectManage">
    <div class="projectManage-menu">
      <Menu :active-name="changePath" style="width: 100%">
        <MenuItem name="baseCfg" to="/projectManage/baseCfg">
          <img src="../../assets/images/baseCfgIcon.png" alt="" />
          基础配置
        </MenuItem>
        <MenuItem name="sectionParameter" to="/projectManage/sectionParameter">
          <img src="../../assets/images/sectionParameterIcon.png" alt="" />
          区段参数
        </MenuItem>
        <MenuItem name="singleValue" to="/projectManage/singleValue">
          <img src="../../assets/images/singleValueIcon.png" alt="" />
          单值参数
        </MenuItem>
        <MenuItem name="timeCost" to="/projectManage/timeCost">
          <img src="../../assets/images/timeCostIcon.png" alt="" />
          工期造价参数
        </MenuItem>
      </Menu>
    </div>
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  data() {
    return {
      changePath: "baseCfg"
    };
  },
  mounted() {
    this.changePath = this.$route.name;
  }
};
</script>

<style lang="less" scoped>
.projectManage {
  display: flex;
  height: calc(100vh - 62px);
  padding: 10px;
  .projectManage-menu {
    width: 180px;
    height: 100%;
    border: 1px solid #83b6ff;
    box-shadow: inset 0px 0px 15px 10px rgba(131, 182, 255, 0.2);
    padding-top: 20px;
    margin-right: 10px;
    a.ivu-menu-item {
      display: flex;
      color: #83b6ff;
      img {
        margin-right: 10px;
      }
    }
  }
}
</style>
<style lang="less">
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  background: linear-gradient(
    90deg,
    rgba(131, 182, 255, 0.5) 0%,
    rgba(131, 182, 255, 0) 100%
  );
  color: #83b6ff;
}
.ivu-menu-vertical.ivu-menu-light {
  background: none;
}
.ivu-menu-vertical.ivu-menu-light::after,
.ivu-menu-light.ivu-menu-vertical
  .ivu-menu-item-active:not(.ivu-menu-submenu):after {
  display: none;
}
</style>