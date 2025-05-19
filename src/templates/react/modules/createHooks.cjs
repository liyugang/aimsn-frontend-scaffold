'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * 创建自定义钩子
 */
async function createCustomHooks(hooksDir, options) {
  console.log('[createCustomHooks] 开始创建自定义钩子...');
  
  try {
    const isTS = options.language === 'TypeScript';
    const fileExt = isTS ? 'ts' : 'js';
    
    // 因为我们已经在AuthContext中定义了useAuth，这里不需要再创建
    // 但我们可以创建一个辅助文件来重新导出它，便于导入
    let useAuthContent = '';
    
    if (isTS) {
      useAuthContent = `// 重新导出AuthContext中的useAuth钩子
export { useAuth } from '../context/AuthContext';
`;
    } else {
      useAuthContent = `// 重新导出AuthContext中的useAuth钩子
export { useAuth } from '../context/AuthContext';
`;
    }
    
    await fs.writeFile(
      path.join(hooksDir, `useAuth.${fileExt}`),
      useAuthContent,
      'utf-8'
    );
    
    console.log('[createCustomHooks] 已创建useAuth钩子');
    
    // 创建useLocalStorage钩子
    let useLocalStorageContent = '';
    
    if (isTS) {
      useLocalStorageContent = `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // 获取初始值
  const readValue = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(\`Error reading localStorage key "\${key}":, error\`);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // 设置新值的函数
  const setValue = (value: T) => {
    try {
      // 允许值是一个函数，这样我们就有了和useState相同的API
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // 保存state
      setStoredValue(valueToStore);
      
      // 保存到localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // 触发自定义事件，这样其他组件可以监听到这个改变
        window.dispatchEvent(new Event('local-storage'));
      }
    } catch (error) {
      console.warn(\`Error setting localStorage key "\${key}":, error\`);
    }
  };

  // 当其他组件更新同一个localStorage时更新本地状态
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };
    
    // 当存储变化时处理时间
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, []);

  return [storedValue, setValue];
}

export default useLocalStorage;
`;
    } else {
      useLocalStorageContent = `import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // 获取初始值
  const readValue = () => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(\`Error reading localStorage key "\${key}":, error\`);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readValue());

  // 设置新值的函数
  const setValue = (value) => {
    try {
      // 允许值是一个函数，这样我们就有了和useState相同的API
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // 保存state
      setStoredValue(valueToStore);
      
      // 保存到localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // 触发自定义事件，这样其他组件可以监听到这个改变
        window.dispatchEvent(new Event('local-storage'));
      }
    } catch (error) {
      console.warn(\`Error setting localStorage key "\${key}":, error\`);
    }
  };

  // 当其他组件更新同一个localStorage时更新本地状态
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };
    
    // 当存储变化时处理时间
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage', handleStorageChange);
    };
  }, []);

  return [storedValue, setValue];
}

export default useLocalStorage;
`;
    }
    
    await fs.writeFile(
      path.join(hooksDir, `useLocalStorage.${fileExt}`),
      useLocalStorageContent,
      'utf-8'
    );
    
    console.log('[createCustomHooks] 已创建useLocalStorage钩子');
    
    // 创建index.js
    const indexContent = `export { useAuth } from '../context/AuthContext';
export { default as useLocalStorage } from './useLocalStorage';
`;
    
    await fs.writeFile(
      path.join(hooksDir, `index.${fileExt}`),
      indexContent,
      'utf-8'
    );
    
    console.log('[createCustomHooks] 自定义钩子创建完成');
  } catch (error) {
    console.error('[createCustomHooks] 创建自定义钩子时出错:', error);
    throw error;
  }
}

module.exports = {
  createCustomHooks
}; 