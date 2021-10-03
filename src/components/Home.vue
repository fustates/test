<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse? '64px':'200px' ">
        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
                <el-radio-button :label="false">展开</el-radio-button>
                <el-radio-button :label="true">收起</el-radio-button>
            </el-radio-group> -->
        <div class="toggle-button" @click="toggleCollapse">
          |||
        </div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#313743" text-color="#fff" active-text-color="#5591e0" unique-opened
          class="el-menu-vertical-demo" :collapse="isCollapse" :collapse-transition="false" router
          :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="'' + item.id" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index=" '/'+ subItem.path" v-for="subItem in item.children" :key="subItem.id"
              @click="saveNavState('/'+ subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 左侧内容主体 -->
      <el-main>
        <!-- 占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        // 左侧菜单数据
        menuList: [],
        iconsObj: {
          125: 'iconfont icon-user',
          103: 'iconfont icon-tijikongjian',
          101: 'iconfont icon-shangpin',
          102: 'iconfont icon-danju ',
          145: 'iconfont icon-baobiao'
        },
        isCollapse: false,
        // 激活的链接地址
        activePath: ""
      }
    },
    created() {
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
      loginout() {
        window.sessionStorage.clear(this.$router.push('/login'))
      },
      // 获取所有的菜单
      async getMenuList() {
        const {
          data: res
        } = await this.$http.get('menus')
        if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menuList = res.data
      },
      // 点击按钮切换菜单的展开和折叠
      toggleCollapse() {
        this.isCollapse = !this.isCollapse
      },
      // 保存链接激活状态
      saveNavState(activePath) {
        window.sessionStorage.setItem('activePath', activePath)
        this.activePath = activePath
      }
    }
  }

</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #363d40;
    display: flex;
    justify-content: space-between;
    padding: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    >div {
      display: flex;
      align-items: center;

      span {
        padding-left: 10px;
      }
    }
  }

  .el-aside {
    background-color: #313743;

    .el-menu {
      border-right: 0;
    }
  }

  .el-main {
    background-color: #e9edf1;
  }

  .iconfont {
    margin-right: 10px;
  }

  .toggle-button {
    background-color: #475163;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }

  //   .el-menu-vertical-demo:not(.el-menu--collapse) {
  //     width: 200px;
  //     min-height: 400px;
  //   }

</style>
