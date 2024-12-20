<template>
  <div class="favorite">
    <div class="fav-list">
      <div class="nav-title nav-add">
        {{ isHome ? '我的收藏':'收藏' }}
      </div>
      <div class="fav-ul">
        <ul>
          <li class="fav-add" v-if="isHome">
            <div @click="handleAddFavList">
              <i class="iconfont icon-jiahao"></i>
              添加收藏
            </div>
          </li>
          <li v-for="fav in favList" class="fav-item" @mouseover="curLi = fav.id" @mouseleave="curLi = -1"
            @click="handleGetFavArticles(fav.id)" :class="{ active: activeLi == fav.id }">
            <i class="iconfont icon-aixin" v-if="fav.type == 'default'"></i>
            <i class="iconfont icon-shoucangjia" v-else></i>

            <span class="fav-list-name">{{ fav.name }}</span>

            <span class="more" v-if="isHome && curLi == fav.id && fav.type != 'default'" @mouseover="curIndex = fav.id"
              @mouseleave="curIndex = -1">
              <i class="iconfont icon-diandian"> </i>
              <div class="edit-fav" v-if="fav.id == curIndex">
                <ul>
                  <li @click="handleEditFavList(fav)">编辑信息</li>
                  <li @click="handleDeleteFavList(fav.id)">删除</li>
                </ul>
              </div>
            </span>
            <span class="total-fav" v-else>{{ fav.total }}</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="fav-container" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading">
      <el-table :data="favArticles" style="width: 760px">
        <el-table-column label="书名" prop="">
          <template slot-scope="{ row }">
              <a v-if="row.deleted==1" class="deleted-text">{{ row.title }}</a>

            <router-link v-else :to="`/read/?articleId=${row.id}`" :style="{ 'text-decoration': 'none' }">{{ row.title
            }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="作者" prop="">
          <template slot-scope="{ row }">
            <a v-if="row.deleted==1" class="deleted-text">{{ row.author.name }}</a>
            <router-link v-else :to="`/details/?authorId=${row.author.id}`" :style="{ 'text-decoration': 'none' }">{{
              row.author.name }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="收藏于" prop="createTime"> </el-table-column>
        <el-table-column label="" prop="" width="50" v-if="isHome">
          <template slot-scope="{ row }">
            <span class="iconfont icon-shanchu" @click="handleDeleteFavArticle(row.favId)">
            </span>
          </template>
        </el-table-column>
      </el-table>

      <div class="block">
        <el-pagination @current-change="handleCurrentChange" :current-page="query.pageNum" :page-size="query.pageSize"
          layout="total, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog :visible.sync="addDialogVisible" :title="title">
      <el-form :model="favForm" label-position="top">
        <el-form-item label="收藏夹名称">
          <el-input v-model="favForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addFavList">{{ operation }}</el-button>
        <el-button @click="addDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqAddFavList,
  reqDeleteFavList,
  reqDeleteFavArticle,
} from "@/api/index";
import { mapState } from "vuex";

export default {
  name: "Favorite",
  data() {
    return {
      loading: true,
      curIndex: -1,
      curLi: -1,
      activeLi: -1,

      query: {
        pageNum: 1,
        pageSize: 10,
      },

      favListId: 0,
      spaceId:null,    // 空间 id 这是谁的空间

      favForm: {
        name: "",
        id: null,
      },
      addDialogVisible: false,
      title: "添加收藏夹",
      operation: "添加",
    };
  },
  async mounted() {
    const {id} = this.$route.params
    this.spaceId = id

    await this.getFavList();
    await this.handleGetFavArticles(this.favList[0].id);
  },
  methods: {
    async handleDeleteFavArticle(id) {
      const { code, msg } = await reqDeleteFavArticle(id);
      if (code === 200) {
        await this.getFavList()
        await this.handleGetFavArticles(this.favListId);
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    async handleCurrentChange(page) {
      this.query.pageNum = page;
      await this.$store.dispatch("favorite/getFavArticles", {
        id: this.favListId,
        data: this.query,
      });
    },
    async handleGetFavArticles(id) {
      this.activeLi = id
      this.loading = true;
      this.favListId = id;
      await this.$store.dispatch("favorite/getFavArticles", {
        id,
        data: this.query,
      });
      this.loading = false;
    },

    async addFavList() {
      const { code, msg } = await reqAddFavList(this.favForm);
      if (code === 200) {
        this.getFavList();
      }
      this.$message.warning(msg);
      this.addDialogVisible = false;
      this.favForm.name = "";
    },

    handleAddFavList() {
      this.addDialogVisible = true;
      this.title = "添加收藏夹";
      this.operation = "添加";
      this.favForm = {
        name: "",
        id: null,
      };
    },

    async handleEditFavList({ id, name }) {
      this.addDialogVisible = true;
      this.title = "  修改收藏夹";
      this.operation = "修改";
      this.favForm = {
        name,
        id,
      };
    },
    /**
     * 删除 favList
     */
    async handleDeleteFavList(id) {
      const { code, msg } = await reqDeleteFavList(id);
      if (code === 200) {
        this.getFavList();
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    async getFavList() {
      const {spaceId} = this
      await this.$store.dispatch("favorite/getFavList",{spaceId});
    },
  },
  computed: {
    ...mapState("favorite", ["favList", "favArticles", "total"]),
    isHome(){
      const id = localStorage.getItem('id')
      return id == this.spaceId
    }
  },
};
</script>

<style lang="less" scoped>
.favorite {
  position: relative;
  // margin-top: -50px;
  // background-color:orange;
  height: 600px;
  width: 100%;
  border: 1px solid #eee;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

  .fav-list {
    // background-color: red;
    width: 180px;
    height: 600px;
    position: absolute;
    border: 1px solid #eee;

    .nav-title {
      width: 100%;
      height: 60px;
      color: #9ba2a9;
      // background-color: green;
      line-height: 60px;
      text-align: center;
    }

    .fav-ul {
      height: 540px;
      overflow: scroll;

      ul {
        margin: 0;
        padding: 0;

        li {
          list-style-type: none;
          text-align: center;
        }

        .fav-add,
        .fav-item {
          position: relative;
          height: 44px;
          padding-left: 30px;
          display: flex;
          align-items: center;
          text-align: center;
          font-size: 14px;
          cursor: pointer;

          .edit-fav {
            z-index: 100;
            position: absolute;
            background-color: #fff;
            height: 90px;
            width: 90px;
            top: 30px;
            right: 10px;
            border-radius: 5px;
            border: 1px solid #eee;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

            li {
              height: 45px;
              line-height: 45px;
            }

            li:hover {
              color: #316cf4;
            }
          }

          .icon-shoucangjia,
          .icon-aixin {
            margin-right: 10px;
          }

          .icon-diandian,
          .total-fav {
            position: absolute;
            top: 10px;
            right: 10px;
          }

          .total-fav {
            right: 15px;
          }
        }

        .fav-item:hover {
          background-color: #f4f5f7;

          .fav-list-name {
            color: #479fd1;
          }
        }

        .active {
          background-color: #479fd1 !important;

          .fav-list-name {
            color: #fff !important;
          }

        }
      }
    }
  }

  .fav-container {
    // background-color: blue;
    position: absolute;
    left: 200px;
    top: 0px;
    width: 800px;
    height: 600px;

    .deleted-text{
      text-decoration: line-through;
    }

    .icon-shanchu {
      cursor: pointer;
    }

    .block {
      position: absolute;
      bottom: 0px;
      padding-left: 250px;
    }
  }
}
</style>
