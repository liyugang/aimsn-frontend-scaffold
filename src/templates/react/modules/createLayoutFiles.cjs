'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * 创建布局文件
 */
async function createLayoutFiles(layoutsDir, options) {
  const isTS = options.language === 'TypeScript';
  const isAntd = options.uiFramework === 'Ant Design';
  const fileExt = isTS ? 'tsx' : 'jsx';
  const cssExt = options.cssPreprocessor === 'SCSS' ? 'scss' : 'css';
  
  // 创建MainLayout
  let mainLayoutContent = '';
  
  if (isTS) {
    mainLayoutContent = `import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './MainLayout.${cssExt}';

const MainLayout: React.FC = () => {
  return (
    <div className="main-layout">
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
`;
  } else {
    mainLayoutContent = `import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './MainLayout.${cssExt}';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Header />
      <div className="main-container">
        <Sidebar />
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
`;
  }
  
  await fs.writeFile(
    path.join(layoutsDir, `MainLayout.${fileExt}`),
    mainLayoutContent,
    'utf-8'
  );
  
  // 创建MainLayout样式
  const mainLayoutCssContent = `.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-container {
  display: flex;
  flex: 1;
}

.content-area {
  flex: 1;
  padding: 20px;
  background-color: #f0f2f5;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }
}
`;
  
  await fs.writeFile(
    path.join(layoutsDir, `MainLayout.${cssExt}`),
    mainLayoutCssContent,
    'utf-8'
  );
  
  // 创建Header组件
  let headerContent = '';
  
  if (isTS) {
    headerContent = `import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';
import './Header.${cssExt}';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">管理系统</Link>
      </div>
      
      <div className="header-actions">
        <div className="user-info">
          <span className="welcome">欢迎，{user?.username || '用户'}</span>
          <button className="logout-btn" onClick={logout}>退出登录</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
`;
  } else {
    headerContent = `import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks';
import './Header.${cssExt}';

const Header = () => {
  const { user, logout } = useAuth();
  
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">管理系统</Link>
      </div>
      
      <div className="header-actions">
        <div className="user-info">
          <span className="welcome">欢迎，{user?.username || '用户'}</span>
          <button className="logout-btn" onClick={logout}>退出登录</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
`;
  }
  
  await fs.writeFile(
    path.join(layoutsDir, `Header.${fileExt}`),
    headerContent,
    'utf-8'
  );
  
  // 创建Header样式
  const headerCssContent = `.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 60px;
  background-color: #001529;
  color: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 1.5rem;
  font-weight: 600;
}

.logo a {
  color: #fff;
  text-decoration: none;
}

.header-actions {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
}

.welcome {
  margin-right: 16px;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
  padding: 5px 10px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
`;
  
  await fs.writeFile(
    path.join(layoutsDir, `Header.${cssExt}`),
    headerCssContent,
    'utf-8'
  );
  
  // 创建Sidebar组件
  let sidebarContent = '';
  
  if (isTS) {
    sidebarContent = `import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.${cssExt}';

interface MenuItem {
  title: string;
  path: string;
  icon?: string;
  children?: MenuItem[];
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState<Record<string, boolean>>({});
  
  // 菜单数据
  const menuItems: MenuItem[] = [
    {
      title: '仪表盘',
      path: '/',
      icon: '📊'
    },
    {
      title: '用户管理',
      path: '/users',
      icon: '👥',
      children: [
        {
          title: '用户列表',
          path: '/users/list'
        },
        {
          title: '添加用户',
          path: '/users/add'
        }
      ]
    },
    {
      title: '内容管理',
      path: '/content',
      icon: '📄',
      children: [
        {
          title: '文章列表',
          path: '/content/articles'
        },
        {
          title: '类别管理',
          path: '/content/categories'
        }
      ]
    },
    {
      title: '系统设置',
      path: '/settings',
      icon: '⚙️'
    }
  ];
  
  // 切换子菜单
  const toggleSubmenu = (title: string) => {
    setMenuOpen({
      ...menuOpen,
      [title]: !menuOpen[title]
    });
  };
  
  // 检查当前路径是否匹配菜单路径
  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(\`\${path}/\`);
  };
  
  return (
    <aside className="sidebar">
      <nav className="menu">
        <ul className="menu-list">
          {menuItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isMenuActive = isActive(item.path);
            const isOpen = menuOpen[item.title] || isMenuActive;
            
            return (
              <li 
                key={item.path} 
                className={\`menu-item \${hasChildren ? 'has-submenu' : ''} \${isMenuActive ? 'active' : ''}\`}
              >
                {hasChildren ? (
                  <>
                    <div 
                      className="menu-title" 
                      onClick={() => toggleSubmenu(item.title)}
                    >
                      {item.icon && <span className="menu-icon">{item.icon}</span>}
                      <span>{item.title}</span>
                      <span className="menu-arrow">▼</span>
                    </div>
                    <ul className={\`submenu \${isOpen ? 'open' : ''}\`}>
                      {item.children.map((child) => (
                        <li 
                          key={child.path} 
                          className={\`menu-item \${isActive(child.path) ? 'active' : ''}\`}
                        >
                          <Link to={child.path}>{child.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link to={item.path}>
                    {item.icon && <span className="menu-icon">{item.icon}</span>}
                    <span>{item.title}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
`;
  } else {
    sidebarContent = `import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.${cssExt}';

const Sidebar = () => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState({});
  
  // 菜单数据
  const menuItems = [
    {
      title: '仪表盘',
      path: '/',
      icon: '📊'
    },
    {
      title: '用户管理',
      path: '/users',
      icon: '👥',
      children: [
        {
          title: '用户列表',
          path: '/users/list'
        },
        {
          title: '添加用户',
          path: '/users/add'
        }
      ]
    },
    {
      title: '内容管理',
      path: '/content',
      icon: '📄',
      children: [
        {
          title: '文章列表',
          path: '/content/articles'
        },
        {
          title: '类别管理',
          path: '/content/categories'
        }
      ]
    },
    {
      title: '系统设置',
      path: '/settings',
      icon: '⚙️'
    }
  ];
  
  // 切换子菜单
  const toggleSubmenu = (title) => {
    setMenuOpen({
      ...menuOpen,
      [title]: !menuOpen[title]
    });
  };
  
  // 检查当前路径是否匹配菜单路径
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(\`\${path}/\`);
  };
  
  return (
    <aside className="sidebar">
      <nav className="menu">
        <ul className="menu-list">
          {menuItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isMenuActive = isActive(item.path);
            const isOpen = menuOpen[item.title] || isMenuActive;
            
            return (
              <li 
                key={item.path} 
                className={\`menu-item \${hasChildren ? 'has-submenu' : ''} \${isMenuActive ? 'active' : ''}\`}
              >
                {hasChildren ? (
                  <>
                    <div 
                      className="menu-title" 
                      onClick={() => toggleSubmenu(item.title)}
                    >
                      {item.icon && <span className="menu-icon">{item.icon}</span>}
                      <span>{item.title}</span>
                      <span className="menu-arrow">▼</span>
                    </div>
                    <ul className={\`submenu \${isOpen ? 'open' : ''}\`}>
                      {item.children.map((child) => (
                        <li 
                          key={child.path} 
                          className={\`menu-item \${isActive(child.path) ? 'active' : ''}\`}
                        >
                          <Link to={child.path}>{child.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <Link to={item.path}>
                    {item.icon && <span className="menu-icon">{item.icon}</span>}
                    <span>{item.title}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
`;
  }
  
  await fs.writeFile(
    path.join(layoutsDir, `Sidebar.${fileExt}`),
    sidebarContent,
    'utf-8'
  );
  
  // 创建Sidebar样式
  const sidebarCssContent = `.sidebar {
  width: 240px;
  background-color: #001529;
  color: #fff;
  height: calc(100vh - 60px);
  overflow-y: auto;
  transition: width 0.3s;
}

.menu {
  padding: 16px 0;
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  margin-bottom: 4px;
}

.menu-item a,
.menu-title {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  color: rgba(255, 255, 255, 0.65);
  text-decoration: none;
  transition: all 0.3s;
  cursor: pointer;
}

.menu-item a:hover,
.menu-title:hover {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
}

.menu-item.active > a,
.menu-item.active > .menu-title {
  color: #fff;
  background-color: #1890ff;
}

.menu-icon {
  margin-right: 10px;
  font-size: 16px;
}

.menu-arrow {
  margin-left: auto;
  transition: transform 0.3s;
  font-size: 10px;
}

.has-submenu.active > .menu-title .menu-arrow {
  transform: rotate(180deg);
}

.submenu {
  list-style: none;
  padding: 0;
  margin: 0;
  background: rgba(0, 0, 0, 0.2);
  overflow: hidden;
  max-height: 0;
  transition: max-height 0.3s;
}

.submenu.open {
  max-height: 500px;
}

.submenu .menu-item a {
  padding-left: 48px;
}

@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -240px;
    z-index: 1000;
  }
  
  .sidebar.open {
    left: 0;
  }
}
`;
  
  await fs.writeFile(
    path.join(layoutsDir, `Sidebar.${cssExt}`),
    sidebarCssContent,
    'utf-8'
  );
}

module.exports = {
  createLayoutFiles
}; 