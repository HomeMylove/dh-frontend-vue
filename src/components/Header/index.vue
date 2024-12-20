<template>
  <div class="container header">
    <header>
      <div class="middle clearfix">
        <!-- 左边标题 -->
        <span class="title" @click="$router.push({ path: 'home' })">{{ $t('message.mainName') }}</span>

        <!-- 右边导航栏 -->
        <span class="nav-container">
          <el-menu
              :default-active="defaultActive"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect"
              text-color="#316cf4"
              :router="true"
              active-text-color="#ffd04b">
          <el-menu-item index="/home">
            <template slot="title">
              <i class="nav-icon iconfont icon-shouye"></i>
              <span class="nav-name">首页</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/search">
            <template slot="title">
              <i class="nav-icon iconfont icon-sousuo"></i>

              <span class="nav-name">搜索</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/upload">
            <template slot="title">
              <i class="nav-icon iconfont icon-yunshangchuan"></i>

              <span class="nav-name">上传</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/history">
            <template slot="title">
              <i class="nav-icon iconfont icon-lishixiao"></i>

              <span class="nav-name">历史</span>
            </template>
          </el-menu-item>
          <el-menu-item :index="`/space/${spaceId}`">
            <template slot="title">
              <i class="nav-icon iconfont icon-wode"></i>
              <span class="nav-name">空间</span>
            </template>
          </el-menu-item>
          <el-menu-item index="/external">
            <template slot="title">
              <i class="nav-icon iconfont icon-github"></i>

              <span class="nav-name">Github</span>
            </template>
          </el-menu-item>
        </el-menu>
        </span>
      </div>
    </header>
  </div>
</template>

<script>

export default {
  name: "Header",
  data() {
    return {
      langs: [
        {name: 'cn', local: '中文'},
        {name: 'en', local: 'English'},
        {name: 'jp', local: '日本語'}
      ],
      lang: '中文',
      spaceId: null,
      defaultActive: 'home'
    };
  },
  mounted() {
    this.spaceId = localStorage.getItem("id")
    // 绑定方法
    // 登陆之后 或是 注销之后，更改 id
    this.$bus.$on('setSpaceId', (spaceId) => {
      this.spaceId = spaceId
    })
  },
  beforeDestroy() {
    this.$bus.$off('setSpaceId')
  },
  methods: {
    handleSelect(key, keyPath) {
      // console.log('key:',key,"path:",keyPath)
    },
    changeLang(lang) {
      this.$i18n.locale = lang.name
      this.lang = lang.local
    },
  },
};
</script>

<style lang="less" scoped>
header {
  width: 960px;
  height: 74px;
  // background-color: red;
  margin: 0px 0px 24px;
  padding: 16px 0;

  .middle {
    width: 100%;
    position: relative;
    // padding-top: 10px;
    height: 60px;
    // line-height: 60px;
    border-bottom: 1px solid #f1f2f4;

    .title {
      position: absolute;
      top: 10px;
      color: #212529;
      font: 24px -apple-system;
      cursor: pointer;
    }

    .nav-container {
      float: right;

      .nav-name, .nav-icon {
        font-size: 18px;
      }

      .nav-name {
        color: #332829;
      }

      .nav-icon {
        color: #18191c;
        margin-right: 10px;
      }
    }

  }
}
</style>
