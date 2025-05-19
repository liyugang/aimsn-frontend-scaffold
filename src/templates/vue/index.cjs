'use strict';

// 导入所有模块函数
const { createVueProject } = require('./modules/createProject.cjs');
const { createEntryFiles } = require('./modules/createEntryFiles.cjs');
const { createCommonComponents } = require('./modules/createComponents.cjs');
const { createRouterFiles } = require('./modules/createRouter.cjs');
const { createStoreFiles } = require('./modules/createStore.cjs');
const { createApiFiles } = require('./modules/createApi.cjs');
const { createUtilsFiles } = require('./modules/createUtils.cjs');
const { createLayoutFiles } = require('./modules/createLayout.cjs');
const { createLoginFiles, createDashboardFiles } = require('./modules/createViews.cjs');
const { createPackageJson } = require('./modules/createPackage.cjs');

// 重新导出所有函数
module.exports = {
  createVueProject,
  createEntryFiles,
  createCommonComponents,
  createRouterFiles,
  createStoreFiles,
  createApiFiles,
  createUtilsFiles,
  createLayoutFiles,
  createLoginFiles,
  createDashboardFiles,
  createPackageJson
}; 