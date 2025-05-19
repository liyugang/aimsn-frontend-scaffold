'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * 创建工具函数文件
 */
async function createUtilsFiles(utilsDir, options) {
  console.log('[createUtilsFiles] 开始创建工具文件...');
  
  try {
    const isTS = options.language === 'TypeScript';
    const fileExt = isTS ? 'ts' : 'js';
    
    // 创建身份验证相关工具
    let authUtilContent = '';
    
    if (isTS) {
      authUtilContent = `// 身份验证相关工具函数

// token存储的key
const TOKEN_KEY = 'auth_token';

/**
 * 获取token
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * 设置token
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * 移除token
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * 检查用户是否已认证
 */
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token && !isTokenExpired(token);
};

/**
 * 解析JWT token
 */
export const parseJwt = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

/**
 * 检查token是否过期
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = parseJwt(token);
  if (!decoded) return true;
  
  // 获取当前时间（以秒为单位）
  const currentTime = Date.now() / 1000;
  
  // 检查令牌是否过期（考虑提前5分钟过期以防止边界情况）
  return decoded.exp < currentTime - 300;
};
`;
    } else {
      authUtilContent = `// 身份验证相关工具函数

// token存储的key
const TOKEN_KEY = 'auth_token';

/**
 * 获取token
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * 设置token
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * 移除token
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * 检查用户是否已认证
 */
export const isAuthenticated = () => {
  const token = getToken();
  return !!token && !isTokenExpired(token);
};

/**
 * 解析JWT token
 */
export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

/**
 * 检查token是否过期
 */
export const isTokenExpired = (token) => {
  const decoded = parseJwt(token);
  if (!decoded) return true;
  
  // 获取当前时间（以秒为单位）
  const currentTime = Date.now() / 1000;
  
  // 检查令牌是否过期（考虑提前5分钟过期以防止边界情况）
  return decoded.exp < currentTime - 300;
};
`;
    }
    
    await fs.writeFile(
      path.join(utilsDir, `auth.${fileExt}`),
      authUtilContent,
      'utf-8'
    );
    
    console.log('[createUtilsFiles] 已创建auth工具文件');
    
    // 创建日期处理工具
    let dateUtilContent = '';
    
    if (isTS) {
      dateUtilContent = `/**
 * 将日期格式化为指定格式的字符串
 */
export const formatDate = (
  date: Date | string | number,
  format: string = 'YYYY-MM-DD'
): string => {
  const d = new Date(date);
  
  const year = d.getFullYear().toString();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * 计算给定日期与当前日期之间的相对时间
 */
export const getRelativeTime = (date: Date | string | number): string => {
  const d = new Date(date);
  const now = new Date();
  
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return \`\${diffInSeconds}秒前\`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return \`\${diffInMinutes}分钟前\`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return \`\${diffInHours}小时前\`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return \`\${diffInDays}天前\`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return \`\${diffInMonths}个月前\`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return \`\${diffInYears}年前\`;
};

/**
 * 获取日期范围的开始和结束时间
 */
export const getDateRange = (
  range: 'today' | 'yesterday' | 'thisWeek' | 'thisMonth' | 'thisYear'
): { start: Date; end: Date } => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  
  switch (range) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'yesterday':
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case 'thisWeek':
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'thisMonth':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'thisYear':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
  }
  
  return { start, end };
};
`;
    } else {
      dateUtilContent = `/**
 * 将日期格式化为指定格式的字符串
 */
export const formatDate = (
  date,
  format = 'YYYY-MM-DD'
) => {
  const d = new Date(date);
  
  const year = d.getFullYear().toString();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const seconds = d.getSeconds().toString().padStart(2, '0');
  
  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
};

/**
 * 计算给定日期与当前日期之间的相对时间
 */
export const getRelativeTime = (date) => {
  const d = new Date(date);
  const now = new Date();
  
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return \`\${diffInSeconds}秒前\`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return \`\${diffInMinutes}分钟前\`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return \`\${diffInHours}小时前\`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return \`\${diffInDays}天前\`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return \`\${diffInMonths}个月前\`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return \`\${diffInYears}年前\`;
};

/**
 * 获取日期范围的开始和结束时间
 */
export const getDateRange = (
  range
) => {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);
  
  switch (range) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'yesterday':
      start.setDate(start.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      break;
    case 'thisWeek':
      start.setDate(start.getDate() - start.getDay());
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'thisMonth':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
    case 'thisYear':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;
  }
  
  return { start, end };
};
`;
    }
    
    await fs.writeFile(
      path.join(utilsDir, `date.${fileExt}`),
      dateUtilContent,
      'utf-8'
    );
    
    // 创建表单验证工具
    let validationUtilContent = '';
    
    if (isTS) {
      validationUtilContent = `/**
 * 检查邮箱格式是否有效
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * 检查密码是否符合强度要求（至少8个字符，包含大小写字母和数字）
 */
export const isStrongPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * 检查手机号格式是否有效（中国大陆手机号）
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^1[3456789]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 表单字段验证器
 */
export const validators = {
  required: (value: any, message: string = '此字段不能为空'): string | null => {
    if (value === undefined || value === null || value === '') {
      return message;
    }
    return null;
  },
  
  email: (value: string, message: string = '请输入有效的邮箱地址'): string | null => {
    if (!value) return null;
    return isValidEmail(value) ? null : message;
  },
  
  minLength: (length: number, message?: string) => {
    return (value: string): string | null => {
      if (!value) return null;
      return value.length >= length ? null : message || \`长度至少为\${length}个字符\`;
    };
  },
  
  maxLength: (length: number, message?: string) => {
    return (value: string): string | null => {
      if (!value) return null;
      return value.length <= length ? null : message || \`长度不能超过\${length}个字符\`;
    };
  },
  
  passwordMatch: (passwordField: string, message: string = '两次输入的密码不一致') => {
    return (value: string, formValues: Record<string, any>): string | null => {
      if (!value) return null;
      return value === formValues[passwordField] ? null : message;
    };
  },
  
  strongPassword: (message: string = '密码必须至少包含8个字符，包括大小写字母和数字'): ((value: string) => string | null) => {
    return (value: string): string | null => {
      if (!value) return null;
      return isStrongPassword(value) ? null : message;
    };
  }
};

/**
 * 验证表单值
 */
export const validateForm = (
  values: Record<string, any>,
  validationRules: Record<string, Array<(value: any, values: Record<string, any>) => string | null>>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.keys(validationRules).forEach(field => {
    const fieldValidators = validationRules[field];
    
    for (const validator of fieldValidators) {
      const error = validator(values[field], values);
      
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  
  return errors;
};
`;
    } else {
      validationUtilContent = `/**
 * 检查邮箱格式是否有效
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * 检查密码是否符合强度要求（至少8个字符，包含大小写字母和数字）
 */
export const isStrongPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * 检查手机号格式是否有效（中国大陆手机号）
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^1[3456789]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 表单字段验证器
 */
export const validators = {
  required: (value, message = '此字段不能为空') => {
    if (value === undefined || value === null || value === '') {
      return message;
    }
    return null;
  },
  
  email: (value, message = '请输入有效的邮箱地址') => {
    if (!value) return null;
    return isValidEmail(value) ? null : message;
  },
  
  minLength: (length, message) => {
    return (value) => {
      if (!value) return null;
      return value.length >= length ? null : message || \`长度至少为\${length}个字符\`;
    };
  },
  
  maxLength: (length, message) => {
    return (value) => {
      if (!value) return null;
      return value.length <= length ? null : message || \`长度不能超过\${length}个字符\`;
    };
  },
  
  passwordMatch: (passwordField, message = '两次输入的密码不一致') => {
    return (value, formValues) => {
      if (!value) return null;
      return value === formValues[passwordField] ? null : message;
    };
  },
  
  strongPassword: (message = '密码必须至少包含8个字符，包括大小写字母和数字') => {
    return (value) => {
      if (!value) return null;
      return isStrongPassword(value) ? null : message;
    };
  }
};

/**
 * 验证表单值
 */
export const validateForm = (values, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const fieldValidators = validationRules[field];
    
    for (const validator of fieldValidators) {
      const error = validator(values[field], values);
      
      if (error) {
        errors[field] = error;
        break;
      }
    }
  });
  
  return errors;
};
`;
    }
    
    await fs.writeFile(
      path.join(utilsDir, `validation.${fileExt}`),
      validationUtilContent,
      'utf-8'
    );
    
    // 创建通用工具函数
    let commonUtilContent = '';
    
    if (isTS) {
      commonUtilContent = `/**
 * 防抖函数：在一定时间内多次调用只执行最后一次
 */
export const debounce = <F extends (...args: any[]) => any>(func: F, wait: number): ((...args: Parameters<F>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<F>): void {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
};

/**
 * 节流函数：确保函数在一定时间内最多执行一次
 */
export const throttle = <F extends (...args: any[]) => any>(func: F, limit: number): ((...args: Parameters<F>) => void) => {
  let inThrottle = false;
  
  return function(...args: Parameters<F>): void {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * 深拷贝对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T;
  }
  
  if (obj instanceof Object) {
    const copy = {} as Record<string, any>;
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone((obj as Record<string, any>)[key]);
    });
    return copy as T;
  }
  
  throw new Error(\`Unable to copy object: \${obj}\`);
};

/**
 * 格式化金额（添加千位分隔符）
 */
export const formatCurrency = (amount: number, locale: string = 'zh-CN', currency: string = 'CNY'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * 随机字符串生成
 */
export const generateRandomString = (length: number): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

/**
 * 对象转查询字符串
 */
export const objectToQueryString = (obj: Record<string, any>): string => {
  return Object.keys(obj)
    .filter(key => obj[key] !== undefined && obj[key] !== null)
    .map(key => \`\${encodeURIComponent(key)}=\${encodeURIComponent(obj[key])}\`)
    .join('&');
};

/**
 * 从URL获取查询参数
 */
export const getQueryParams = (): Record<string, string> => {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
};
`;
    } else {
      commonUtilContent = `/**
 * 防抖函数：在一定时间内多次调用只执行最后一次
 */
export const debounce = (func, wait) => {
  let timeout = null;
  
  return function(...args) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
  };
};

/**
 * 节流函数：确保函数在一定时间内最多执行一次
 */
export const throttle = (func, limit) => {
  let inThrottle = false;
  
  return function(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * 深拷贝对象
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (obj instanceof Object) {
    const copy = {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepClone(obj[key]);
    });
    return copy;
  }
  
  throw new Error(\`Unable to copy object: \${obj}\`);
};

/**
 * 格式化金额（添加千位分隔符）
 */
export const formatCurrency = (amount, locale = 'zh-CN', currency = 'CNY') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

/**
 * 随机字符串生成
 */
export const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

/**
 * 对象转查询字符串
 */
export const objectToQueryString = (obj) => {
  return Object.keys(obj)
    .filter(key => obj[key] !== undefined && obj[key] !== null)
    .map(key => \`\${encodeURIComponent(key)}=\${encodeURIComponent(obj[key])}\`)
    .join('&');
};

/**
 * 从URL获取查询参数
 */
export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  
  params.forEach((value, key) => {
    result[key] = value;
  });
  
  return result;
};
`;
    }
    
    await fs.writeFile(
      path.join(utilsDir, `common.${fileExt}`),
      commonUtilContent,
      'utf-8'
    );
    
    // 创建工具函数索引文件
    let indexContent = '';
    
    if (isTS) {
      indexContent = `export * from './auth';
export * from './date';
export * from './validation';
export * from './common';
`;
    } else {
      indexContent = `export * from './auth';
export * from './date';
export * from './validation';
export * from './common';
`;
    }
    
    await fs.writeFile(
      path.join(utilsDir, `index.${fileExt}`),
      indexContent,
      'utf-8'
    );
    
    // 创建存储工具
    let storageContent = '';
    
    if (isTS) {
      storageContent = `// 存储令牌的键名
const TOKEN_KEY = 'auth_token';

/**
 * 从本地存储中获取令牌
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * 将令牌存储到本地存储
 */
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * 从本地存储中移除令牌
 */
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * 检查是否已认证
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * 解析JWT令牌并获取有效负载
 */
export const parseJwt = (token: string): any => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

/**
 * 检查JWT令牌是否已过期
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = parseJwt(token);
  if (!payload) return true;
  
  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
};
`;
    } else {
      storageContent = `// 存储令牌的键名
const TOKEN_KEY = 'auth_token';

/**
 * 从本地存储中获取令牌
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * 将令牌存储到本地存储
 */
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * 从本地存储中移除令牌
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * 检查是否已认证
 */
export const isAuthenticated = () => {
  return !!getToken();
};

/**
 * 解析JWT令牌并获取有效负载
 */
export const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

/**
 * 检查JWT令牌是否已过期
 */
export const isTokenExpired = (token) => {
  const payload = parseJwt(token);
  if (!payload) return true;
  
  const currentTime = Date.now() / 1000;
  return payload.exp < currentTime;
};
`;
    }
    
    await fs.writeFile(
      path.join(utilsDir, `storage.${fileExt}`),
      storageContent,
      'utf-8'
    );
    
    // 创建 mock 目录和文件
    await createMockFiles(utilsDir, options);
  } catch (error) {
    console.error('[createUtilsFiles] 创建工具文件时发生错误:', error);
  }
}

