<template>
  <div class="discussion-container">
    <div class="discussion-header">
      <div class="discussion-search clearfix">
        <div>
          <div class="all-discussion" @click="searchAll">{{$t('message.allDiscussion')}}</div>
          <input
            type="text"
            placeholder="Search for..."
            v-model="keyword"
            @keyup.enter="searchByKeyword"   
          />
        </div>
        <button @click="searchByKeyword">{{$t('message.search')}}</button>
      </div>

      <div class="discussion-add clearfix">
        <!-- 提交评论 -->
        <el-form ref="form" :model="form" :inline="true" class="comment-send">
          <el-form-item>
            <el-input
              type="textarea"
              rows="3"
              v-model="form.comment"
              :placeholder="$t('message.saySth')"
              class="comment-input"
            >
            </el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              class="comment-submit"
              @click="openDialog('comment')"
              >{{$t('message.send')}}<br />{{$t('message.sendDiscussion')}}</el-button
            >
          </el-form-item>
        </el-form>

        <!-- 提交选项 -->
        <el-dialog
          :title="$t('message.chooseAvatar')"
          :visible.sync="formVisible"
          class="choose-gender"
        >
          <el-form>
            <ul>
              <li>
                <a>
                  <i
                    class="iconfont icon-user-man-full"
                    @click="form.gender = 'man'"
                    :class="{ 'chosed-man': form.gender == 'man' }"
                  ></i>
                </a>
              </li>
              <li>
                <a>
                  <i
                    class="iconfont icon-user-women-full"
                    @click="form.gender = 'women'"
                    :class="{ 'chosed-women': form.gender == 'women' }"
                  ></i>
                </a>
              </li>
            </ul>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="formVisible = false">{{$t('message.cancel')}}</el-button>
            <el-button type="primary" @click="sendDiscussion">{{$t('message.confirm')}}</el-button>
          </div>
        </el-dialog>
      </div>

      <div class="discussion-show clearfix">
        <div class="discussion-show-header">
          <h1>{{ discussions.length }} {{$t('message.discussionCount')}}</h1>
          <h2 class="clearfix">
            <ul>
              <li
                @click="changeOrder('desc')"
                :class="{ active: order == 'desc' }"
              >
                {{$t('message.timeAsc')}}
              </li>
              <li>|</li>
              <li
                @click="changeOrder('asc')"
                :class="{ active: order == 'asc' }"
              >
                {{$t('message.timeDesc')}}
              </li>
            </ul>
          </h2>
        </div>

        <!-- 展示评论 -->
        <el-table :data="discussions" class="comment-show" :show-header="false">
          <el-table-column prop="" label="" width="width">
            <template slot-scope="{ row }">
              <div class="comment-wrapper">
                <span class="avater" v-show="row.gender == 'man'">
                  <i class="iconfont icon-user-man-full"></i>
                </span>
                <span class="avater" v-show="row.gender == 'women'">
                  <i class="iconfont icon-user-women-full"></i>
                </span>
                <div class="comment-main">
                  <div class="user-name">游客{{ row.id }}</div>
                  <!-- <p class="text">
                    {{ row.comment }}
                  </p> -->
                    <p v-html="row.comment"></p>
                  
                  <span class="comt-time">{{ row.time }}</span>
                  <span class="reply-btn" @click="showEdit(row)">{{$t('message.reply')}}</span>

                  <!-- 评论的回复 -->
                  <div class="comment-reply" v-show="row.reply.length > 0">
                    <el-table
                      :data="row.reply"
                      style="width: 100%"
                      :show-header="false"
                    >
                      <el-table-column width="width">
                        <template slot-scope="{ row }">
                          <div class="reply-wrapper">
                            <span
                              class="reply-avater"
                              v-show="row.gender == 'man'"
                            >
                              <i class="iconfont icon-user-man-full"></i>
                            </span>
                            <span
                              class="reply-avater"
                              v-show="row.gender == 'women'"
                            >
                              <i class="iconfont icon-user-women-full"></i>
                            </span>
                            <div class="reply-main">
                              <div class="reply-user-name">
                                游客{{ row.id }}
                              </div>
                              <!-- <p class="reply-text">
                                {{ row.comment }}
                              </p> -->
                              <p class="repl-text" v-html="row.comment"></p>
                              <span class="reply-time">{{ row.time }}</span>
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>

                  <!-- 输入回复的位置 -->
                  <div class="reply-wrapper" v-show="row.edit">
                    <!-- 提交评论 -->
                    <el-form
                      ref="form"
                      :model="form"
                      :inline="true"
                      class="comment-send"
                    >
                      <el-form-item>
                        <el-input
                          type="textarea"
                          rows="3"
                          v-model="form.reply"
                          :placeholder="$t('message.saySth')"
                          class="comment-input"
                          :ref="row.id"
                        >
                        </el-input>
                      </el-form-item>

                      <el-form-item>
                        <el-button
                          type="primary"
                          class="comment-submit"
                          @click="openDialog('reply')"
                          >{{$t('message.send')}}<br />{{$t('message.sendDiscussion')}}</el-button
                          
                        >
                      </el-form-item>
                    </el-form>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Discussion",
  data() {
    return {
      keyword: "",
      form: {
        to_id: "",
        type: "comment",
        comment: "",
        reply: "",
        gender: "man",
      },
      formVisible: false,
      order: "desc",
      replyVisible: true, // 是否显示回复框
    };
  },
  mounted() {
    this.getDiscussion();
  },

  methods: {
    openDialog(type) {
      const { comment, reply } = this.form;
      if (
        (type == "comment" && comment.trim() == "") ||
        (type == "reply" && reply.trim() == "")
      ) {
        return this.$message({
          message: this.$t('message.warningNull'),
          type: "warning",
        });
      }
      this.form.type = type;

      console.log(this.form.type);
      this.formVisible = true;
    },
    async sendDiscussion() {
        // 处理数据
        let {to_id,type,comment,reply,gender} = this.form

        if(type == 'comment'){
            to_id = ''
        }else{
            comment = reply
        }

        const form = {to_id,type,comment,gender}


      try {
        const result = await this.$store.dispatch(
          "discussion/sendDiscussion",
          form
        );
        this.$message({
          message: "讨论成功",
          type: "success",
        });

        this.getDiscussion();
      } catch (error) {
        console.log(error);

        this.$message({
          message: "讨论失败",
          type: "warning",
        });
      } finally {
        this.form.comment = "";
        this.formVisible = false;
      }
    },
    // 关键词搜索
    searchByKeyword() {
      let { keyword } = this;
      keyword = keyword.trim();
      if (keyword == "") return;
      this.getDiscussion();
    },
    searchAll() {
      this.keyword = "";
      this.getDiscussion();
    },
    async getDiscussion() {
      const { keyword, order } = this;
      await this.$store.dispatch("discussion/getDiscussion", {
        keyword,
        order,
      });

      this.discussions.forEach((item) => {
        this.$set(item, "edit", false);
      });
    },

    showEdit(row) {
      if (row.edit) return (row.edit = false);
      this.form.comment = "";
      this.form.reply = "";
      this.form.to_id = row.id
      // 将所有的都改为false
      
      this.discussions.forEach((item) => {
        item.edit = false;
      });

      row.edit = true;

      // 获取焦点
      this.$nextTick(() => {
        this.$refs[row.id].focus();
      });
    },

    changeOrder(order) {
      if (this.order == order) return;
      this.order = order;
      this.getDiscussion();
    },
  },

  computed: {
    ...mapState("discussion", ["discussions"]),
  },
};
</script>

