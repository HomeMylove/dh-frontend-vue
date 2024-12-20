<template>
  <div class="profile">
    <div class="h">
      <div class="wrapper">
        <div class="h-info">
          <div class="avatar-container">
            <el-upload class="avatar-uploader" action="#" :disabled="!isHome" :show-file-list="false"
                       :before-upload="beforeAvatarUpload">
              <el-avatar v-if="user.avatar" :src="user.avatar" class="avatar"></el-avatar>
              <el-avatar v-else class="avatar">
                <div class="no-avatar">
                  <!-- {{ user.username.substring(2,6) }} -->
                </div>
              </el-avatar>

              <div class="avatar-cover" v-if="isHome">
                <i class="el-icon-plus avatar-uploader-icon">
                </i>
              </div>
            </el-upload>
          </div>
          <div class="h-basic">
            <span class="h-name">{{ user.username }}</span>
            <span class="h-gender">
              <i v-if="user.gender === 1" class="icon-gender iconfont icon-nan"></i>
              <i v-else class="icon-gender iconfont icon-nv"></i>
            </span>
            <h4 class="h h-sign">{{ user.signature }}</h4>
            <input v-if="isHome" v-model="editForm.signature" @blur="handleUpdateSignature" @focus="handleEditSignature"
                   class="h h-sign-input" :class="{ typing }"/>
          </div>
        </div>
      </div>

    </div>
    <div class="navigator">
      <div class="wrapper">
        <div class="n-inner">
          <el-tabs class="n-tabs" v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="" name="favorite">
              <span slot="label">
                <i class="tab-icon iconfont icon-shoucangxiao"></i>
                <span class="tab-text">收藏</span>
              </span>
            </el-tab-pane>
            <el-tab-pane label="" name="upload">
              <span slot="label"><i class="tab-icon iconfont icon-yunshangchuan"></i>
                <span class="tab-text">上传</span>
              </span>
            </el-tab-pane>
            <el-tab-pane label="" name="settings" v-if="isHome">
              <span slot="label"><i class="tab-icon iconfont icon-shezhi"></i>
                <span class="tab-text">设置</span>
              </span>
            </el-tab-pane>
            <!-- <el-tab-pane label="角色管理" name="third"></el-tab-pane> -->
            <!-- <el-tab-pane label="定时任务补偿" name="fourth"></el-tab-pane> -->
          </el-tabs>
        </div>
        <div class="logout-btn" v-if="isHome">
          <i class="iconfont icon-exit-full" @click="handleLogout"></i>
        </div>


      </div>
    </div>
    <div class="s-space">
      <router-view name="space"></router-view>
    </div>
  </div>
</template>
<script>

import {reqUploadAvatar, reqUpdateUserInfo} from '../../api/index'
import {mapState} from 'vuex';

export default {
  data() {
    return {
      activeName: 'favorite',
      editForm: {
        username: '',
        signature: ''
      },
      spaceId: 0,
      typing: false
    };
  },

  async mounted() {
    //    从路由拿值
    const {id} = this.$route.params

    if(id === 'null'){
      await this.$router.push('/login')
      return
    }
    this.spaceId = id
    await this.getUserInfo(id)
    await this.$router.push(`/space/${id}/favorite`)
  },
  watch: {
    async '$route'(to, from) {
      // 当路由发生变化时，触发这个函数
      // 你可以在这里处理路由变化的逻辑
      const id = this.$route.params.id
      if (id === this.spaceId) return
      this.spaceId = id
      await this.getUserInfo(id)
      await this.$router.push(`/space/${id}/favorite`)
    }
  },

  computed: {
    ...mapState('user', ['user']),
    isHome() {
      const id = localStorage.getItem('id')
      return id === this.spaceId
    }
  },

  methods: {
    handleClick(tab, event) {
      const {activeName, spaceId} = this
      this.$router.push(`/space/${spaceId}/${activeName}`)
    },
    handleEditSignature() {
      this.typing = true
      this.editForm.signature = this.user.signature
    },
    async handleUpdateSignature() {
      const {signature} = this.editForm
      const {code} = await reqUpdateUserInfo({signature})
      if (code === 200) {
        this.getUserInfo(this.spaceId)
      }
      this.typing = false
    },
    async beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
        return false
      }

      // 使用自定义 Axios 实例上传文件
      const formData = new FormData();
      formData.append('file', file);

      const result = await reqUploadAvatar(formData)
      if (result.code === 200) {
        const avatar = result.data
        localStorage.setItem('avatar', avatar)
        // 更新数据库
        this.$store.dispatch('user/updateUserInfo', {avatar})

      } else {
        this.$message.error('失败' + result.msg)
      }
      return false;
    },
    async getUserInfo(id) {
      await this.$store.dispatch('user/getUserInfo', id)
    },
    /**
     * 退出，清除 token 等
     */
    handleLogout() {
      this.$confirm('确认退出登陆吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$store.dispatch('user/logout')
        this.$bus.$emit('setSpaceId',null)
        await this.$router.push('/login')
      })

    }
  }

};
</script>

