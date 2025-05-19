'use strict';

// 导入所有模块函数
const { createReactProject } = require('./modules/createProject.cjs');
const { createEntryFiles } = require('./modules/createEntryFiles.cjs');
const { createCommonComponents } = require('./modules/createComponents.cjs');
const { createRouteFiles } = require('./modules/createRouteFiles.cjs');
const { createStoreFiles } = require('./modules/createStoreFiles.cjs');
const { createServiceFiles } = require('./modules/createServiceFiles.cjs');
const { createUtilsFiles } = require('./modules/createUtilsFiles.cjs');
const { createLayoutFiles } = require('./modules/createLayoutFiles.cjs');
const { createLoginFiles, createDashboardFiles } = require('./modules/createViews.cjs');
const { createCustomHooks } = require('./modules/createHooks.cjs');
const { createContextFiles } = require('./modules/createContextFiles.cjs');
const { createPackageJson } = require('./modules/createPackage.cjs');

// 重新导出所有函数
module.exports = {
  createReactProject,
  createEntryFiles,
  createCommonComponents,
  createRouteFiles,
  createStoreFiles,
  createServiceFiles,
  createUtilsFiles,
  createLayoutFiles,
  createLoginFiles,
  createDashboardFiles,
  createCustomHooks,
  createContextFiles,
  createPackageJson
}; 