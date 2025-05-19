'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * 创建入口文件
 */
async function createEntryFiles(srcDir, options) {
  const isTS = options.language === 'TypeScript';
  const isAntd = options.uiFramework === 'Ant Design';
  const isChakra = options.uiFramework === 'Chakra UI';
  const fileExt = isTS ? 'tsx' : 'jsx';
  
  // 创建index.js/ts文件
  let indexContent = '';
  
  if (isTS) {
    indexContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
${isAntd ? "import 'antd/dist/reset.css';" : ''}
${isChakra ? "import { ChakraProvider } from '@chakra-ui/react';\nimport theme from './theme';" : ''}
import './assets/styles/global.css';
import './mock';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <Provider store={store}>
${isChakra ? '      <ChakraProvider theme={theme}>' : ''}
      <BrowserRouter>
        <App />
      </BrowserRouter>
${isChakra ? '      </ChakraProvider>' : ''}
    </Provider>
  </React.StrictMode>
);
`;
  } else {
    indexContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import App from './App';
${isAntd ? "import 'antd/dist/reset.css';" : ''}
${isChakra ? "import { ChakraProvider } from '@chakra-ui/react';\nimport theme from './theme';" : ''}
import './assets/styles/global.css';
import './mock';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
${isChakra ? '      <ChakraProvider theme={theme}>' : ''}
      <BrowserRouter>
        <App />
      </BrowserRouter>
${isChakra ? '      </ChakraProvider>' : ''}
    </Provider>
  </React.StrictMode>
);
`;
  }
  
  await fs.writeFile(path.join(srcDir, `index.${isTS ? 'tsx' : 'jsx'}`), indexContent, 'utf-8');
  
  // 创建App.js/tsx文件
  let appContent = '';
  
  if (isTS) {
    appContent = `import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import NotFound from './pages/NotFound';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            {/* 其他受保护路由放这里 */}
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
`;
  } else {
    appContent = `import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            {/* 其他受保护路由放这里 */}
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
`;
  }
  
  await fs.writeFile(
    path.join(srcDir, `App.${fileExt}`),
    appContent,
    'utf-8'
  );
  
  // 创建404页面
  let notFoundContent = '';
  
  if (isTS) {
    notFoundContent = `import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>页面不存在</h2>
      <p>您访问的页面不存在或已被移除。</p>
      <Link to="/">返回首页</Link>
    </div>
  );
};

export default NotFound;
`;
  } else {
    notFoundContent = `import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404</h1>
      <h2>页面不存在</h2>
      <p>您访问的页面不存在或已被移除。</p>
      <Link to="/">返回首页</Link>
    </div>
  );
};

export default NotFound;
`;
  }
  
  await fs.writeFile(
    path.join(srcDir, `pages/NotFound.${fileExt}`),
    notFoundContent,
    'utf-8'
  );
  
  // 创建全局样式
  const globalCssContent = `/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
  color: #333;
  font-size: 14px;
}

a {
  color: #1890ff;
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

.not-found {
  text-align: center;
  padding: 100px 20px;
  max-width: 600px;
  margin: 0 auto;
}

.not-found h1 {
  font-size: 72px;
  color: #1890ff;
}

.not-found h2 {
  margin: 20px 0;
  font-size: 24px;
}

.not-found p {
  margin-bottom: 30px;
  color: #666;
}
`;
  
  await fs.mkdir(path.join(srcDir, 'assets/styles'), { recursive: true });
  await fs.writeFile(
    path.join(srcDir, 'assets/styles/global.css'),
    globalCssContent,
    'utf-8'
  );
}

module.exports = {
  createEntryFiles
}; 