<style lang="less" scoped>
.profile {
  // background-color: red;
  // background: linear-gradient(to right, #ff7e5f, #feb47b);
  margin-top: -50px;

  .h {
    position: relative;
    width: 100%;
    height: 190px;

    .wrapper {
      width: 100%;
      height: 100%;
      background: url('/img/bg_cat.png');
      background-size: cover;
      background-position: center;

      // border: 2px solid red;
      .h-info {
        position: absolute;
        left: 0px;
        bottom: 0px;

        .avatar-container {
          position: absolute;
          height: 100px;
          width: 100px;
          bottom: 10px;
          left: 10px;
          border: 2px soild #a8a9b4;
          box-sizing: border-box;
          overflow: hidden;
          border-radius: 50%;

          .avatar,
          .avatar-cover {
            position: absolute;
            height: 100%;
            width: 100%;
            left: 0;
            bottom: 0;

            .no-avatar {
              position: absolute;
              left: 10%;
              top: 50%;
              transform: translateX(50%);
              transform: translateY(-50%);
              font-size: 40px;
            }

          }


          .avatar-cover {
            transition: opacity 0.3s ease-in-out;
            opacity: 0;
            background-color: rgba(0, 0, 0, .5);

            .el-icon-plus {
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translateX(-50%) translateY(-50%);
            }
          }


        }

        .avatar-container:hover {
          .avatar-cover {
            opacity: 1;
          }
        }

        .h-basic {
          position: absolute;
          left: 120px;
          bottom: 10px;
          height: 100px;
          width: 820px;
          padding-left: 20px;
          // background-color: red;

          .h-name {
            font-size: 30px;
            font-family: PingFang SC, Helvetica Neue, Microsoft YaHei, sans-serif;
            color: #fff;
          }

          .h-gender {
            padding-left: 10px;

            .icon-gender {
              font-size: 28px;
              font-weight: bold;
            }

            .icon-nan {
              color: #0f3ca6;
            }

            .icon-nv {
              color: #da798a;
            }
          }

          .h {
            background: transparent;
            border-radius: 4px;
            border: none;
            box-shadow: none;
            // color: hsla(0,0%,100%,8);
            color: #e0e8e4;
            font-size: 15px;
            font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            line-height: 26px;
            height: 26px;
            font-weight: 400;
            position: absolute;
            bottom: 0;
          }

          .h-sign {
            left: 18px;
          }

          .h-sign-input {
            outline: none;
            box-sizing: content-box;
            width: 740px;
            bottom: 19px;
            left: 10px;
            padding-left: 8px;
          }

          .h-sign-input:hover {
            left: 9px;
            bottom: 18px;
            background-color: rgba(255, 255, 255, .2);
            border: 1px solid #bdaab6;
          }

          .typing {
            background-color: #fff !important;
            color: #70777b;
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
          }
        }


      }

    }
  }

  .navigator {
    margin-top: 20px;
    width: 100%;
    height: 60px;
    position: relative;

    // background-color: red;
    .wrapper {
      .n-inner {

        .n-tabs::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 20px;
          width: 100%;
          height: 2px;
          background-color: #e4e7e4;
        }

        .n-tabs {
          margin-left: 20px;
          width: 400px;

          .tab-icon {
            margin-right: 10px;
            font-size: 20px;
          }

          .icon-shoucangxiao {
            color: #e7a44c;
          }

          .icon-yunshangchuan {
            color: #ea7a99;
          }

          .icon-shezhi {
            color: #56bd94;
          }

          .tab-text {
            font-size: 20px;
          }

        }
      }

      .logout-btn {
        position: absolute;
        right: 10px;
        top: 0px;
        cursor: pointer;

        .icon-exit-full {
          font-size: 20px;
          color: #51b2d6;
        }
      }
    }
  }

}
</style>
