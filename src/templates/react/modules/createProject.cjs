'use strict';

const fs = require('fs-extra');
const path = require('path');
const { createEntryFiles } = require('./createEntryFiles.cjs');
const { createCommonComponents } = require('./createComponents.cjs');
const { createRouteFiles } = require('./createRouteFiles.cjs');
const { createStoreFiles } = require('./createStoreFiles.cjs');
const { createServiceFiles } = require('./createServiceFiles.cjs');
const { createUtilsFiles } = require('./createUtilsFiles.cjs');
const { createLayoutFiles } = require('./createLayoutFiles.cjs');
const { createLoginFiles, createDashboardFiles } = require('./createViews.cjs');
const { createCustomHooks } = require('./createHooks.cjs');
const { createContextFiles } = require('./createContextFiles.cjs');
const { createPackageJson } = require('./createPackage.cjs');
const createLayoutAndComponents = require('./createLayoutAndComponents.cjs');

/**
 * 创建React项目
 * @param {Object} options 选项
 * @returns {Promise<void>}
 */
async function createReactProject(options) {
  console.log('正在创建React项目...');
  
  // 创建项目目录
  const srcDir = path.join(options.projectPath, 'src');
  const componentsDir = path.join(srcDir, 'components');
  const pagesDir = path.join(srcDir, 'pages');
  const routesDir = path.join(srcDir, 'routes');
  const storeDir = path.join(srcDir, 'store');
  const servicesDir = path.join(srcDir, 'services');
  const utilsDir = path.join(srcDir, 'utils');
  const assetsDir = path.join(srcDir, 'assets');
  const layoutsDir = path.join(srcDir, 'layouts');
  const hooksDir = path.join(srcDir, 'hooks');
  const contextDir = path.join(srcDir, 'context');
  
  // 创建目录结构
  await Promise.all([
    fs.mkdir(srcDir, { recursive: true }),
    fs.mkdir(componentsDir, { recursive: true }),
    fs.mkdir(path.join(componentsDir, 'common'), { recursive: true }),
    fs.mkdir(path.join(componentsDir, 'layout'), { recursive: true }),
    fs.mkdir(pagesDir, { recursive: true }),
    fs.mkdir(routesDir, { recursive: true }),
    fs.mkdir(storeDir, { recursive: true }),
    fs.mkdir(servicesDir, { recursive: true }),
    fs.mkdir(utilsDir, { recursive: true }),
    fs.mkdir(assetsDir, { recursive: true }),
    fs.mkdir(path.join(assetsDir, 'images'), { recursive: true }),
    fs.mkdir(path.join(assetsDir, 'styles'), { recursive: true }),
    fs.mkdir(layoutsDir, { recursive: true }),
    fs.mkdir(hooksDir, { recursive: true }),
    fs.mkdir(contextDir, { recursive: true }),
    fs.mkdir(path.join(pagesDir, 'login'), { recursive: true }),
    fs.mkdir(path.join(pagesDir, 'dashboard'), { recursive: true })
  ]);
  
  // 依次创建文件
  try {
    // 创建 package.json 和项目配置文件
    await createPackageJson(options.projectPath, options);
    
    // 创建工具函数文件（其他文件可能依赖这些工具）
    await createUtilsFiles(utilsDir, options);
    
    // 创建API服务文件（auth相关组件依赖这些）
    await createServiceFiles(servicesDir, options);
    
    // 创建状态管理文件（Auth相关组件依赖这些）
    await createStoreFiles(storeDir, options);
    
    // 创建自定义Hook（多个组件依赖这些hook）
    await createCustomHooks(hooksDir, options);
    
    // 创建上下文（Layout和组件依赖这些上下文）
    await createContextFiles(contextDir, options);
    
    // 创建公共组件（包括ProtectedRoute等）
    await createCommonComponents(componentsDir, options);
    
    // 创建布局文件
    await createLayoutFiles(layoutsDir, options);
    
    // 创建路由文件
    await createRouteFiles(routesDir, options);
    
    // 创建登录页面
    await createLoginFiles(path.join(pagesDir, 'login'), options);
    
    // 创建仪表盘页面
    await createDashboardFiles(path.join(pagesDir, 'dashboard'), options);
    
    // 创建布局和组件文件（包括Chakra UI主题）
    await createLayoutAndComponents(srcDir, options);
    
    // 最后创建入口文件，因为它依赖所有其他文件
    await createEntryFiles(srcDir, options);
    
    console.log('React项目创建完成！');
    
    return {
      success: true,
      message: '项目创建成功'
    };
  } catch (error) {
    console.error('创建React项目失败:', error);
    return {
      success: false,
      message: '项目创建失败：' + error.message
    };
  }
} 

module.exports = {
  createReactProject
};
