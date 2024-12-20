import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import home from './home'
import search from './search'
import details from './details'
import read from './read'
import comment from './comment'
import upload from './upload'
import discussion from './discussion'
import user from './user'
import favorite from './favorite'

export default new Vuex.Store({
    modules: {
        home,
        search,
        details,
        read,
        comment,
        upload,
        discussion,
        user,
        favorite,
    }
})