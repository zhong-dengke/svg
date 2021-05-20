<template>
  <div class="projectManage">
    <div class="menu">
      导航栏
    </div>
    <router-view />
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="less" scoped>
.projectManage{
  display: flex;
  height: calc(100vh - 62px);
}
</style>