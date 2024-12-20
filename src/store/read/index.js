import { reqGetArticleInfo,reqSaveReadHistory,reqArticleExists,reqGetReadHistory,reqDeleteReadHistory,reqDeleteAllReadHistory } from '@/api/index'

const state = {
    article: {
    },
    histories:[],
    size:0
}
const mutations = {
    GETARTICLE(state, article) {
        const text = article.text
        const list = [] // 装文章的
        const linesArray = text.split('\n');
        let len = 0
        let paras = [];

        linesArray.forEach(v => {
            // 如果是换行，直接加进去
            if (v === '\r') {
                len += 1
                paras.push(v)
            }
            // 不是换行，看长度有没有50
            else if (v.length <= 50) {
                len += 1
                paras.push(v)
            } else {
                // 长度超过了 50
                // 分成几部分
                for (let i = 0; i < v.length; i += 50) {
                    len += 1
                    paras.push(v.slice(i, i + 50))
                    if(len === 12){
                        len = 0
                        list.push(paras)
                        paras = []
                    }
                }
            }

            if(len === 12){
                len = 0
                list.push(paras)
                paras = []
            }
        })

        // 不够的也加进去
        if(len > 0){
            list.push(paras)
        }

        article.text = list
        state.article = article
    },
    GETREADHISTORY(state,data){
        state.histories = data ? data.data : []
        state.size = data ? data.size : 0
    }
}
const actions = {
    async getArticle({ commit }, articleId) {
        const result = await reqGetArticleInfo(articleId)

        if (result.code == 200) {
            commit('GETARTICLE', result.data)
        } else {
            console.log('failed to get article');
        }
    },
    async saveReadHistory({commit},data){
        await reqSaveReadHistory(data)
    },
    async getReadHistory({commit},{query,keyword}){
        const {code,data} = await reqGetReadHistory(query,keyword)
        if(code === 200){
            commit('GETREADHISTORY',data)
        }
    },
    async deleteReadHistory({commit},id){
        const {code} = await reqDeleteReadHistory(id)
        return code === 200
    },
    async deleteAllReadHistory(){
        const {code} = await reqDeleteAllReadHistory()
        return code === 200
    }
}
const getters = {
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}