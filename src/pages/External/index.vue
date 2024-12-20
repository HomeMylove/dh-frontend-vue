<template>
  <div class="external-container">
    <h1 class="link-title">本项目已上传</h1>
    <ul class="links">
      <li>
        <span>前端</span>
        <a href="https://github.com/HomeMylove/dh-project"><i class="iconfont icon-github"></i></a>
        <a href="https://gitee.com/homemylove/dh-project"><i class="iconfont icon-gitee"></i></a>
      </li>
      <li>
        <span>后端</span>
        <a href="https://github.com/HomeMylove/dh-backend"><i class="iconfont icon-github"></i></a>
        <a href="https://gitee.com/homemylove/digital-humanities-backend"><i class="iconfont icon-gitee"></i></a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "External",
};
</script>

<style lang="less" scoped>
.external-container {
  text-align: center;
  position: relative;
  .links{
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      li{
          list-style: none;
          span{
            font-size: 30px;
            margin-right: 20px;
          }
          a{    
              font-size: 30px;
              line-height: 60px;
              margin: 0px 20px;
              text-decoration: none;
              color:black;

              i{
                font-size: 40px;
              }

              .icon-github{
                color: #666666;
              }

              .icon-gitee{
                color:#c71d23;
              }

              i:hover{
              color:#0d6efd;
          }
          }

          
      }
  }
}
</style>