<template>
  <div class="history">
    <div class="b-head">
      <span class="b-head-time">
        <span class="iconfont icon-jurassic_clock clock-icon"></span>
        历史记录
      </span>
      <div class="b-head-search input-active">
        <input class="b-head-search_input" placeholder="搜索历史" v-model="keyword">
        <span class="iconfont icon-fangdajing fangdajing-icon" @click="getHistory"></span>
        </input>
      </div>
      <div class="history-btn">
        <el-button type="primary" size="small" @click="handleDeleteaAll">清空历史记录</el-button>
      </div>
    </div>
    <div class="history-container">
      <el-table :data="histories" style="width: 100%" class="list-contain"
      v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
      >
        <el-table-column label="书名" prop="article.title">
          <template slot-scope="{ row }">
            <router-link :to="`/read/?articleId=${row.article.id}&page=${row.page}`"
              :style="{ 'text-decoration': 'none' }">{{ row.article.title
              }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="作者" prop="">
          <template slot-scope="{row}">
            <router-link :to="`/details/?authorId=${row.author.id}`" :style="{ 'text-decoration': 'none' }">{{
              row.author.name }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="进度" prop="" width="200">
          <template slot-scope="{row}">
            <el-progress :text-inside="true" :stroke-width="20" :format="format" :color="customColors" :percentage="100 * row.page / row.total"></el-progress>
            <!-- <el-progress :percentage="100 * row.page / row.total" :format="format"></el-progress> -->
          </template>
        </el-table-column>
        <el-table-column label="阅读时间" prop="createTime">
        </el-table-column>
        <el-table-column label="" prop="">
          <template slot-scope="{row}">
            <span class="iconfont icon-shanchu" @click="handleDelete(row.id)"></span>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="query.pageNum"
          :page-size="query.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="size"
        >
        </el-pagination>
      </div>

    </div>


  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      keyword: '',
      loading:false,
      query: {
        pageNum: 1,
        pageSize: 10
      },
      customColors: [
          {color: '#f56c6c', percentage: 20},
          {color: '#e6a23c', percentage: 40},
          {color: '#5cb87a', percentage: 60},
          {color: '#1989fa', percentage: 80},
          {color: '#6f7ad3', percentage: 100}
        ]
    };
  },
  methods: {
   async handleCurrentChange(page){
      this.query.pageNum = page
     await this.getHistory()
    },

    format(percentage) {
      percentage = percentage.toFixed(2)
      if (isNaN(percentage)) return '0%';
      return percentage === 100 ? '已读完' : `${percentage}%`;
    },
    async getHistory() {
      const { query } = this
      const { keyword } = this
      this.loading = true
       await this.$store.dispatch("read/getReadHistory",{query,keyword});
      this.loading = false
    },
    async handleDelete(id) {
      const result = await this.$store.dispatch('read/deleteReadHistory', id)
      if (result) this.getHistory()
    },
    async handleDeleteaAll() {
      const result = await this.$store.dispatch('read/deleteAllReadHistory')
      if (result) this.getHistory()
    }
  },
  async mounted() {
    await this.getHistory()
  },
  computed: {
    ...mapState("read", ["histories", 'size']),
  },
};
</script>
<style scoped land="less">
.history {
  /* border:1px solid #eee; */
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04); */
  margin-top: -80px;
  /* background-color:red; */
  height:680px;
  position: relative;

  .b-head {
    .b-head-time {
      font-size: 22px;

      .clock-icon {
        color: #d89773;
        font-size: 28px;
      }
    }

    .b-head-search {
      display: inline-block;
      border: 1px solid #ccd0d7;
      /* background-color:red; */
      width: 188px;
      height: 30px;
      position: absolute;
      right: 250px;
      border-radius: 15px;
      padding: 0 5px;

      .b-head-search_input {
        width: 120px;
        height: 17px;
        line-height: 17px;
        padding-left: 10px;
        border: none;
        outline: none;
        font-size: 12px;
      }

      .fangdajing-icon {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%)
      }

      .fangdajing-icon:hover {
        cursor: pointer
      }
    }

    .history-btn {
      position: absolute;
      right: 110px;
      display: inline-block;
    }

    .input-active {
      border: 1px solid #00a1d6;
    }
  }

  .history-container {

    .list-contain {
      margin-top: 10px;

      .icon-shanchu:hover {
        cursor: pointer;
      }
    }

    .block{
      position: absolute;
      bottom: 0px;
      padding-left: 250px;
    }

  }

}
</style>
