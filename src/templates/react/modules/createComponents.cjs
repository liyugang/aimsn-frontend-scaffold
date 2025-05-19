'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * 创建公共组件
 */
async function createCommonComponents(componentsDir, options) {
  console.log('[createCommonComponents] 开始创建公共组件...');
  
  try {
    const isTS = options.language === 'TypeScript';
    const fileExt = isTS ? 'tsx' : 'jsx';
    
    // 创建组件目录
    const commonComponentsDir = path.join(componentsDir, 'common');
    await fs.mkdir(commonComponentsDir, { recursive: true });
    
    // 创建ProtectedRoute组件
    let protectedRouteContent = '';
    
    if (isTS) {
      protectedRouteContent = `import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';

interface ProtectedRouteProps {
  redirectPath?: string;
}

/**
 * 保护路由组件 - 只允许已认证用户访问
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  redirectPath = '/login'
}) => {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  // 如果正在加载中，显示加载状态
  if (isLoading) {
    return <div className="loading">加载中...</div>;
  }
  
  // 检查用户是否已登录，未登录则重定向到登录页
  if (!isLoggedIn) {
    // 重定向到登录页面，但保存当前路径以便登录后跳回
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  
  // 渲染子路由
  return <Outlet />;
};

export default ProtectedRoute;
`;
    } else {
      protectedRouteContent = `import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks';

/**
 * 保护路由组件 - 只允许已认证用户访问
 */
const ProtectedRoute = ({ redirectPath = '/login' }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();

  // 如果正在加载中，显示加载状态
  if (isLoading) {
    return <div className="loading">加载中...</div>;
  }
  
  // 检查用户是否已登录，未登录则重定向到登录页
  if (!isLoggedIn) {
    // 重定向到登录页面，但保存当前路径以便登录后跳回
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }
  
  // 渲染子路由
  return <Outlet />;
};

export default ProtectedRoute;
`;
    }
    
    await fs.writeFile(
      path.join(commonComponentsDir, `ProtectedRoute.${fileExt}`),
      protectedRouteContent,
      'utf-8'
    );
    
    console.log('[createCommonComponents] 已创建ProtectedRoute组件');
    
    // 创建Button组件
    let buttonContent = '';
    
    if (isTS) {
      buttonContent = `import React from 'react';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  type?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  block?: boolean;
  className?: string;
  [key: string]: any;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  block = false,
  className = '',
  ...rest
}) => {
  const classes = [
    'custom-button',
    \`custom-button--\${type}\`,
    \`custom-button--\${size}\`,
    block ? 'custom-button--block' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
`;
    } else {
      buttonContent = `import React from 'react';
import './Button.css';

const Button = ({
  children,
  type = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  block = false,
  className = '',
  ...rest
}) => {
  const classes = [
    'custom-button',
    \`custom-button--\${type}\`,
    \`custom-button--\${size}\`,
    block ? 'custom-button--block' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
`;
    }
    
    await fs.writeFile(
      path.join(commonComponentsDir, `Button.${fileExt}`),
      buttonContent,
      'utf-8'
    );
    
    console.log('[createCommonComponents] 已创建Button组件');
    
    // 创建按钮样式
    const buttonCssContent = `.custom-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
  }

  .custom-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* 按钮类型 */
  .custom-button--primary {
    background-color: #1890ff;
    color: white;
  }

  .custom-button--primary:hover:not(:disabled) {
    background-color: #40a9ff;
  }

  .custom-button--secondary {
    background-color: #f0f0f0;
    color: #333;
  }

  .custom-button--secondary:hover:not(:disabled) {
    background-color: #e0e0e0;
  }

  .custom-button--danger {
    background-color: #ff4d4f;
    color: white;
  }

  .custom-button--danger:hover:not(:disabled) {
    background-color: #ff7875;
  }

  .custom-button--ghost {
    background-color: transparent;
    border: 1px solid #1890ff;
    color: #1890ff;
  }

  .custom-button--ghost:hover:not(:disabled) {
    background-color: rgba(24, 144, 255, 0.1);
  }

  /* 按钮尺寸 */
  .custom-button--small {
    height: 28px;
    padding: 0 8px;
    font-size: 12px;
  }

  .custom-button--medium {
    height: 36px;
    padding: 0 16px;
    font-size: 14px;
  }

  .custom-button--large {
    height: 44px;
    padding: 0 24px;
    font-size: 16px;
  }

  /* 块级按钮 */
  .custom-button--block {
    display: flex;
    width: 100%;
  }
  `;
    
    await fs.writeFile(
      path.join(commonComponentsDir, 'Button.css'),
      buttonCssContent,
      'utf-8'
    );
    
    console.log('[createCommonComponents] 已创建Button样式');
    
    // 创建Card组件
    let cardContent = '';
    
    if (isTS) {
      cardContent = `import React from 'react';
import './Card.css';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', style }) => {
  const classes = ['custom-card', className].filter(Boolean).join(' ');
  
  return (
    <div className={classes} style={style}>
      {title && <div className="custom-card-header">{title}</div>}
      <div className="custom-card-body">{children}</div>
    </div>
  );
};

export default Card;
`;
    } else {
      cardContent = `import React from 'react';
import './Card.css';

const Card = ({ title, children, className = '', style }) => {
  const classes = ['custom-card', className].filter(Boolean).join(' ');
  
  return (
    <div className={classes} style={style}>
      {title && <div className="custom-card-header">{title}</div>}
      <div className="custom-card-body">{children}</div>
    </div>
  );
};

export default Card;
`;
    }
    
    await fs.writeFile(
      path.join(commonComponentsDir, `Card.${fileExt}`),
      cardContent,
      'utf-8'
    );
    
    console.log('[createCommonComponents] 已创建Card组件');
    
    // 创建卡片样式
    const cardCssContent = `.custom-card {
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }

  .custom-card-header {
    padding: 16px 24px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 16px;
    font-weight: 500;
  }

  .custom-card-body {
    padding: 24px;
  }
  `;
    
    await fs.writeFile(
      path.join(commonComponentsDir, 'Card.css'),
      cardCssContent,
      'utf-8'
    );
    
    console.log('[createCommonComponents] 已创建Card样式');
  } catch (error) {
    console.error('[createCommonComponents] 创建公共组件时出错:', error);
  }
}

module.exports = {
  createCommonComponents
}; 