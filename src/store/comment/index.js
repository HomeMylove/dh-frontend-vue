import { reqSendComment, reqGetComment,reqLikeComment ,reqDeleteComment} from '@/api/index'


const state = {
    comments: [],
    total:0
}
const mutations = {
    GETCOMMENT(state, {data,size}) {
        state.comments = data
        state.total = size
    }

}
const actions = {
    async sendComment({ commit }, data) {
        const result = await reqSendComment(data)
        return result.code == 200
    },

    async getComment({ commit }, data) {
        const { articleId, order } = data
        const result = await reqGetComment(articleId, order)
        if (result.code == 200) {
            commit('GETCOMMENT', result.data)
        } else {
            return Promise.reject(new Error('failed'))
        }
    },

    async likeComment({commit},commentId){
        return await reqLikeComment(commentId)
    },

    async deleteComment({commit},id){
        return await reqDeleteComment(id)
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