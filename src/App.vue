<template>
  <div id="app">
    <Header />
    <MainView />
  </div>
</template>

<script>
import Header from "@/components/Header/index";
import MainView from "@/components/MainView";

export default {
  name: "App",
  components: {
    Header,
    MainView,
  },
};
</script>

<style lang="less">
#app {
  .clearfix::before,
  .clearfix::after {
    content: "";
    display: table;
  }
  img {
    vertical-align: middle;
  }

  .clearfix::after {
    clear: both;
  }

  .container {
    // background-color: #f1f3f4;
    margin: 0px auto 0px auto;
    width: 960px;
    padding: 20px 40px 20px 40px;
    word-spacing: 1.5px;
    line-height: 25px;
  }
}
</style>
