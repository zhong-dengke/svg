<template>
  <div id="app">
    <TopBar />
    <router-view/>
  </div>
</template>
<script>
import TopBar from "./components/TopBar/TopBar";
export default {
  name: "App",
  components: {
    TopBar
  }
};
</script>
<style>
#app {
  width: 1920px;
  height: 1080px;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: url('../src/assets/images/systemBG.png');
  background-size:1920px 1080px;
  background-repeat:no-repeat;
  background-color: #081D39;
}

#nav {
  padding: 30px;
}
</style>
