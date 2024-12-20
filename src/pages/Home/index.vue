<template>
  <div class="row">
    <h4>{{ $t("message.welcome") }}</h4>
    <button class="btn btn-info" @click="$router.push({ path: '/search' })">
      <span style="color: white">{{ $t("message.click") }}</span> &nbsp;{{
        $t("message.search")
      }}
    </button>

    <el-container>
      <el-header>{{ $t("message.latest") }}</el-header>
      <el-main class="clearfix">
        <el-table :data="newArticle" style="width: 100%" class="list-contain">
          <el-table-column label="书名">
            <<template slot-scope="{ row }">
              <router-link :to="`/read/?articleId=${row.id}`" :style="{ 'text-decoration': 'none' }">{{ row.title
              }}</router-link>
              </template>
          </el-table-column>
          <el-table-column label="作者" prop="">
            <template slot-scope="{ row }">
              <router-link :to="`/details/?authorId=${row.author.id}`" :style="{ 'text-decoration': 'none' }">{{
                row.author.name }}</router-link>
            </template>
          </el-table-column>
          <el-table-column label="上传者" prop="">
            <template slot-scope="{ row }">
              <router-link :to="`/space/${row.creator.id}`" style="text-decoration: none;">
                  {{ row.creator.name }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="上传时间" prop="createTime">
          </el-table-column>
        </el-table>
      </el-main>

      <el-header>{{ $t("message.recommend") }}</el-header>
      <el-main class="clearfix">
        <el-card class="box-card author-card">
          <div slot="header" class="clearfix">
            <span>热门作家</span>
          </div>
          <el-table :data="popularity.authors" :show-header="false" style="width: 100%"
            class="popularity-table"><el-table-column type="index"></el-table-column>
            <el-table-column prop="">
              <template slot-scope="scope">
                <router-link :to="`/details/?authorId=${scope.row.id}`" :style="{ 'text-decoration': 'none' }">
                  <div :class="{ 'rank-three': scope.$index < 3 }">
                    {{ scope.row.name }}
                  </div>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card class="box-card article-card">
          <div slot="header" class="clearfix">
            <span>热门作品</span>
          </div>
          <el-table :data="popularity.articles" :show-header="false" style="width: 100%">
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="">
              <template slot-scope="scope">
                <router-link :to="`/read/?articleId=${scope.row.id}`" :style="{ 'text-decoration': 'none' }">
                  <div :class="{ 'rank-three': scope.$index < 3 }">
                    {{ scope.row.name }}
                  </div>
                </router-link>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-main>
    </el-container>

    <!-- 展示区 -->
    <!-- <div class="subrow clearfix"> -->

    <!-- </div> -->
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Home",
  data() {
    return {

    };
  },
  mounted() {
    this.$store.dispatch("home/getPopularity");

    this.$store.dispatch("home/getNewArticle");
  },
  computed: {
    ...mapState("home", ["popularity", "newArticle"]),
  },
};
</script>

<style scoped lang="less">
.row {
  margin-top: -80px;

  h4 {
    display: block;
    text-align: center;
    font-size: 1.5rem;
    margin-block-start: 1.33em;
    margin-block-end: 1.33em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: bold;
  }

  .btn {
    width: 100%;
    display: inline-block;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    cursor: pointer;
    background-color: transparent;
    border: 1px solid transparent;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    border-radius: 0.25rem;
  }

  .btn-info {
    margin-top: -25px;
    color: #000;
    background-color: #0dcaf0;
    border-color: #0dcaf0;
    transition: all 0.5s;
  }

  .btn-info:hover {
    background-color: #31d2f2;
  }

  .el-header,
  .el-footer {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    // line-height: 160px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }

  .box-card {
    width: 46%;
  }

  .author-card {
    float: left;

    .popularity-table {
      padding-left: 10px;

      .rank-three {
        color: red;
      }
    }
  }

  .article-card {
    float: right;

    .rank-three {
      color: red;
    }
  }
}
</style>
