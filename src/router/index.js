import Vue from 'vue'
import VueRouter from 'vue-router'

// 使用插件
Vue.use(VueRouter)


import Home from '@/pages/Home'
import Search from '@/pages/Search'
import Details from '@/pages/Details'
import Read from '@/pages/Read'
import Upload from '@/pages/Upload'
import Discussion from '@/pages/Discussion'
import History from '@/pages/History'
import Space from '@/pages/Space'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Favorite from '@/pages/Space/Favorite'
import External from '@/pages/External'
import UploadHistory from '@/pages/Space/UploadHistory'
import Settings from '@/pages/Space/Settings'

const router = new VueRouter({
    routes: [{
            path: '/',
            redirect: { path: '/home' }
        },
        {
            path: "/home",
            component: Home
        },
        {
            path: "/search",
            component: Search
        },
        {
            path: "/details/:authorId?",
            component: Details,
            name: 'details'
        },
        {
            path: '/read/:articleId?',
            component: Read,
            name: 'read'
        },
        {
            path: '/upload',
            component: Upload,
            name: 'upload'
        },
        {
            path: '/discussion',
            component: Discussion,
            name: 'discussion'
        },
        {
            path: '/favorite',
            component: UploadHistory,
            name: 'favorite'
            
        },
        {
            path: '/history',
            component: History,
            name: 'history'
            
        },
        {   
            path:'/login',
            component: Login,
            name: 'login'
        },
        {
            path:'/register',
            component:Register,
            name:'register'
        },
        {
            path: '/space/:id',
            component: Space,
            name:'space',
            children:[
                {
                    path:'favorite',
                    components:{
                        space:Favorite
                    }
                },{
                    path:'upload',
                    components:{
                        space:UploadHistory
                    }
                },{
                    path:'settings',
                    components:{
                        space:Settings
                    }
                }
            ]
        },
        {
            path: '/external',
            component: External,
            name: 'external'
        }, {
            path: "*",
            redirect: '/'
        }
    ],

})

router.beforeEach((to, from, next) => {
    // chrome
    document.body.scrollTop = 0
        // firefox
    document.documentElement.scrollTop = 0
        // safari
    window.pageYOffset = 0
    next()
})

export default router