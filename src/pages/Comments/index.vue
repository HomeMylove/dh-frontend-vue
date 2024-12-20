<template>
  <div class="comment-container">
    <div class="comment-header">
      <h1>{{ total }} {{ $t('message.comtCount') }}</h1>
      <h2 class="clearfix">
        <ul>
          <li @click="changeOrder('byTime')" :class="{ active: order == 'byTime' }">按时间</li>
          <li>|</li>
          <li @click="changeOrder('byLikes')" :class="{ active: order == 'byLikes' }">按热度</li>
        </ul>
      </h2>
    </div>

    <!-- 提交评论 -->
    <el-form ref="form" :model="form" label-width="80px" :inline="true" class="comment-send">
      <el-form-item>
        <div class="avatar-frame avatar-container">
          <img :src="avatar" class="avatar">
        </div>
      </el-form-item>

      <el-form-item>
        <el-input type="textarea" rows="3" v-model="form.comment" :placeholder="placeholder" class="comment-input">
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" class="comment-submit" @click="sendComment('comment')">{{ $t('message.send') }}<br />{{
          $t('message.comt')
        }}</el-button>
      </el-form-item>
    </el-form>

    <!-- 展示评论 -->
    <el-table :data="comments" class="comment-show">
      <el-table-column prop="" label="" width="width">
        <el-divider></el-divider>
        <template slot-scope="{ row }">
          <div class="comment-wrapper">
            <div class="avatar-frame avatar-container">
              <router-link :to="`/space/${row.commenter.id}`">
                <img :src="row.commenter.avatar" class="avatar">
              </router-link>
            </div>
            <div class="comment-main">
              <div class="user-info">
                <div class="user-name">
                  <router-link :to="`/space/${row.commenter.id}`" class="commenter-id">{{ row.commenter.name }}</router-link>
                </div>
              </div>
              <div class="reply-root">
                <div class="reply-content">
                  {{ row.commentText }}
                </div>
                <div class="reply-info">
                  <span class="sub-reply-time">{{ row.createTime }}</span>
                  <span class="sub-reply-like">
                    <span v-if="!row.liked" class="iconfont icon-dianzan1" @click="handleLikeComment(row.id)"></span>
                    <span v-else class="iconfont icon-dianzan2 liked" @click="handleLikeComment(row.id)"></span>
                    <span class="likes-num">{{ row.likes }}</span>
                  </span>
                  <span class="sub-reply-btn" @click=handleReplyCommment(row,row.id)>回复</span>

                  <span class="sub-delete-btn" v-if="userId == row.commenter.id" @click="handleDeleteComment(row)">删除</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 子回复 -->
          <div class="sub-reply-container" v-show="row.children">
            <el-table :data="row.children" style="width: 100%" :show-header="false" class="sub-reply-list">
              <el-table-column prop="" label="" width="width">
                <template slot-scope="scope">
                  <!-- {{ scope.row }} -->
                  <div  class="sub-comment-wrapper">
                    <div class="sub-avatar-frame avatar-container">
                      <router-link :to="`/space/${scope.row.commenter.id}`"><img :src="scope.row.commenter.avatar" class="avatar"></router-link>
                      
                    </div>
                    <div class="sub-comment-main">
                      <div class="sub-user-info">
                        <div class="sub-user-name">
                          <router-link :to="`/space/${scope.row.commenter.id}`" class="commenter-id">{{ scope.row.commenter.name }}</router-link>
                          </div>
                      </div>
                      <div class="sub-reply-root">
                        <span class="sub-reply-content">
                          <span v-if="scope.row.father">回复
                            <a class="jump-link">@{{ scope.row.father.name }}</a>:
                          </span>
                          {{ scope.row.commentText }}
                        </span>
                        <div class="sub-reply-info">
                          <span class="sub-reply-time">{{ scope.row.createTime }}</span>
                          <span class="sub-reply-like">
                            <span v-if="!scope.row.liked" class="iconfont icon-dianzan1"
                              @click="handleLikeComment(scope.row.id)"></span>
                            <span v-else class="iconfont icon-dianzan2 liked" @click="handleLikeComment(scope.row.id)"></span>
                            <span class="likes-num">{{ scope.row.likes }}</span>
                          </span>
                          <span class="sub-reply-btn" @click=handleReplyCommment(scope.row,row.id)>回复</span>

                          <span class="sub-delete-btn" v-if="userId == scope.row.commenter.id" @click="handleDeleteComment(scope.row)">删除</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="send-reply-container" v-show="row.id === replyPid">
            <!-- 回复别人 -->
            <el-form ref="form" :model="form" label-width="80px" :inline="true" class="sub-comment-send">
              <el-form-item>
                <div class="sub-avatar-frame avatar-container">
                  <img :src="avatar" class="avatar">
                </div>
              </el-form-item>

              <el-form-item>
                <el-input type="textarea" rows="3" v-model="form.reply" :placeholder="replyPlaceholder"
                  class="comment-input">
                </el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" class="comment-submit" @click="sendComment('reply')">{{ $t('message.send')
                }}<br />{{
  $t('message.comt')
}}</el-button>
              </el-form-item>
            </el-form>
          </div>


        </template>
      </el-table-column>
    </el-table>


  </div>
