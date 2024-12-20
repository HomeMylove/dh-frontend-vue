import { reqSendDiscussion, reqGetDiscussion } from '@/api/index'

const state = {
    discussions: []
}
const mutations = {
    GETDISCUSSION(state, discussions) {
        state.discussions = discussions
    }
}
const actions = {
    async sendDiscussion({ commit }, data) {
        const result = await reqSendDiscussion(data)
        if (result.status == 200) {
            return result.data
        } else {
            return Promise.reject(new Error(result.message))
        }
    },

    async getDiscussion({ commit }, data) {
        const { keyword, order } = data
        const result = await reqGetDiscussion(keyword, order)
        if (result.status == 200) {
            commit('GETDISCUSSION', result.data)
        }
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