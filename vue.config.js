module.exports = {
    // 关闭校验
    lintOnSave: false,
    devServer: {
        proxy: {
            'api': {
                target: 'http://localhost:5001',
            }
        }
    },
}