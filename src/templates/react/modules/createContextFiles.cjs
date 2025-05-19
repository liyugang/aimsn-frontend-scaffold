'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * 创建上下文文件
 */
async function createContextFiles(contextDir, options) {
  console.log('[createContextFiles] 开始创建上下文文件...');
  
  try {
    const isTS = options.language === 'TypeScript';
    const fileExt = isTS ? 'tsx' : 'jsx';
    
    // 创建AuthContext
    let authContextContent = '';
    
    if (isTS) {
      authContextContent = `import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';
import { isAuthenticated } from '../utils/auth';

// 定义用户类型
interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
}

// 定义登录参数接口
interface LoginCredentials {
  username: string;
  password: string;
}

// 定义认证上下文类型
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  login: (credentials: LoginCredentials) => Promise<any>;
  logout: () => Promise<void>;
}

// 定义属性类型
interface AuthProviderProps {
  children: React.ReactNode;
}

// 创建一个认证上下文
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 认证提供者组件
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(isAuthenticated());

  // 加载用户
  const loadUser = async () => {
    if (!isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsLoggedIn(true);
    } catch (err: any) {
      console.error('加载用户信息失败:', err);
      setError(err.message || '加载用户信息失败');
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 首次加载时获取用户信息
  useEffect(() => {
    loadUser();
  }, []);

  // 登录方法
  const login = async ({ username, password }: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login({ username, password });
      setUser(response.user);
      setIsLoggedIn(true);
      return response;
    } catch (err: any) {
      setError(err.message || '登录失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出方法
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (err: any) {
      console.error('登出失败:', err);
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        isLoggedIn,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 使用认证上下文的自定义Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
};

export default AuthContext;
`;
    } else {
      authContextContent = `import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';
import { isAuthenticated } from '../utils/auth';

// 创建一个认证上下文
export const AuthContext = createContext();

// 认证提供者组件
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  // 加载用户
  const loadUser = async () => {
    if (!isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsLoggedIn(true);
    } catch (err) {
      console.error('加载用户信息失败:', err);
      setError(err.message || '加载用户信息失败');
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 首次加载时获取用户信息
  useEffect(() => {
    loadUser();
  }, []);

  // 登录方法
  const login = async ({username, password}) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login({ username, password });
      setUser(response.user);
      setIsLoggedIn(true);
      return response;
    } catch (err) {
      setError(err.message || '登录失败');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出方法
  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout();
    } catch (err) {
      console.error('登出失败:', err);
    } finally {
      setUser(null);
      setIsLoggedIn(false);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        isLoggedIn,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 使用认证上下文的自定义Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
};

export default AuthContext;
`;
    }
    
    await fs.writeFile(
      path.join(contextDir, `AuthContext.${fileExt}`),
      authContextContent,
      'utf-8'
    );
    
    console.log('[createContextFiles] 已创建AuthContext');
    
    // 创建ThemeContext
    let themeContextContent = '';
    
    if (isTS) {
      themeContextContent = `import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '../hooks';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // 从localStorage获取主题或使用默认主题
  const [theme, setTheme] = useLocalStorage<ThemeMode>('theme', 'light');
  
  // 切换主题
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // 当主题变化时，更新文档根元素的data-theme属性
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  const value = {
    theme,
    toggleTheme
  };
  
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// 自定义hook以简化使用
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};`;
    } else {
      themeContextContent = `import React, { createContext, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  // 从localStorage获取主题或使用默认主题
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  // 切换主题
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  
  // 当主题变化时，更新文档根元素的data-theme属性
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  const value = {
    theme,
    toggleTheme
  };
  
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// 自定义hook以简化使用
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};`;
    }
    
    await fs.writeFile(
      path.join(contextDir, `ThemeContext.${fileExt}`),
      themeContextContent,
      'utf-8'
    );
    
    // 创建index.js
    const indexContent = `export { AuthContext, AuthProvider, useAuth } from './AuthContext';
export { ThemeContext, ThemeProvider, useTheme } from './ThemeContext';
`;
    
    await fs.writeFile(
      path.join(contextDir, `index.${fileExt.replace('x', '')}`),
      indexContent,
      'utf-8'
    );
    
    console.log('[createContextFiles] 上下文文件创建完成');
  } catch (error) {
    console.error('[createContextFiles] 创建上下文文件时出错:', error);
    throw error;
  }
}

module.exports = {
  createContextFiles
}; 