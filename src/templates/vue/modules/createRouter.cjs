'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * 创建路由文件
 */
async function createRouterFiles(routerDir, options) {
  const isTS = options.language === 'TypeScript';
  const fileExt = isTS ? 'ts' : 'js';
  
  let indexContent = '';
  
  if (isTS) {
    indexContent = `import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '../store/user'
import Layout from '../layout/index.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'dashboard', requiresAuth: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/404.vue'),
    meta: { title: '404', requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.meta.requiresAuth as boolean
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = \`\${to.meta.title} - \${import.meta.env.VITE_APP_TITLE || '后台管理系统'}\`
  }
  
  // 认证逻辑
  if (requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router`;
  } else {
    indexContent = `import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/user'
import Layout from '../layout/index.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/index.vue'),
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'dashboard', requiresAuth: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/404.vue'),
    meta: { title: '404', requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.meta.requiresAuth
  
  // 设置页面标题
  if (to.meta.title) {
    document.title = \`\${to.meta.title} - \${import.meta.env.VITE_APP_TITLE || '后台管理系统'}\`
  }
  
  // 认证逻辑
  if (requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router`;
  }
  
  await fs.writeFile(
    path.join(routerDir, `index.${fileExt}`),
    indexContent,
    'utf-8'
  );
  
  // 创建404页面
  const notFoundContent = `<template>
  <div class="not-found">
    <h1>404</h1>
    <p>页面不存在</p>
    <router-link to="/">返回首页</router-link>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  text-align: center;
}

h1 {
  font-size: 6rem;
  margin-bottom: 1rem;
}

a {
  margin-top: 2rem;
  color: #3873f0;
  text-decoration: none;
}
</style>`;
  
  await fs.mkdir(path.join(options.projectPath, 'src/views'), { recursive: true });
  await fs.writeFile(
    path.join(options.projectPath, 'src/views/404.vue'),
    notFoundContent,
    'utf-8'
  );
}

module.exports = {
  createRouterFiles
}; 