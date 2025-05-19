'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * 创建路由文件
 */
async function createRouteFiles(routesDir, options) {
  const isTS = options.language === 'TypeScript';
  const fileExt = isTS ? 'tsx' : 'jsx';
  
  // 创建路由定义文件
  let routesContent = '';
  
  if (isTS) {
    routesContent = `import React, { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';

// 懒加载页面组件
const Dashboard = lazy(() => import('../pages/dashboard'));
const Login = lazy(() => import('../pages/login'));

// 布局
const MainLayout = lazy(() => import('../layouts/MainLayout'));

// 加载状态组件
const PageLoading = () => <div className="page-loading">页面加载中...</div>;

// 路由配置
export const routes: RouteObject[] = [
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoading />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoading />}>
        <MainLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoading />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'users',
        children: [
          {
            path: 'list',
            element: <div>用户列表（待实现）</div>,
          },
          {
            path: 'add',
            element: <div>添加用户（待实现）</div>,
          },
        ],
      },
      {
        path: 'content',
        children: [
          {
            path: 'articles',
            element: <div>文章管理（待实现）</div>,
          },
          {
            path: 'categories',
            element: <div>分类管理（待实现）</div>,
          },
        ],
      },
      {
        path: 'settings',
        element: <div>系统设置（待实现）</div>,
      },
    ],
  },
  {
    path: '*',
    element: <div className="not-found">404 页面不存在</div>,
  },
];

export default routes;
`;
  } else {
    routesContent = `import React, { lazy, Suspense } from 'react';

// 懒加载页面组件
const Dashboard = lazy(() => import('../pages/dashboard'));
const Login = lazy(() => import('../pages/login'));

// 布局
const MainLayout = lazy(() => import('../layouts/MainLayout'));

// 加载状态组件
const PageLoading = () => <div className="page-loading">页面加载中...</div>;

// 路由配置
export const routes = [
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoading />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <Suspense fallback={<PageLoading />}>
        <MainLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoading />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'users',
        children: [
          {
            path: 'list',
            element: <div>用户列表（待实现）</div>,
          },
          {
            path: 'add',
            element: <div>添加用户（待实现）</div>,
          },
        ],
      },
      {
        path: 'content',
        children: [
          {
            path: 'articles',
            element: <div>文章管理（待实现）</div>,
          },
          {
            path: 'categories',
            element: <div>分类管理（待实现）</div>,
          },
        ],
      },
      {
        path: 'settings',
        element: <div>系统设置（待实现）</div>,
      },
    ],
  },
  {
    path: '*',
    element: <div className="not-found">404 页面不存在</div>,
  },
];

export default routes;
`;
  }
  
  await fs.writeFile(
    path.join(routesDir, `index.${fileExt}`),
    routesContent,
    'utf-8'
  );
}

module.exports = {
  createRouteFiles
}; 