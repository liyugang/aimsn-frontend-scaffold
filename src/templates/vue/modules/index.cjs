'use strict';

const { createVueProject } = require('./createProject.cjs');
const { createEntryFiles } = require('./createEntryFiles.cjs');
const { createCommonComponents } = require('./createComponents.cjs');
const { createRouterFiles } = require('./createRouter.cjs');
const { createStoreFiles } = require('./createStore.cjs');
const { createApiFiles } = require('./createApi.cjs');
const { createUtilsFiles } = require('./createUtils.cjs');
const { createLayoutFiles } = require('./createLayout.cjs');
const { createLoginFiles, createDashboardFiles } = require('./createViews.cjs');

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
  createDashboardFiles
}; 