/**
 * 创建 mock 数据文件
 */
async function createMockFiles(utilsDir, options) {
  const isTS = options.language === 'TypeScript';
  const fileExt = isTS ? 'ts' : 'js';
  
  // 创建 mock 目录
  const mockDir = path.join(utilsDir, '../mock');
  await fs.mkdir(mockDir, { recursive: true });
  
  // 创建 mock 入口文件
  let mockIndexContent = '';
  
  if (isTS) {
    mockIndexContent = `import { setupMock } from './setup'

// 从环境变量中获取是否启用 mock
const enableMock = import.meta.env.VITE_APP_MOCK === 'true'

// 仅在启用 mock 时执行
if (enableMock) {
  setupMock()
  console.log('Mock 数据服务已启动')
}

export default {}
`;
  } else {
    mockIndexContent = `import { setupMock } from './setup'

// 从环境变量中获取是否启用 mock
const enableMock = import.meta.env.VITE_APP_MOCK === 'true'

// 仅在启用 mock 时执行
if (enableMock) {
  setupMock()
  console.log('Mock 数据服务已启动')
}

export default {}
`;
  }
  
  await fs.writeFile(
    path.join(mockDir, `index.${fileExt}`),
    mockIndexContent,
    'utf-8'
  );
  
  // 创建 mock 设置文件
  let mockSetupContent = '';
  
  if (isTS) {
    mockSetupContent = `import Mock from 'mockjs'
import { getToken } from '../utils/auth'

// 模拟延迟时间
const timeout = 300

// 模拟用户数据
const users = [
  {
    userId: '1',
    username: 'admin',
    password: 'password',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    roles: ['admin']
  },
  {
    userId: '2',
    username: 'user',
    password: 'password',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
    roles: ['user']
  },
  {
    userId: '3',
    username: 'guest',
    password: 'password',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
    roles: ['guest']
  }
]

// 模拟响应函数
function response(status: number, data: any, message: string = 'success') {
  return {
    code: status === 200 ? 0 : status,
    data,
    message
  }
}

// 模拟请求延迟函数
function delay() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, timeout)
  })
}

export function setupMock() {
  // 设置全局延迟
  Mock.setup({
    timeout: 400
  })

  // 模拟登录接口
  Mock.mock(/\\/auth\\/login/, function(options) {
    const { username, password } = JSON.parse(options.body)
    const user = users.find(
      (user) => user.username === username && user.password === password
    )
    
    if (user) {
      return response(200, {
        token: 'mock_token_' + username
      })
    } else {
      return response(401, null, '用户名或密码错误')
    }
  })
  
  // 模拟退出登录接口
  Mock.mock(/\\/auth\\/logout/, 'post', function() {
    return response(200, null, '退出成功')
  })
  
  // 模拟获取用户信息接口
  Mock.mock(/\\/auth\\/user-info/, 'get', function(options) {
    // 从 getToken 获取 token
    const username = getToken()?.replace('mock_token_', '')
    
    const user = users.find((user) => user.username === username)
    
    if (user) {
      const { password, ...rest } = user
      return response(200, rest)
    } else {
      return response(401, null, '未授权')
    }
  })
}
`;
  } else {
    mockSetupContent = `import Mock from 'mockjs'
import { getToken } from '../utils/auth'

// 模拟延迟时间
const timeout = 300

// 模拟用户数据
const users = [
  {
    userId: '1',
    username: 'admin',
    password: 'password',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    roles: ['admin']
  },
  {
    userId: '2',
    username: 'user',
    password: 'password',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
    roles: ['user']
  },
  {
    userId: '3',
    username: 'guest',
    password: 'password',
    avatar: 'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
    roles: ['guest']
  }
]

// 模拟响应函数
function response(status, data, message = 'success') {
  return {
    code: status === 200 ? 0 : status,
    data,
    message
  }
}

// 模拟请求延迟函数
function delay() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, timeout)
  })
}

export function setupMock() {
  // 设置全局延迟
  Mock.setup({
    timeout: 400
  })

  // 模拟登录接口
  Mock.mock(/\\/auth\\/login/, function(options) {
    const { username, password } = JSON.parse(options.body)
    const user = users.find(
      (user) => user.username === username && user.password === password
    )
    
    if (user) {
      return response(200, {
        token: 'mock_token_' + username
      })
    } else {
      return response(401, null, '用户名或密码错误')
    }
  })
  
  // 模拟退出登录接口
  Mock.mock(/\\/auth\\/logout/, function() {
    return response(200, null, '退出成功')
  })
  
  // 模拟获取用户信息接口
  Mock.mock(/\\/auth\\/user-info/, function(options) {
    // 从 getToken 获取 token
    const username = getToken()?.replace('mock_token_', '')
    
    const user = users.find((user) => user.username === username)
    
    if (user) {
      const { password, ...rest } = user
      return response(200, rest)
    } else {
      return response(401, null, '未授权')
    }
  })
}
`;
  }
  
  await fs.writeFile(
    path.join(mockDir, `index.${fileExt}`),
    mockIndexContent,
    'utf-8'
  );
  
  // 创建 mock 设置文件
  await fs.writeFile(
    path.join(mockDir, `setup.${fileExt}`),
    mockSetupContent,
    'utf-8'
  );
}

module.exports = {
  createUtilsFiles
}; 