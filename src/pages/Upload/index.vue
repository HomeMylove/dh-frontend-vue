<template>
  <div class="upload-container">
    <div class="upload-choice">
      <el-button :type="uploadMode == 0 ? 'primary' : ''" @click="changeMode(0)" round>{{
        $t("message.uploadAuthor")
      }}</el-button>
      <el-button :type="uploadMode == 1 ? 'primary' : ''" @click="changeMode(1)" round>{{
        $t("message.uploadWork")
      }}</el-button>
    </div>

    <!-- 上传作者 -->
    <div class="upload-author" v-show="uploadMode == 0">
      <el-form ref="form" :model="formAuthor" label-width="120px">
        <el-form-item :label="$t('message.authorName')">
          <el-input
            type="text"
            v-model="formAuthor.kanjiName"
            @input="checkAuthorName(formAuthor.kanjiName, 'kanji')"
            class="author-input"
            :class="{ warning: kanjiNameExists }"
          ></el-input>
        </el-form-item>
        <el-form-item label="假名">
          <el-input
            type="text"
            v-model="formAuthor.kanaName"
            @input="checkAuthorName(formAuthor.kanaName, 'kana')"
            class="author-input"
            :class="{ warning: kanaNameExists }"
          ></el-input>
        </el-form-item>
        <el-form-item label="罗马字">
          <el-input
            type="text"
            v-model="formAuthor.romanName"
            @input="checkAuthorName(formAuthor.romanName, 'roman')"
            class="author-input"
            :class="{ warning: romanNameExists }"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('message.introduction')">
          <el-input type="textarea" v-model="formAuthor.about" rows="6"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="uploadAuthor">{{
            $t("message.submit")
          }}</el-button>
          <el-button @click="resetAuthorForm">{{ $t("message.reset") }}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="upload-article" v-show="uploadMode == 1">
      <el-form ref="form" :model="formArticle" label-width="120px">
        <el-form-item :label="$t('message.authorName')" class="upload-article-author">
          <el-input
            type="text"
            v-model="formArticle.authorName"
            @input="handleInput"
            class="author-input"
            :class="{ warning: authorId == -1 }"
          ></el-input>

          <div class="hint-keyword" v-if="showHint" style="z-index: 1">
            <div class="hint-list">
              <template>
                <el-table :show-header="false" :data="hints" style="width: 100%">
                  <el-table-column prop="" label="姓名">
                    <template slot-scope="{ row }">
                      <div class="hint-line" @click="setArticleTitle(row)">
                        {{ row.name }}
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </template>
            </div>
          </div>
        </el-form-item>
        <el-form-item :label="$t('message.title')">
          <el-input v-model="formArticle.title"> </el-input>
        </el-form-item>

        <el-form-item :label="$t('message.mainText')">
          <el-input type="textarea"
          placeholder="将文本粘贴至此处或上传文件"
          v-model="formArticle.text" rows="6"></el-input>
        </el-form-item>

        <el-form-item label="选择文件">
          <el-upload
            ref="upload"
            action="#"
            :before-upload="beforeUpload"
            :on-exceed="handleOnExceed"
            :multiple="false"
            :limit="1"
          >
            <el-button
              slot="trigger"
              size="small"
              type="primary"
              :disabled="formArticle.text.length > 0"
              >选取文件</el-button
            >
            <div slot="tip" class="el-upload__tip">上传.txt文件</div>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="uploadArticle">{{
            $t("message.submit")
          }}</el-button>
          <el-button @click="resetArticleForm">{{ $t("message.reset") }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {reqArticleExists } from '@/api/index'

export default {
  name: "Upload",
  data() {
    return {
      formAuthor: {
        kanjiName: "",
        kanaName: "",
        romanName: "",
        about: "",
      },
      kanjiNameExists: false,
      kanaNameExists: false,
      romanNameExists: false,
      formArticle: {
        authorId: "",
        authorName: "",
        title: "",
        text: "",
      },
      file: null,
      uploadMode: 0,
      nameExist: false,
      authorId: -1,

      hintword: "",
      hintinput: "",
      hint: "",
      showHint: false,
    };
  },
  computed: {
    ...mapState("search", ["hints"]),
  },
  methods: {
    setArticleTitle(row) {
      const { id, name } = row;
      this.formArticle.authorId = id;
      this.formArticle.authorName = name;
      this.showHint = false;
    },
    async handleInput(word) {
      let hint = word.trim();
      this.hint = hint;
      if (hint === "") {
        this.showHint = false;
        return;
      }

      await this.$store.dispatch("search/getHint", {
        choice: "author",
        hint,
      });
      this.setShowHint();
    },
    setShowHint() {
      this.showHint = this.hints.length > 0;
    },
    /**
     * 上传作者
     */
    async uploadAuthor() {
      let { kanjiName, kanaName, romanName, about } = this.formAuthor;
      const { kanjiNameExists, kanaNameExists, romanNameExists } = this;
      kanjiName = kanjiName.trim();
      kanaName = kanaName.trim();
      romanName = romanName.trim();
      about = about.trim();
      // 至少 kanji name 不能为空
      if (!kanjiName) {
        return this.$message({
          message: "至少要填写作者名",
          type: "warning",
        });
      }
      if (kanaNameExists || kanjiNameExists || romanNameExists) {
        return this.$message({
          message: "作者名已存在",
          type: "warning",
        });
      }
      const { code, msg } = await this.$store.dispatch("upload/uploadAuthor", {
        kanjiName,
        kanaName,
        romanName,
        about,
      });
      if (code === 200) {
        this.$message.success("上传成功");
      } else {
        this.$message.warning("上传失败" + msg);
      }
      this.resetAuthorForm();
    },
    resetAuthorForm() {
      this.formAuthor = {
        kanjiName: "",
        kanaName: "",
        romanName: "",
        about: "",
      };
    },

    /**
     * 检查作者名是否存在，存在返回 true 并警告
     */
    async checkAuthorName(name, type) {
      try {
        const result = await this.$store.dispatch("upload/checkAuthorName", name.trim());
        // true 表示存在
        this[type + "NameExists"] = result;

        if (result) {
          this.$message({
            message: "作者已存在",
            type: "warning",
          });
        }
      } catch (error) {
        console.log(error);
      }
    },

    changeMode(num) {
      this.resetAuthorForm();
      this.resetArticleForm();
      this.uploadMode = num;
    },
    async getAuthorId() {
      // 获取作者id
      const { authorName } = this.formArticle;
      try {
        return await this.$store.dispatch("upload/getAuthorId", authorName.trim());
      } catch (error) {
        console.log(error);
      }
    },
    async uploadArticle() {
      let { title, text, authorId, authorName } = this.formArticle;
      // 如果没有 id 就去获取
      if (authorName == "") {
        this.$message.warning("请输入作者名");
        return;
      }
      if (authorId == "" || authorId == null) {
        authorId = await this.getAuthorId();
        if (authorId == null || authorId == -1) {
          this.$message.warning("作者不存在");
          return;
        }
      }
      const exists = await reqArticleExists({authorId,title})
      if(exists.data){
        this.$message.warning('作品已存在')
        return 
      }

      const { file } = this;
      // 保存文章，然后写入数据库
      // 有 text 用 text
      const data = {
        authorId,
        title,
      };
      let result;
      if (text.length > 0) {
        result = await this.$store.dispatch("upload/uploadTextArticle", {
          ...data,
          text,
        });
      } else {
        // 用 file
        if (file == null) {
          this.$message.warning("复制文本或上传文件");
          return;
        }
        const formData = new FormData();
        formData.append("file", file);
        result = await this.$store.dispatch("upload/uploadTextArticle", {
          ...data,
          file: formData,
        });
      }
      const { code, msg } = result;
      if (code != 200) {
        this.$message.warning(msg);
        return;
      }

      const r = await this.$store.dispatch("upload/uploadArticle", {
       ...data,
       path:msg
      });
      if(r.code==200){
        this.$message.success(r.msg)
      }else{
        this.$message.error(r.msg)
      }
      this.resetArticleForm()
    },

    resetArticleForm() {
      this.formArticle = {
        authorId: "",
        authorName: "",
        title: "",
        text: "",
      };
      this.file = null
    },
    handleOnExceed(file, fileList) {
      fileList.shift();
      fileList.push(file);
    },
    beforeUpload(file) {
      const validExtensions = ["txt"];
      const fileExtension = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2);
      if (!validExtensions.includes(fileExtension.toLowerCase())) {
        this.$message.error("只能上传.txt文件");
        return false;
      }
      this.file = file;
      return false;
    },

    // 确定上传
    async upload() {
      console.log("abc");
      return;

      console.log("this.fileList", this.fileList);
      // 如果上传的文件列表是空的，给出提示
      if (this.fileList.length === 0) {
        return this.$message.warning("请先选择要上传的文件");
      }
      let file = this.fileList[0];
      console.log(file, "file");
      // 获取到文件的后缀以便于判断文件类型
      if (file.name.indexOf("xlsx") == -1 || file.name.indexOf("xls") == -1) {
        this.$message({
          message: "请选择xlsx、xls格式文件",
          type: "warning",
        });
        return;
      }
      // 把文件转成FormData格式上传
      let dataFile = new FormData();
      dataFile.append("file", this.fileList[0]);
      dataFile.append("token", localStorage.getItem("logintoken"));
      try {
        const res = await GoodsUpload(dataFile);
        if (res.success) {
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      } catch (e) {
        console.log(e);
        this.$message.error("文件上传失败");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.upload-container {
  height: 1000px;
  //   background-color: gray;
  padding: 30px 200px;

  .upload-choice {
    text-align: center;
    margin-bottom: 40px;
  }

  .upload-author {
    .author-input {
      border: 1px transparent solid;
      border-radius: 3px;
    }

    .warning {
      border: 1px red solid;
      border-radius: 3px;
    }
  }
  .upload-article {
    .upload-article-author {
      position: relative;

      .author-input {
        border: 1px transparent solid;
        border-radius: 3px;
        position: relative;
      }

      .hint-keyword {
        position: absolute;
        // background-color: red;
        width: 440px;
        // left: 20px;
        border: 2px solid #5670ea;
        box-sizing: border-box;
        // height: 300px;
        border-radius: 4px;

        .hint-list {
          .hint-line {
            padding-left: 20px;
            cursor: pointer;
          }

          .hint-line:hover {
            color: #3c5df2;
          }
        }
      }
    }

    .warning {
      border: 1px red solid;
      border-radius: 3px;
    }
  }
}
</style>
