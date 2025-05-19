'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * 创建入口文件
 */
async function createEntryFiles(srcDir, options) {
  const isTS = options.language === 'TypeScript';
  const isElementPlus = options.uiFramework === 'Element Plus';
  const isAntDesignVue = options.uiFramework === 'Ant Design Vue';
  const fileExt = isTS ? 'ts' : 'js';
  
  // 创建main文件
  let mainContent = '';
  if (isTS) {
    mainContent = `import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
${isElementPlus ? `import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'` : ''}
${isAntDesignVue ? `import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'` : ''}
import './assets/styles/main.css'

// 导入 mock 数据（仅在开发环境生效）
import './mock'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(router)
${isElementPlus ? `app.use(ElementPlus)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}` : ''}
${isAntDesignVue ? 'app.use(Antd)' : ''}

app.mount('#app')
`;
  } else {
    mainContent = `import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
${isElementPlus ? `import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'` : ''}
${isAntDesignVue ? `import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'` : ''}
import './assets/styles/main.css'

// 导入 mock 数据（仅在开发环境生效）
import './mock'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(router)
${isElementPlus ? `app.use(ElementPlus)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}` : ''}
${isAntDesignVue ? 'app.use(Antd)' : ''}

app.mount('#app')
`;
  }
  
  await fs.writeFile(
    path.join(srcDir, `main.${fileExt}`),
    mainContent,
    'utf-8'
  );
  
  // 创建App.vue
  const appContent = `<template>
  <router-view />
</template>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

#app {
  height: 100vh;
}
</style>
`;
  
  await fs.writeFile(
    path.join(srcDir, 'App.vue'),
    appContent,
    'utf-8'
  );
  
  // 创建 main.css 样式文件
  await fs.mkdir(path.join(srcDir, 'assets/styles'), { recursive: true });
  
  const mainCssContent = `/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  height: 100%;
  font-family: Arial, sans-serif;
  font-size: 14px;
  color: #333;
  background-color: #f5f5f5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: #409eff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

h1, h2, h3, h4, h5, h6 {
  margin-bottom: 16px;
  font-weight: 500;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

/* 常用辅助类 */
.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.flex {
  display: flex;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.mt-10 {
  margin-top: 10px;
}

.mb-10 {
  margin-bottom: 10px;
}

.ml-10 {
  margin-left: 10px;
}

.mr-10 {
  margin-right: 10px;
}

.p-10 {
  padding: 10px;
}
`;
  
  await fs.writeFile(
    path.join(srcDir, 'assets/styles/main.css'),
    mainCssContent,
    'utf-8'
  );
}

module.exports = {
  createEntryFiles
}; 