</template>

<script>
import { mapState } from 'vuex'


export default {
  name: "Comments",
  data() {
    return {
      placeholder: '简单说点儿什么...',
      replyPlaceholder: '简单说点儿什么...',
      avatar: localStorage.getItem('avatar'),
      replyPid:null,
      userId:localStorage.getItem('id'),
      form: {
        comment: "",
        reply:'',
        parentId: null
      },
      order: 'byTime',
      formVisible: false,
    };
  },
  methods: {
    async sendComment(type) {
      // 整理数据
      const { comment, parentId,reply } = this.form;
      //  为空不许提交
      let data = {
        articleId: this.$route.query.articleId,
      };

      if (type === 'reply') {
        data = { ...data, parentId,commentText:reply }
      }else{
        data = {...data,commentText:comment}
      }
      if(data.commentText.trim() === ''){
        this.$message.warning('输入不能为空')
        return
      }

      const result = await this.$store.dispatch("comment/sendComment", data);
      if (result) {
        this.$message.success('评论成功')
        this.getComment()
      } else {
        this.$message.error('评论失败')
      }
      this.form.comment = "";
      this.form.reply = ""
      this.replyPid=null
    },

    getComment() {
      const data = { articleId: this.$route.query.articleId, order: this.order }
      this.$store.dispatch('comment/getComment', data)
    },

    changeOrder(order) {
      if (this.order == order) return
      this.order = order
      this.getComment()
    },
    async handleLikeComment(commentId) {
      const result = await this.$store.dispatch('comment/likeComment', commentId)
      if (result.code === 200) {
        this.getComment()
      } else {
        this.$message.warning('点赞失败 ', result.msg)
      }
    },
    handleReplyCommment(row,pid) {




      // 修改 parentId
      this.replyPid = pid
      const { id, commenter } = row
      this.form.parentId = id
      this.replyPlaceholder = '回复 @' + commenter.name + ":"
    },
     handleDeleteComment(row){
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
      .then(async() => {
        const result = await this.$store.dispatch('comment/deleteComment',row.id)
          if(result.code === 200){
            this.$message.success('删除成功')
            this.getComment()
          }else{
            this.$message.warning('删除失败 ', result.msg)
          }
      })
      .catch(() => {
        // 用户点击了取消按钮
      });

     
    }
  },

  computed: {
    ...mapState('comment', ['comments', 'total'])
  },
  mounted() {
    //   获取评论
    const data = { articleId: this.$route.query.articleId, order: this.order }
    this.$store.dispatch('comment/getComment', data)
  },
};
</script>

