<template>
    <div class="upload">
        <div class="upload-list">
            <div class="nav-title">我的上传</div>
            <div class="upload-ul">
                <ul>
                    <li v-for="item, index in uploadItems" class="upload-item" :key="index"
                        :class="{ active: activeLi == index }" @click="getUploadItem(item.choice, index)"
                        @mouseover="curLi = index" @mouseleave="curLi = -1"><i class="iconfont icon-shoucangjia"></i>
                        <span class="upload-item-name">{{ item.label }}</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="fav-container" v-loading="loading" element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading">

            <el-table v-if="choice === 'author'" :data="uploadHistory" style="width: 760px">
                <el-table-column label="作者名" prop="">
                    <template slot-scope="{ row }">

                        <router-link :to="`/details/?authorId=${row.id}`" :style="{ 'text-decoration': 'none' }">{{
                            row.name }}</router-link>
                    </template>
                </el-table-column>
                <el-table-column label="上传于" prop="createTime"> </el-table-column>
                <el-table-column label="" prop="" width="50">
                    <template slot-scope="{ row }">
                        <span v-if="row.deletable" @click="handleDeleteUpload(row.id)" class="iconfont icon-shanchu">
                        </span>
                    </template>
                </el-table-column>
            </el-table>

            <el-table v-else-if="choice === 'article'" :data="uploadHistory" style="width: 760px">
                <el-table-column label="作品" prop="">
                    <template slot-scope="{ row }">
                        <router-link :to="`/read/?articleId=${row.id}`" :style="{ 'text-decoration': 'none' }">{{ row.name
                        }}</router-link>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="作者名" prop="">
                    <template slot-scope="{ row }">
                        <router-link :to="`/details/?authorId=${row.id}`" :style="{ 'text-decoration': 'none' }">{{
                            row.name }}</router-link>
                    </template>
                </el-table-column> -->
                <el-table-column label="上传于" prop="createTime"> </el-table-column>
                <el-table-column label="" prop="" width="50">
                    <template slot-scope="{ row }">
                        <span v-if="row.deletable" @click="handleDeleteUpload(row.id)" class="iconfont icon-shanchu">
                        </span>
                    </template>
                </el-table-column>
            </el-table>


            <div class="block">
                <el-pagination @current-change="handleCurrentChange" :current-page="query.pageNum"
                    :page-size="query.pageSize" layout="total, prev, pager, next, jumper" :total="size">
                </el-pagination>
            </div>
        </div>


    </div>
</template>
  
<script>
import { mapState } from "vuex";
import { reqDeleteUploadHistory } from '@/api/index'
export default {
    name: "UploadHistory",
    data() {
        return {
            uploadItems: [{
                choice: 'author',
                label: '作者'
            }, {
                choice: 'article',
                label: '作品'
            }],
            choice: 'author',
            curLi: -1,
            loading: true,
            activeLi: 0,
            spaceId:null,

            query: {
                pageNum: 1,
                pageSize: 10,
            },
        };
    },
    async mounted() {
        const {id} = this.$route.params
        this.spaceId = id
        await this.getUploadHistory()
    },
    methods: {
        async getUploadHistory() {
            const { query, choice,spaceId } = this
            this.loading = true
            await this.$store.dispatch('upload/getUploadHistory', {
                spaceId,
                choice,
                query
            })
            this.loading = false
        },
        async getUploadItem(choice, index) {
            this.activeLi = index
            this.choice = choice
            this.query.pageNum = 1;
            const id = localStorage.getItem('id')
            await this.getUploadHistory(id)
        },
        async handleCurrentChange(page) {
            this.query.pageNum = page;
            const id = localStorage.getItem('id')
            await this.getUploadHistory(id)
        },
        async handleDeleteUpload(id) {
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { choice } = this
                const { code, msg } = await reqDeleteUploadHistory({ choice, id })
                if (code === 200) {
                    this.$message.success(msg)
                    const id = localStorage.getItem('id')
                    await this.getUploadHistory(id)
                } else {
                    throw new Error(msg);
                }
                
            }).catch(msg => {
                this.$message({
                    type: 'info',
                    message: msg
                });
            });

        }


    },
    computed: {
        ...mapState("upload", ["uploadHistory", "size"]),
    },
};
</script>
  
<style lang="less" scoped>
.upload {
    position: relative;
    // margin-top: -50px;
    // background-color:orange;
    height: 600px;
    width: 100%;
    border: 1px solid #eee;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

    .upload-list {
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

        .upload-ul {
            height: 540px;
            overflow: scroll;

            ul {
                margin: 0;
                padding: 0;

                li {
                    list-style-type: none;
                    text-align: center;
                }

                .upload-item {
                    position: relative;
                    height: 44px;
                    padding-left: 30px;
                    display: flex;
                    align-items: center;
                    text-align: center;
                    font-size: 14px;
                    cursor: pointer;


                    .icon-shoucangjia {
                        margin-right: 10px;
                    }

                    .total-upload {
                        position: absolute;
                        top: 10px;
                        right: 15px;
                    }
                }

                .upload-item:hover {
                    background-color: #f4f5f7;

                    .upload-item-name {
                        color: #479fd1;
                    }
                }

                .active {
                    background-color: #479fd1 !important;

                    .upload-item-name {
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
  