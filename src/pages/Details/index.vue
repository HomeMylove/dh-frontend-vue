<template>
  <div class="row">
    <h1>{{ authorInfo.authorName }}</h1>

    <div class="introduction">
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">{{ $t('message.introduction').toUpperCase() }}</div>
        </el-col>
      </el-row>

      <div class="show">

        <template>
          <el-card>
            <!-- 作家信息内容 -->
            <el-row>
              <!-- 左侧列，信息名 -->
              <el-col :span="6">作家名：</el-col>
              <!-- 右侧列，数据 -->
              <el-col :span="18"><b>{{ authorInfo.kanjiName }}</b></el-col>
            </el-row>
            <el-row>
              <el-col :span="6">假名：</el-col>
              <el-col :span="18">{{ authorInfo.kanaName }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">罗马字：</el-col>
              <el-col :span="18">{{ authorInfo.romanName }}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">关于：</el-col>
              <el-col :span="18">{{ authorInfo.about }}</el-col>
            </el-row>
          </el-card>
        </template>

      </div>
    </div>

    <div class="articles">
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark">{{ $t('message.mainWorks').toUpperCase() }}</div>
        </el-col>
      </el-row>

      <template>
        <el-table :data="articles" stripe :style="{ width: '60%', 'margin-left': '20%' }">
          <el-table-column type="index" align="center" :label="$t('message.number')" width="180">
          </el-table-column>
          <el-table-column prop="" align="center" :label="$t('message.workName')" width="width">
            <template slot-scope="{row}">
              <router-link :to="`/read/?articleId=${row.id}`" :style="{ 'text-decoration': 'none' }">
                {{ row.title }}</router-link>
            </template>
          </el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "Deatil",

  mounted() {
    this.$store.dispatch("details/getAuthorInfo", this.$route.query.authorId);
  },

  computed: {
    ...mapState("details", ["authorInfo"]),
    ...mapGetters("details", ["articles"]),
  },
};
</script>

<style lang="less" scoped>
.row {
  margin-top: -80px;

  //   background-color: #f00;
  h1 {
    display: block;
    text-align: center;
    margin-block-start: 1.33em;
    margin-block-end: 1.33em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }

  .grid-content {
    font-size: 20px;
    height: 40px;
    line-height: 40px;
    color: white;
    text-align: center;
    border-radius: 4px;
    min-height: 36px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .introduction {
    .show {
      margin-top: 30px;
      margin-left: 20%;
      min-height: 100px;
      width: 60%;
      //   background-color: #0f0;
      color: black;
    }
  }

  .articles {
    margin-top: 30px;

    .show {
      margin-top: 30px;
      margin-left: 20%;
      width: 60%;
      //   background-color: #0f0;
      color: red;
    }
  }
}
</style>