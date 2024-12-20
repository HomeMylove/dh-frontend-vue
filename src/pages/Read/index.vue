<template>
  <div>
    <div class="header-container">
      <h1 class="article-title">{{ article.title }}</h1>
      <el-button @click="copyUrl" class="share-btn" icon="el-icon-share">
        {{ $t("message.share") }}
        <!-- <i class="iconfont icon-fuzhi"></i> -->
      </el-button>
      <div class="author-info">
        <span class="author-name"><router-link :to="`/details/?authorId=${article.author.id}`"
            :style="{ 'text-decoration': 'none' }">
            {{ article.author.name }}
          </router-link></span>
      </div>
      <div class="creator-info" v-if="article.creator">
        <router-link :to="`/space/${article.creator.id}`">
          <el-tag type="danger">
            上传自用户
            {{ article.creator.name }}
          </el-tag>
        </router-link>

      </div>
    </div>
    <div class="article-container">
      <div class="article-content clearfix">
        <p v-for="(p, index) in article.text[currentPage - 1]" :key="index">
          {{ p }}
        </p>
      </div>
      <div class="block">
        <el-pagination @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="1"
          layout="prev, pager, next, jumper" :total="article.text.length">
        </el-pagination>
      </div>
    </div>
    <div class="menu">
      <el-button round class="favorite menu-btn" @click="handleFavArticle">
        <i class="iconfont icon-shoucang" /> 收藏
      </el-button>
    </div>

    <el-dialog :visible.sync="favDialogVisible" title="添加收藏">
      <el-checkbox-group v-model="checkList">
      <el-table :data="favList" :show-header="false" style="width: 100%">
        <el-table-column label="" prop="">
          <template slot-scope="{ row }">
            <el-checkbox  :label="row.id">{{
              row.name
            }}</el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="" prop="" width="100">
          <template slot-scope="{ row }">
            {{ row.total }} / {{ row.size }}
          </template>
        </el-table-column>
      </el-table>
      </el-checkbox-group>
      <div slot="footer">
        <el-button @click="addFavArticle">收藏</el-button>
        <el-button @click="favDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <Comments />
  </div>
</template>

<script>
import { mapState } from "vuex";

import Comments from "@/pages/Comments";
import { reqDownloadArticle, reqAddArticleToFavList } from "@/api/index.js";

export default {
  name: "Read",
  data() {
    return {
      checkList: [],
      currentPage: 6,
      favDialogVisible: false,
    };
  },
  components: {
    Comments,
  },
  methods: {
    handleChange(id) {
      const {checkList} = this
      let index = checkList.indexOf(id)
      if (index !== -1) {
        checkList.splice(index, 1);
      } else {
        checkList.push(id);
      }
      this.checkList = checkList
    },
    async handleFavArticle() {
      const spaceId = localStorage.getItem('id')
      if (spaceId == null) {
        this.$message.error('登陆后收藏')
        return
      }
      this.favDialogVisible = true;
      await this.$store.dispatch("favorite/getFavList", {
        articleId: this.$route.query.articleId,
        spaceId
      });
      this.checkList = this.favList.filter(v => v.checked).map(v => v.id)
    },
    async addFavArticle() {
      const data = {
        articleId: this.$route.query.articleId,
        favList: this.checkList
      }
      const { code, msg } = await reqAddArticleToFavList(data);
      if (code === 200) {
        this.$message.success(msg);
      } else {
        this.$message.warning(msg);
      }
      this.favDialogVisible = false;
    },

    downloadArticle() {
      reqDownloadArticle(this.$route.query.articleId);
    },
    handleCurrentChange(index) {
      this.currentPage = index;
    },
    copyUrl() {
      var oInput = document.createElement("input"); //创建隐形input
      oInput.value = window.location.href; // window.location.href 浏览器URL
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("Copy");
      oInput.remove();
      this.$message({
        type: "success",
        message: "复制到粘贴板",
      });
    },
  },

  async mounted() {
    await this.$store.dispatch("read/getArticle", this.$route.query.articleId);
    this.currentPage = parseInt(this.$route.query.page);
  },
  async beforeDestroy() {
    // 在这里执行清理操作
    const data = {
      articleId: this.article.id,
      page: this.currentPage,
      total: this.article.text.length,
    };
    await this.$store.dispatch("read/saveReadHistory", data);
  },
  computed: {
    ...mapState("read", ["article"]),
    ...mapState("favorite", ["favList"]),
  },
};
</script>

<style scoped>
.header-container {
  position: relative;
}

.article-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

.article-title {
  font-size: 24px;
  flex-direction: column;
  text-align: center;
  /* 文本居中对齐 */
}

.share-btn {
  /* float: right; */
}

.author-info {
  text-align: center;
  flex-direction: column;
  color: #888;
  margin-bottom: 20px;
}

.creator-info {
  position: absolute;
  right: 80px;
  bottom: 0px;
}

.published-date {
  margin-left: 10px;
}

.article-content {
  font-size: 16px;
  height: 32em;
  line-height: 1.5;
  white-space: pre-line;
  word-wrap: break-word;
}

.clearfix::after {
  content: "";
  display: table;
  clear: both;
}

.menu {
  /* background-color:red; */
  max-width: 800px;
  height: 30px;
  margin: 0 auto;
  position: relative;
  margin-top: 20px;
}

.menu .menu-btn {
  float: right;
  background-color: #f2f2f2;
  margin-left: 20px;
}
</style>