<style lang="less" scoped>
.discussion-container {
  padding: 0px 50px;
  height: 1000px;
  //   background-color: red;

  .discussion-header {
    height: 200px;
    // background-color: #0f0;

    .discussion-search {
      padding-bottom: 10px;
      border-bottom: 1px solid #f1f3f6;

      .all-discussion {
        float: left;
        height: 40px;
        width: 80px;
        cursor: pointer;
        text-align: center;
        border-radius: 8px;
        line-height: 40px;
        background-color: #f1f3f4;
        transition: all 0.5s;
      }

      .all-discussion:hover {
        background-color: #cbe4f0;
      }

      input {
        outline-color: #c2dbfe;
        width: 300px;
        border-radius: 4px;
        border: 2px solid #ced4da;
        padding-left: 20px;
        box-sizing: border-box;
        float: left;
        font-size: 20px;
        line-height: 36px;
        height: 40px;
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
        float: left;
        height: 40px;
      }

      button:hover {
        background-color: #0b5ed7;
      }
    }

    .discussion-add {
      margin-top: 30px;

      h1 {
        font-size: 18px;
        color: #222c62;
      }

      .comment-send {
        //   border-bottom: 1px solid #e5e9ef;
        .comment-input {
          width: 700px;
        }
        .comment-submit {
          color: #fff;
          line-height: 20px;
          font-size: 14px;
          width: 80px;
          height: 72px;
          padding: 4px 15px;
        }
      }

      .choose-gender {
        ul {
          margin-top: -10px;
          margin-bottom: 20px;
          li {
            float: left;

            margin: 0px 10px;
            list-style: none;

            a {
              cursor: pointer;
              i {
                font-size: 60px;
                color: #e0e0e0;
              }

              .chosed-man {
                color: #00a1d6;
              }

              .chosed-women {
                color: pink;
              }
            }
          }
        }
      }
    }

    .discussion-show {
      .discussion-show-header {
        h1 {
          font-size: 18px;
          color: #222c62;
        }
        h2 {
          border-bottom: 1px solid #e5e9ef;
          font-size: 14px;
          //   margin-bottom: 10px;

          ul {
            padding: 0;
            margin-bottom: 5px;
            float: left;

            li {
              margin-left: 20px;
              list-style: none;
              float: left;
            }

            li:hover {
              color: #00a1d6;
              cursor: pointer;
            }

            .active {
              color: #00a1d6;
            }
          }
        }
      }

      .comment-show {
        width: 100%;

        .comment-wrapper {
          .avater {
            vertical-align: top;
            margin-top: 10px;
            height: 100px;
            width: 100px;
            // background-color: #f00;
            i {
              display: inline-block;
              margin-top: 10px;
              font-size: 40px;
            }
            .icon-user-man-full {
              color: #00a1d6;
            }

            .icon-user-women-full {
              color: pink;
            }
          }

          .comment-main {
            position: relative;
            display: inline-block;
            margin-left: 10px;
            //   height: 200px;
            width: 700px;
            // background-color: #ebf1fb;

            .user-name {
              color: #fb7229;
              font: 12px "Microsoft Yahei";
            }

            .text {
              padding-left: 10px;
            }

            .comment-reply {
              margin-left: 10px;
              background-color: #f1f3f4;

              .reply-avater {
                vertical-align: top;
                margin-top: 10px;
                height: 100px;
                width: 100px;
                // background-color: #f00;
                i {
                  display: inline-block;
                  margin-top: 10px;
                  font-size: 30px;
                }
                .icon-user-man-full {
                  color: #00a1d6;
                }

                .icon-user-women-full {
                  color: pink;
                }
              }

              .reply-main {
                position: relative;
                display: inline-block;
                margin-left: 10px;
                //   height: 200px;
                width: 600px;
                // background-color: #f00;
                // background-color: #ebf1fb;

                .reply-user-name {
                  color: #fb7229;
                  font: 12px "Microsoft Yahei";
                }

                .reply-text {
                  padding-left: 10px;
                }

                .reply-time {
                  padding-left: 10px;
                  margin-top: 30px;

                  font-size: 12px;
                  color: #99a2aa;
                }
              }
            }

            .reply-wrapper {
              //   background-color: #f00;
              margin-top: 10px;

              .comment-input {
                width: 600px;
              }
              .comment-submit {
                color: #fff;
                line-height: 20px;
                font-size: 14px;
                width: 80px;
                height: 72px;
                padding: 4px 15px;
              }
            }

            .comt-time {
              padding-left: 10px;
              margin-top: 30px;

              font-size: 12px;
              color: #99a2aa;
            }

            .reply-btn {
              font-size: 12px;
              margin-left: 10px;
              color: #99a2aa;
              cursor: pointer;
            }

            .reply-btn:hover {
              color: #00b1e1;
              background-color: #e5e9ef;
            }
          }
        }
      }
    }
  }
}
</style>