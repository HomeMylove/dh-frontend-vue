<template>
  <div class="container-search">
    <form action="#">
      <h4>{{ $t("message.searchHip") }}</h4>
      <!-- 输入框 -->
      <div class="input-search clearfix">
        <el-select v-model="choice" placeholder="请选择" style="width: 100px" class="choose-mode" @change="changeSelect">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        <div class="form-control">
          <div class="hint-keyword" v-if="showPanel == 'hint'" style="z-index: 1;">
            <div class="hint-list">
              <template>
                <el-table :show-header="false" :data="hints" style="width: 100%">
                  <el-table-column prop="" label="姓名">
                    <template slot-scope="{row}">
                      <div class="hint-line" @click="directlySearch(row)">
                        {{ row.name }}
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </div>
          </div>

          <div class="search-history" v-if="showPanel == 'history'" style="z-index: 1;">
            <div class="history-list">
              <template>
                <el-table :show-header="false" :data="choice === 'author' ? history.authors : history.articles"
                  style="width: 100%">
                  <el-table-column prop="" label="姓名">
                    <template slot-scope="{row}">
                      <div class="history-line" @click="searchHistory(row)">
                        {{ row }}
                        <a class="del-history-btn" @click.stop="deleteHistory(row)">删除</a>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </div>
          </div>
          <input :class="{ hidden: showPanel != null }" style="z-index: 2;" @input="handleInput" @focus="setShowPanel"
            @blur="handleBlur" type="text" placeholder="search for..." v-model="keyword" />
        </div>
        <button @click.prevent="handleClickBtn">{{ $t("message.search") }}</button>
      </div>

      <!-- 展示 -->
      <div class="show" style="z-index: 0;position: relative;">
        <h2>{{ size }} {{ $t("message.searchResults") }}</h2>

        <!-- 结果列表 作者 -->
        <div v-show="ifShowAuthor">
          <el-table :data="data" border style="width: 100%" v-loading="loading" element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading">
            <el-table-column type="index" align="center" :label="$t('message.number')" width="80">
            </el-table-column>
            <el-table-column prop="prop" :label="$t('message.authorName')" width="180">
              <template slot-scope="{ row }">
                <router-link :to="`/details/?authorId=${row.id}`" :style="{ 'text-decoration': 'none' }">{{
                  row.name }}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="about" :label="$t('message.introduction')">
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
              :page-sizes="[10, 20, 30, 50]" :page-size="10" layout="total, sizes, prev, pager, next, jumper"
              :total="size">
            </el-pagination>
          </div>
        </div>

        <div v-show="ifShowBook">
          <el-table :data="data" border style="width: 100%" v-loading="loading" element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading">
            <el-table-column type="index" align="center" :label="$t('message.number')" width="80">
            </el-table-column>
            <el-table-column prop="authorName" :label="$t('message.authorName')" width="180">
              <template slot-scope="{ row }">
                <router-link :to="`/details/?authorId=${row.author.id}`" :style="{ 'text-decoration': 'none' }">{{
                  row.author.name }}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="title" :label="$t('message.title')">
              <template slot-scope="{ row }">
                <router-link :to="`/read/?articleId=${row.id}`" :style="{ 'text-decoration': 'none' }">{{ row.title
                }}</router-link>

                <span class="creator-info" v-if="row.creator">

                  <router-link :to="`/space/${row.creator.id}`">
                    <el-tag type="danger">
                    上传自用户
            
                    {{ row.creator.name }}
                  </el-tag>
                  </router-link>
                      
                  
                </span>

              </template>
            </el-table-column>
          </el-table>
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
              :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
              :total="size">
            </el-pagination>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Search",
  data() {
    return {
      options: [
        {
          value: "author",
          label: "作者",
        },
        {
          value: "book",
          label: "书名",
        },
      ],
      choice: "author",
      loading: false,
      pageNum: 1,
      pageSize: 10,
      keyword: "",
      hintword: "",
      hintinput: '',
      hint: '',
      showPanel: null,
    };
  },
  mounted() {
    this.getSearchHistory()
    this.$store.dispatch('search/getHint', {
      choice: this.choice,
      hint: this.hint
    })
    if (this.hints.length > 0) this.showPanel = 'hint'
  },

  methods: {
    handleClickBtn() {
      this.pageNum = 1
      this.getInfo()

    },
    async deleteHistory(history) {
      const result = await this.$store.dispatch('search/deleteSearchHistory', {
        choice: this.choice,
        history
      })
      if (result) this.getSearchHistory()
    },
    searchHistory(keyword) {
      // 用历史去查
      this.keyword = keyword
      this.getInfo()
    },
    async getSearchHistory() {
      await this.$store.dispatch('search/getSearchHistory')
    },
    /**
     * 直接搜索
     */
    directlySearch({ id, name }) {
      // 跳转到对应页面
      if (this.choice === 'author') {
        this.$router.push(`/details/?authorId=${id}`)
        this.$store.dispatch('search/saveSearchHistory', { choice: this.choice, keyword: name })
      } else {
        this.$router.push(`/read/?articleId=${id}`)
        this.$store.dispatch('search/saveSearchHistory', { choice: this.choice, keyword: name })
      }
    },
    setShowPanel() {
      if (this.keyword == 0) {
        let len
        if (this.choice === 'author') {
          len = this.history.authors.length
        } else {
          len = this.history.articles.length
        }
        this.showPanel = len > 0 ? 'history' : null
      }
      else if (this.hints.length > 0) {
        this.showPanel = 'hint'
      } else {
        this.showPanel = null
      }
    },
    handleBlur() {
      setTimeout(() => {
        this.showPanel = null
      }, 200); // 假设延迟 200 毫秒隐藏列表
    },
    async handleInput(e) {
      const { data, inputType, isComposing } = e
      if (inputType == 'deleteByCut' || inputType == 'deleteContentBackward') {
        this.hintword = this.keyword
      }
      else if (!isComposing && data != undefined) {
        this.hintword += data
      }
      else if (data == undefined) {
        this.hintword += this.hintinput
        this.hintinput = ''
      } else {
        this.hintinput = data
      }
      // 本来就一样  不搜索
      const cancat = this.hintword + this.hintinput
      if (this.hint == cancat.trim()) return
      this.hint = cancat.trim()

      await this.$store.dispatch('search/getHint', {
        choice: this.choice,
        hint: this.hint
      })

      this.setShowPanel()
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.getInfo()
    },
    handleCurrentChange(num) {
      this.pageNum = num
      this.getInfo()
    },
    changeSelect() {
      this.keyword = ''
      this.keyword = "",
        this.hintword = "",
        this.hintinput = '',
        this.hint = ''
      this.$store.dispatch('search/reset')
      this.$store.dispatch('search/getHint', {
        choice: this.choice,
        hint: this.hint
      })
    },

    async getInfo() {
      console.log("get info");
      if (this.keyword == "") {
        return this.$message({
          message: "输入不能为空",
          type: "warning",
        });
      }

      this.loading = true
      await this.$store.dispatch("search/getInfo", {
        choice: this.choice,
        keyword: this.keyword,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
      this.loading = false
      this.showPanel = null
      this.getSearchHistory()
    },
  },

  computed: {
    ...mapState("search", ["data", 'size', 'hints', 'history']),
    ifShowAuthor() {
      return this.choice == "author" && this.size > 0;
    },
    ifShowBook() {
      return this.choice == "book" && this.size > 0;
    },
  },
};
</script>


<style lang="less" scoped>
.container-search {
  margin-top: -80px;

  form {
    h4 {
      width: 100%;
      text-align: center;
      font-size: 1.5rem;
      margin-top: 0;
      margin-bottom: 0.5rem;
      font-weight: 500;
      line-height: 1.2;
      display: block;
      margin-block-start: 1.33em;
      margin-block-end: 1.33em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
    }

    .input-search {
      margin-top: -10px;
      width: 100%;
      // background-color: #f00;
      height: 40px;

      .choose-mode {
        float: left;
      }

      .form-control {
        position: relative;

        input {
          position: absolute;
          outline-color: #c2dbfe;
          width: 760px;
          border-radius: 4px;
          border: 2px solid #ced4da;
          padding-left: 20px;
          box-sizing: border-box;
          float: left;
          font-size: 20px;
          line-height: 36px;
          height: 40px;
        }

        .hidden {
          border: none;
          outline: none;
          width: 756px;
          left: 102px;
          top: 2px;
          height: 36px;
        }

        .hint-keyword {
          position: absolute;
          // background-color: red;
          width: 760px;
          left: 100px;
          border: 2px solid #5670ea;
          box-sizing: border-box;
          // height: 300px;
          border-radius: 4px;

          .hint-list {
            margin-top: 40px;

            .hint-line {
              padding-left: 20px;
              cursor: pointer;
            }

            .hint-line:hover {
              color: #3c5df2;
            }
          }

        }

        .search-history {
          position: absolute;
          // background-color: red;
          width: 760px;
          left: 100px;
          border: 2px solid #5670ea;
          box-sizing: border-box;
          // height: 300px;
          border-radius: 4px;

          .history-list {
            margin-top: 40px;

            .history-line {
              padding-left: 20px;
              cursor: pointer;

              .del-history-btn {
                opacity: 0;
                float: right;
                margin-right: 10px;
              }

              .del-history-btn:hover {
                opacity: 1;
              }

            }

            .history-line:hover {
              color: #3c5df2;
            }


          }

        }
      }



      button {
        width: 100px;
        cursor: pointer;
        font-size: 18px;
        border-color: #0d6efd;
        color: white;
        background-color: #0d6efd;
        border-radius: 8px;
        box-sizing: border-box;
        float: right;
        height: 40px;
      }

      button:hover {
        background-color: #0b5ed7;
      }
    }

    .show {
      width: 900px;
      margin: 0 30px;

      h2 {
        width: 100%;
        text-align: center;
      }


      .creator-info {
        float: right;
      }
    }
  }
}
</style>