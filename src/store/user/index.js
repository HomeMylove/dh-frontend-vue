import { reqRegister, reqLogin, reqGetUserInfo,reqLogout, reqUpdateUserInfo } from '@/api/index'

const state = {
    user: {}
}
const mutations = {
    REGISTER(state) {
    },
    GETUSERINFO(state, user) {
        state.user = user
    }
}
const actions = {
    async regisger({ commit }, data) {
        const result = await reqRegister(data)
        return result
    },
    async login({ commit }, data) {
        const result = await reqLogin(data)
        if (result.code === 200) {
            const { token, username, id, avatar } = result.data
            localStorage.setItem("token", token)
            localStorage.setItem('id', id)
            localStorage.setItem('username', username)
            localStorage.setItem('avatar', avatar)
        }
        return result
    },
    async getUserInfo({ commit },id) {
        const result = await reqGetUserInfo(id)
        if (result.code === 200) {
            commit("GETUSERINFO", result.data)
        }
    },

    async updateUserInfo({ commit }, data) {
        const result = await reqUpdateUserInfo(data)
        if (result.code === 200) {
            commit("GETUSERINFO", result.data)
            return true
        }else{
            return false
        }
    },
    async logout() {
        const {code} = await reqLogout()
        localStorage.removeItem("token")
        localStorage.removeItem('id')
        localStorage.removeItem('username')
        localStorage.removeItem('avatar')
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