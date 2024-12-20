import { reqUploadAuthor,reqGetUploadHistory, reqCheckAuthorName, reqUploadArticleToDB, reqUploadArticle,reqUploadTextArticle,reqUploadFileArticle,reqGetAuthorIdByName } from '@/api/index'

const state = {
    uploadHistory:[],
    size:0
}
const mutations = {
    GETUPLOADHISTORY(state,{data,size}){
        state.uploadHistory = data
        state.size = size
    }

}
const actions = {
    async uploadAuthor({ commit }, data) {
        return await reqUploadAuthor(data)
    },
    async getUploadHistory({commit},{spaceId,choice,query}){
        const {data,code} = await reqGetUploadHistory({
            choice,
            spaceId,
            data:query
        })
        if(code === 200){
            commit('GETUPLOADHISTORY',data)
        }
    },

    /**
     * 检查作家名存不存在
     */
    async checkAuthorName({ commit }, name) {
        const {code,data} = await reqCheckAuthorName(name)
        if (code === 200) {
            return data
        } else {
            return Promise.reject(new Error('Fail to check author name'))
        }
    },
    async getAuthorId({ commit }, name) {
        const result = await reqGetAuthorIdByName(name)
        if (result.code == 200) {
            return result.data
        } else {
            return Promise.reject(new Error('failed to get author id'))
        }
    },

    async uploadTextArticle({commit},data){
        let {file} = data
        let result;
        if(file == undefined){
            result = await reqUploadTextArticle(data)
        }else{
            result = await reqUploadFileArticle(data)
        }
        return result;
    },


    // 上传文章
    async uploadArticle({ commit }, data) {
        return await reqUploadArticleToDB(data)
    }

}
const getters = {}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}