<style lang="less" scoped>
.comment-container {
  padding: 0px 30px;
  height: 1000px;
  background-color: white;

  .comment-header {
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

  .comment-send {

    //   border-bottom: 1px solid #e5e9ef;

    .avatar-frame {
      width: 70px;
      /* 设置框的宽度 */
      height: 70px;
      /* 设置框的高度 */
      border: 2px solid #333;
      /* 设置边框样式 */
      border-radius: 50%;
      /* 使框成为圆形 */
      overflow: hidden;

      /* 隐藏超出边框的内容 */
      img {
        width: 100%;
        /* 让头像图像填充整个框 */
        height: 100%;
        /* 让头像图像填充整个框 */
        object-fit: cover;
        /* 保持图像比例并填充整个框 */
      }
    }

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

  .comment-show {
    width: 100%;

    .comment-wrapper {
      // background-color: red;
      position: relative;

      .avatar-frame {
        position: absolute;
        display: inline-block;
        width: 60px;
        /* 设置框的宽度 */
        height: 60px;
        /* 设置框的高度 */
        border: 2px solid #333;
        /* 设置边框样式 */
        border-radius: 50%;
        margin-top: 20px;
        /* 使框成为圆形 */
        overflow: hidden;

        /* 隐藏超出边框的内容 */
        img {
          width: 100%;
          /* 让头像图像填充整个框 */
          height: 100%;
          /* 让头像图像填充整个框 */
          object-fit: cover;
          /* 保持图像比例并填充整个框 */
        }
      }

      .comment-main {
        // background-color: blue;
        position: relative;
        height: 100px;
        display: inline-block;
        margin-left: 80px;
        //   height: 200px;
        width: 650px;
        // background-color: #ebf1fb;

        .user-info {
          // position: absolute;
          width: 100%;
          // background-color: yellow;
          margin-top: 30px;
          height: 30px;


          .user-name {
            color: #fb7229;
            font: 15px "Microsoft Yahei";
            margin: 0px 5px 0px 0px;

            .commenter-id{
              text-decoration: none; 
              color:#fb7229;
            }
          }
        }

        .reply-root {
          width: 100%;
          padding: 2px 0px;
          // background-color: gray;

          .reply-content {
            // background-color:green;
            color: #18191c;
            padding-left: 2px;
          }

          .reply-info {
            // background-color: brown;
            color: #9499a0;
            font-size: 13px;

            .sub-reply-time {}

            .sub-reply-like {
              margin-left: 20px;
              cursor: pointer;
              /* 设置鼠标指针样式为小手 */

              .liked {
                color: #4eabe6;
              }

              .likes-num {
                margin-left: 5px;
              }
            }

            .sub-reply-btn {
              margin-left: 20px;
              cursor: pointer;
              /* 设置鼠标指针样式为小手 */
            }

            .sub-delete-btn{
                float: right;
                cursor: pointer;
              }


          }
        }

      }
    }


    .sub-reply-container {
      background-color: red;
      margin-left: 70px;

      .sub-comment-wrapper {
        // background-color: red;
        position: relative;

        .sub-avatar-frame {
          position: absolute;
          display: inline-block;
          width: 36px;
          /* 设置框的宽度 */
          height: 36px;
          /* 设置框的高度 */
          border: 2px solid #333;
          /* 设置边框样式 */
          border-radius: 50%;
          margin-top: 20px;
          /* 使框成为圆形 */
          overflow: hidden;

          /* 隐藏超出边框的内容 */
          img {
            width: 100%;
            /* 让头像图像填充整个框 */
            height: 100%;
            /* 让头像图像填充整个框 */
            object-fit: cover;
            /* 保持图像比例并填充整个框 */
          }
        }

        .sub-comment-main {
          // background-color: blue;
          position: relative;
          height: 100px;
          display: inline-block;
          margin-left: 50px;
          //   height: 200px;
          width: 800px;
          // background-color: #ebf1fb;

          .sub-user-info {
            // position: absolute;
            // width: 100%;
            // background-color: yellow;
            margin-top: 30px;
            height: 15px;
            float: left;
            margin-right: 10px;

            .sub-user-name {
              color: #fb7229;
              font: 15px "Microsoft Yahei";
              margin: 0px 5px 0px 0px;

              .commenter-id{
              text-decoration: none; 
              color:#fb7229;
            }
            }
          }

          .sub-reply-root {
            width: 100%;
            padding-right: 200px;
            // background-color: gray;
            margin-top: 30px;

            .sub-reply-content {
              // background-color:green;
              margin-top: 30px;
              color: #18191c;
              padding-left: 2px;
              overflow: hidden;

              .jump-link {
                color: #458ec3;
                cursor: pointer;
              }

            }

            .sub-reply-info {
              // background-color: brown;
              color: #9499a0;
              font-size: 13px;
              width: 100%;

              .sub-reply-like {
                margin-left: 20px;
                cursor: pointer;
                /* 设置鼠标指针样式为小手 */

                .liked {
                  color: #4eabe6;
                }

                .likes-num {
                  margin-left: 5px;
                }
              }

              .sub-reply-btn {
                margin-left: 20px;
                cursor: pointer;
                /* 设置鼠标指针样式为小手 */
              }

              .sub-delete-btn{
                float: right;
                cursor: pointer;
              }
            }
          }

        }
      }
      
    }

    .send-reply-container {
      margin-left: 80px;

      .sub-comment-send {
        .sub-avatar-frame {
          width: 46px;
          /* 设置框的宽度 */
          height: 46px;
          /* 设置框的高度 */
          border: 2px solid #333;
          /* 设置边框样式 */
          border-radius: 50%;
          /* 使框成为圆形 */
          overflow: hidden;

          /* 隐藏超出边框的内容 */
          img {
            width: 100%;
            /* 让头像图像填充整个框 */
            height: 100%;
            /* 让头像图像填充整个框 */
            object-fit: cover;
            /* 保持图像比例并填充整个框 */
          }
        }

        .comment-input {
          width: 630px;
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

    }

  }
}
</style>