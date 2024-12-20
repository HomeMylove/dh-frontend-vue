import { reqGetAuthorInfo } from '@/api/index'


const state = {
    authorInfo: {}
}
const mutations = {
    GETAUTHORINFO(state, authorInfo) {
        state.authorInfo = authorInfo
    }
}
const actions = {
    async getAuthorInfo({ commit }, authorId) {

        const result = await reqGetAuthorInfo(authorId)

        if (result.code == 200) {
            commit('GETAUTHORINFO', result.data)
        } else {
            console.log('failed to get authorinfo');
        }
    }
}
const getters = {
    articles(state) {
        return state.authorInfo.articles
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}