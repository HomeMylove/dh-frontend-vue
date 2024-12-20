/**
 * 管理api接口
 */

import requests from "./request";

// 获取最新添加的 作品
export const reqNewArticle = () => requests.get('/article/new')


// 搜索作者
export const reqGetAuthor = (keyword, data) => requests({url: `/author/search/${keyword}`, method: 'post', data})

// 获取作者信息
export const reqGetAuthorInfo = id => requests({url: `/author/details/${id}`, method: 'get'})

// 搜索作品
export const reqGetArticle = (keyword, data) => requests({url: `/article/search/${keyword}`, method: 'post', data})

// 保存搜索记录 
export const reqSaveSearchHistory = (choice, history) => requests.post(`/history/search/${choice}/${history}`)

// 获取搜索记录
export const reqGetSearchHistory = choice => requests.get(`/history/search/${choice}`)
// 删除搜索记录
export const reqDeleteSearchHistory = ({choice, history}) => requests.delete(`/history/search/${choice}/${history}`)

// 获取作品信息
export const reqGetArticleInfo = id => requests({url: `/article/details/${id}`, method: 'get'})
// 搜索关键词
export const reqGetInfo = (choice, keyword) => requests({url: '/getInfo', method: 'post', data: {choice, keyword}})
// 搜索提示
export const reqGetAuthorHint = hint => requests.get(`/author/hint/${hint}`)
// 搜索作品提示
export const reqGetArticleHint = hint => requests.get(`/article/hint/${hint}`)

// 注册账号
export const reqRegister = data => requests({url: '/user/register', method: 'post', data})
// 登陆
export const reqLogin = data => requests({url: '/user/login', method: 'post', data})
// 注销
export const reqLogout = () => requests.post('/user/logout')
// 获取用户信息
export const reqGetUserInfo = id => requests.get(`/user/info/${id}`)
// 修改用户信息
export const reqUpdateUserInfo = data => requests.post('/user/update', data)


// 发送评论
export const reqSendComment = data => requests({url: '/comment/save', method: 'post', data})
// 获取评论
export const reqGetComment = (articleId, order) => requests.get(`/comment/${articleId}/${order}`)
// 评论点赞
export const reqLikeComment = commentId => requests.get(`/comment/like/${commentId}`)
// 删除评论
export const reqDeleteComment = id => requests.delete(`/comment/${id}`)
// 保存阅读历史
export const reqSaveReadHistory = data => requests.post(`/history/read`, data)
// 获取阅读历史
export const reqGetReadHistory = ({
                                      pageNum,
                                      pageSize
                                  }, keyword) => requests.get(`/history/read/${pageNum}/${pageSize}?keyword=${keyword}`)
// 删除历史记录
export const reqDeleteReadHistory = id => requests.delete(`/history/read/${id}`)
// 删除全部
export const reqDeleteAllReadHistory = () => requests.delete('/history/read')
// 检查作者是否存在
export const reqCheckAuthorName = name => requests.get(`/author/check_author/${name}`)
// 获取作者 id
export const reqGetAuthorIdByName = name => requests.get(`/author/getId/${name}`)
// 获取作者查询次数
export const reqGetAuthorPopularity = () => requests.get('/author/popularity')
// 获取作品查询次数
export const reqGetArticlePopularity = () => requests.get('/article/popularity')

// 上传作者
export const reqUploadAuthor = data => requests.post('/author/save', data)
// 判断作者有无文章
export const reqArticleExists = data => requests.post('/article/exists', data)
// 上传文章(text)
export const reqUploadTextArticle = ({
                                         authorId,
                                         title,
                                         text
                                     }) => requests.post(`/upload/save_article_text/${authorId}/${title}`, {text})
// 上传文章(file)
export const reqUploadFileArticle = ({
                                         authorId,
                                         title,
                                         file
                                     }) => requests.post(`/upload/save_article_file/${authorId}/${title}`, file)
// 上传到数据库
export const reqUploadArticleToDB = data => requests.post('/article/save', data)


// 上传图片
export const reqUploadAvatar = file => requests.post('/upload/avatar', file)

// 获取文章
export const reqTextById = articleId => requests({url: `/getText/?articleId=${articleId}`, method: 'get'})
// 下载文章
export const reqDownloadArticle = articleId => download(`/download/article/${articleId}`, 'abc.txt')

// 添加收藏夹
export const reqAddFavList = data => requests.post('/favorite/editList', data)
// 获取收藏夹
export const reqGetFavList = data => requests.post('/favorite/favList', data)
// 删除收藏夹
export const reqDeleteFavList = id => requests.delete(`/favorite/favList/${id}`)
// 添加文章到收藏夹
export const reqAddArticleToFavList = data => requests.post(`/favorite/article`, data)
// 获取收藏夹下所有的文章
export const reqGetFavArticles = ({id, data}) => requests.post(`/favorite/article/${id}`, data)
// 删除收藏的文章
export const reqDeleteFavArticle = id => requests.delete(`/favorite/article/${id}`)

// 获取某人上传的
export const reqGetUploadHistory = ({
                                        choice,
                                        spaceId,
                                        data
                                    }) => requests.post(`/${choice}/upload_history/${spaceId}`, data)
// 删除自己的上传
export const reqDeleteUploadHistory = ({choice, id}) => requests.delete(`/${choice}/${id}`)


export const reqGetAuthorId = name => requests({url: `/getAuthorId/?name=${name}`, method: 'get'})

// 上传文章
export const reqUploadArticle = data => requests({url: '/uploadArticle', method: 'post', data})

// 上传讨论
export const reqSendDiscussion = data => requests({url: '/sendDiscussion', method: 'post', data})

// 获取讨论
export const reqGetDiscussion = (keyword, order) => requests({
    url: `/getDiscussion/?keyword=${keyword}&&order=${order}`,
    method: 'get'
})