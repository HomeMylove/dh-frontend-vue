import {
    reqGetAuthor,
    reqGetArticle,
    reqGetAuthorHint,
    reqGetArticleHint,
    reqSaveSearchHistory,
    reqGetSearchHistory,
    reqDeleteSearchHistory
} from '@/api/index'

const state = {
    data: [],
    size: 0,
    hints: [],
    history: {
        authors: [],
        articles: []
    }
}
const mutations = {
    GETINFO(state, info) {
        state.data = info.data
        state.size = info.size
    },
    RESET() {
        state.data = []
        state.size = 0
    },
    GETHINTS(state, data) {
        state.hints = data
    },
    GETHISTORY(state, data) {
        state.history = data
    }
}
const actions = {
    async getInfo({ commit }, { choice, keyword, pageSize, pageNum }) {
        let result;

        if (choice === 'author') {
            result = await reqGetAuthor(keyword, { pageNum, pageSize })
            await reqSaveSearchHistory(choice, keyword)
        } else {
            result = await reqGetArticle(keyword, { pageNum, pageSize })
            await reqSaveSearchHistory(choice, keyword)
        }
        if (result.code == 200) {
            commit("GETINFO", result.data)
        }
    },
    async saveSearchHistory({commit},{choice, keyword}){
        await reqSaveSearchHistory(choice, keyword)
    },
    reset({ commit }) {
        commit("RESET")
    },
    async getHint({ commit }, { choice, hint }) {
        if (hint == '') {
            commit('GETHINTS', [])
            return
        }
        let result
        if (choice == 'author') {
            result = await reqGetAuthorHint(hint)
        } else {
            result = await reqGetArticleHint(hint)
        }
        if (result.code == 200) {
            commit("GETHINTS", result.data)
        }
    },
    async getSearchHistory({ commit }) {
        const r1 = await reqGetSearchHistory('author')
        const authors = r1.code === 200 ? r1.data : []
        const r2 = await reqGetSearchHistory('article')
        const articles = r2.code === 200 ? r2.data : []
        commit('GETHISTORY', { authors, articles })
    },
    async deleteSearchHistory({commit},data){
        const result = await reqDeleteSearchHistory(data)
        return result.code === 200
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