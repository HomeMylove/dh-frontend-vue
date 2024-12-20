import { reqNewArticle,reqGetAuthorPopularity,reqGetArticlePopularity } from '@/api/index'


const state = {
    popularity: {
        articles:[],
        authors:[]
    },
    newArticle: []
}
const mutations = {
    GETPOPULARITY(state, popularity) {
        state.popularity = popularity
    },
    GETNEWARTICLE(state, newArticle) {
        state.newArticle = newArticle
    }
}
const actions = {
    async getPopularity({ commit }) {
        const r1= await reqGetAuthorPopularity()
        const r2 = await reqGetArticlePopularity()
        const popularity = {}
        if(r1.code == 200) popularity.authors = r1.data
        if(r2.code == 200) popularity.articles = r2.data
        commit('GETPOPULARITY',popularity)
    },
    async getNewArticle({ commit }) {
        const result = await reqNewArticle()
        if (result.code == 200) {
            commit('GETNEWARTICLE', result.data)
        } else {
            console.log('failed to get new article');
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