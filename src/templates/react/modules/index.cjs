'use strict';

const { createReactProject } = require('./createProject.cjs');
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
  createContextFiles
}; 