'use strict';

const fs = require('fs-extra');
const path = require('path');
const { createEntryFiles } = require('./createEntryFiles.cjs');
const { createCommonComponents } = require('./createComponents.cjs');
const { createRouterFiles } = require('./createRouter.cjs');
const { createStoreFiles } = require('./createStore.cjs');
const { createApiFiles } = require('./createApi.cjs');
const { createUtilsFiles } = require('./createUtils.cjs');
const { createLayoutFiles } = require('./createLayout.cjs');
const { createLoginFiles, createDashboardFiles } = require('./createViews.cjs');
const { createPackageJson } = require('./createPackage.cjs');

/**
 * 创建Vue项目
 * @param {Object} options 选项
 * @returns {Promise<void>}
 */
async function createVueProject(options) {
  console.log('正在创建Vue项目...');
  
  // 创建项目目录
  const srcDir = path.join(options.projectPath, 'src');
  const componentsDir = path.join(srcDir, 'components');
  const viewsDir = path.join(srcDir, 'views');
  const routerDir = path.join(srcDir, 'router');
  const storeDir = path.join(srcDir, 'store');
  const apiDir = path.join(srcDir, 'api');
  const utilsDir = path.join(srcDir, 'utils');
  const assetsDir = path.join(srcDir, 'assets');
  const layoutDir = path.join(srcDir, 'layout');
  const loginDir = path.join(viewsDir, 'login');
  const dashboardDir = path.join(viewsDir, 'dashboard');
  
  console.log(srcDir, 'srcDir');
  console.log(componentsDir, 'componentsDir');
  console.log(viewsDir, 'viewsDir');
  console.log(routerDir, 'routerDir');
  console.log(storeDir, 'storeDir');
  console.log(apiDir, 'apiDir');
  console.log(utilsDir, 'utilsDir');
  console.log(assetsDir, 'assetsDir');
  console.log(layoutDir, 'layoutDir');
  console.log(loginDir, 'loginDir');
  console.log(dashboardDir, 'dashboardDir');
  
  
  // 创建目录结构
  await Promise.all([
    fs.mkdir(srcDir, { recursive: true }),
    fs.mkdir(componentsDir, { recursive: true }),
    fs.mkdir(viewsDir, { recursive: true }),
    fs.mkdir(routerDir, { recursive: true }),
    fs.mkdir(storeDir, { recursive: true }),
    fs.mkdir(apiDir, { recursive: true }),
    fs.mkdir(utilsDir, { recursive: true }),
    fs.mkdir(assetsDir, { recursive: true }),
    fs.mkdir(layoutDir, { recursive: true }),
    fs.mkdir(loginDir, { recursive: true }),
    fs.mkdir(dashboardDir, { recursive: true }),
    fs.mkdir(path.join(assetsDir, 'images'), { recursive: true }),
    fs.mkdir(path.join(assetsDir, 'styles'), { recursive: true })
  ]);
  
  // 依次创建文件
  try {
    // 创建 package.json 和项目配置文件
    await createPackageJson(options.projectPath, options);
    
    // 创建入口文件
    await createEntryFiles(srcDir, options);
    
    // 创建路由文件
    await createRouterFiles(routerDir, options);
    
    // 创建状态管理文件
    await createStoreFiles(storeDir, options);
    
    // 创建API请求文件
    await createApiFiles(apiDir, options);
    
    // 创建工具函数文件
    await createUtilsFiles(utilsDir, options);
    
    // 创建布局文件
    await createLayoutFiles(layoutDir, options);
    
    // 创建登录文件
    await createLoginFiles(loginDir, options);
    
    // 创建仪表盘文件
    await createDashboardFiles(dashboardDir, options);
    
    // 创建公共组件
    await createCommonComponents(componentsDir, options);
    
    console.log('Vue项目创建完成！');
    
    return {
      success: true,
      message: '项目创建成功'
    };
  } catch (error) {
    console.error('创建Vue项目失败:', error);
    return {
      success: false,
      message: '项目创建失败：' + error.message
    };
  }
}

module.exports = {
  createVueProject
}; 