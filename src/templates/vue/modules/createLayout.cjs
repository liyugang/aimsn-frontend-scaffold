'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * 创建布局文件
 */
async function createLayoutFiles(layoutDir, options) {
  const isElementPlus = options.uiFramework === 'Element Plus';
  
  // 创建布局入口
  let indexContent = `<template>
  <div class="app-wrapper">
    <div class="sidebar-container">
      <Sidebar />
    </div>
    <div class="main-container">
      <div class="header">
        <Navbar />
      </div>
      <App-Main />
    </div>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'
import AppMain from './components/AppMain.vue'
</script>

<style scoped>
.app-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
}

.sidebar-container {
  width: 210px;
  height: 100%;
  background-color: #304156;
  transition: width 0.3s;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.header {
  height: 50px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;
}
</style>`;
  
  await fs.writeFile(
    path.join(layoutDir, 'index.vue'),
    indexContent,
    'utf-8'
  );
  
  // 创建组件目录
  await fs.mkdir(path.join(layoutDir, 'components'), { recursive: true });
  
  // 创建Navbar组件
  let navbarContent = '';
  
  if (isElementPlus) {
    navbarContent = `<template>
  <div class="navbar">
    <div class="hamburger-container" @click="toggleSidebar">
      <el-icon><el-icon-menu /></el-icon>
    </div>
    
    <div class="breadcrumb-container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item v-if="$route.meta.title">
          {{ $route.meta.title }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <div class="right-menu">
      <el-dropdown trigger="click">
        <div class="avatar-container">
          <el-avatar :src="userStore.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" />
          <span class="user-name">{{ userStore.username }}</span>
          <el-icon><el-icon-arrow-down /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>
              <router-link to="/profile">个人中心</router-link>
            </el-dropdown-item>
            <el-dropdown-item divided @click="logout">
              <span style="display: block">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../../store/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

// 切换侧边栏
const toggleSidebar = () => {
  // 这里可以通过另一个store来控制侧边栏的展开收起
  console.log('Toggle sidebar')
}

// 退出登录
const logout = async () => {
  try {
    await userStore.logoutAction()
    router.push('/login')
  } catch (error) {
    console.error('退出登录失败', error)
  }
}
</script>

<style scoped>
.navbar {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.hamburger-container {
  font-size: 20px;
  cursor: pointer;
  margin-right: 15px;
}

.breadcrumb-container {
  flex: 1;
}

.right-menu {
  display: flex;
  align-items: center;
}

.avatar-container {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-name {
  margin: 0 5px;
}
</style>`;
  } else {
    navbarContent = `<template>
  <div class="navbar">
    <div class="hamburger-container" @click="toggleSidebar">
      <i class="iconfont icon-menu"></i>
    </div>
    
    <div class="breadcrumb-container">
      <div class="breadcrumb">
        <span>首页</span>
        <span v-if="$route.meta.title">
          / {{ $route.meta.title }}
        </span>
      </div>
    </div>
    
    <div class="right-menu">
      <div class="avatar-container" @click="showUserMenu = !showUserMenu">
        <img class="avatar" :src="userStore.avatar || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'" alt="avatar" />
        <span class="user-name">{{ userStore.username }}</span>
        <i class="iconfont icon-arrow-down"></i>
        
        <div class="user-dropdown" v-show="showUserMenu">
          <div class="dropdown-item">
            <router-link to="/profile">个人中心</router-link>
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item" @click="logout">
            <span>退出登录</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../../store/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const showUserMenu = ref(false)

// 切换侧边栏
const toggleSidebar = () => {
  // 这里可以通过另一个store来控制侧边栏的展开收起
  console.log('Toggle sidebar')
}

// 退出登录
const logout = async () => {
  try {
    await userStore.logoutAction()
    router.push('/login')
  } catch (error) {
    console.error('退出登录失败', error)
  }
}
</script>

<style scoped>
.navbar {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 15px;
}

.hamburger-container {
  font-size: 20px;
  cursor: pointer;
  margin-right: 15px;
}

.breadcrumb-container {
  flex: 1;
}

.right-menu {
  display: flex;
  align-items: center;
}

.avatar-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  position: relative;
}

.avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

.user-name {
  margin: 0 5px;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-width: 120px;
  margin-top: 5px;
  z-index: 100;
}

.dropdown-item {
  padding: 10px 15px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f5f7fa;
}

.dropdown-divider {
  height: 1px;
  background-color: #e4e7ed;
  margin: 5px 0;
}
</style>`;
  }
  
  await fs.writeFile(
    path.join(layoutDir, 'components', 'Navbar.vue'),
    navbarContent,
    'utf-8'
  );
  
  // 创建侧边栏组件
  let sidebarContent = `<template>
  <div class="sidebar">
    <div class="logo">
      <router-link to="/">
        <h1>管理系统</h1>
      </router-link>
    </div>
    
    <div class="menu-container">
      <!-- 菜单内容 -->
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: #263445;
}

.logo h1 {
  font-size: 18px;
  color: #fff;
  margin: 0;
}

.menu-container {
  flex: 1;
  overflow-y: auto;
}
</style>`;
  
  await fs.writeFile(
    path.join(layoutDir, 'components', 'Sidebar.vue'),
    sidebarContent,
    'utf-8'
  );
  
  // 创建主内容区组件
  let appMainContent = `<template>
  <div class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
.app-main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f0f2f5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>`;
  
  await fs.writeFile(
    path.join(layoutDir, 'components', 'AppMain.vue'),
    appMainContent,
    'utf-8'
  );
}

module.exports = {
  createLayoutFiles
}; 