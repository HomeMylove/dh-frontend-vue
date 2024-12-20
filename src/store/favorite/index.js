import { reqGetFavList,reqGetFavArticles } from '@/api/index'


const state = {
    favList:[],
    favArticles:[],
    total:0
}
const mutations = {
    GETFAVLIST(state,data){
        state.favList = data
    },
    GETFAVARTICLES(state,{data,size}){
        state.favArticles = data
        state.total = size
    }
}
const actions = {
    async getFavList({commit},query){
        const {code,data} = await reqGetFavList(query)
        if(code === 200) {
            commit('GETFAVLIST',data)
        }
    },
    async getFavArticles({commit},d){
        const {code,data} = await reqGetFavArticles(d)
        if(code === 200){
            commit('GETFAVARTICLES',data)
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