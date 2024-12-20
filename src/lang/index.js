import Vue from 'vue'
// 引入语言包
import VueI18n from 'vue-i18n';
Vue.use(VueI18n)

import cn from './cn.js'
import jp from './jp.js'
import en from './en.js'

export default new VueI18n({
    locale: 'cn',
    messages: {
        cn,
        jp,
        en,
    }
})