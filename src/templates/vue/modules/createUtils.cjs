'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * 创建工具函数文件
 */
async function createUtilsFiles(utilsDir, options) {
  const isTS = options.language === 'TypeScript';
  const fileExt = isTS ? 'ts' : 'js';
  
  // 创建index文件
  let indexContent = '';
  
  if (isTS) {
    indexContent = `// 工具函数入口文件
export * from './auth'
export * from './validation'
export * from './date'
export * from './storage'`;
  } else {
    indexContent = `// 工具函数入口文件
export * from './auth'
export * from './validation'
export * from './date'
export * from './storage'`;
  }
  
  await fs.writeFile(
    path.join(utilsDir, `index.${fileExt}`),
    indexContent,
    'utf-8'
  );
  
  // 创建认证工具
  let authContent = '';
  
  if (isTS) {
    authContent = `// 认证相关工具函数
const TOKEN_KEY = 'access_token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}`;
  } else {
    authContent = `// 认证相关工具函数
const TOKEN_KEY = 'access_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY)
}`;
  }
  
  await fs.writeFile(
    path.join(utilsDir, `auth.${fileExt}`),
    authContent,
    'utf-8'
  );
  
  // 创建验证工具
  let validationContent = '';
  
  if (isTS) {
    validationContent = `// 验证相关工具函数
export function isEmail(value: string): boolean {
  return /^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$/.test(value)
}

export function isPhone(value: string): boolean {
  return /^1[3-9]\\d{9}$/.test(value)
}

export function isURL(value: string): boolean {
  return /^https?:\\/\\/([\\w-]+\\.)+[\\w-]+(\\/[\\w-./?%&=]*)?$/.test(value)
}`;
  } else {
    validationContent = `// 验证相关工具函数
export function isEmail(value) {
  return /^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$/.test(value)
}

export function isPhone(value) {
  return /^1[3-9]\\d{9}$/.test(value)
}

export function isURL(value) {
  return /^https?:\\/\\/([\\w-]+\\.)+[\\w-]+(\\/[\\w-./?%&=]*)?$/.test(value)
}`;
  }
  
  await fs.writeFile(
    path.join(utilsDir, `validation.${fileExt}`),
    validationContent,
    'utf-8'
  );
  
  // 创建日期工具
  let dateContent = '';
  
  if (isTS) {
    dateContent = `// 日期相关工具函数
export function formatDate(date: Date, fmt: string = 'YYYY-MM-DD'): string {
  const o: { [key: string]: number } = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  }
  
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k].toString() : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  
  return fmt
}

export function timeAgo(time: Date | string): string {
  const date = typeof time === 'string' ? new Date(time) : time
  const now = new Date()
  const diff = (now.getTime() - date.getTime()) / 1000
  
  if (diff < 60) {
    return '刚刚'
  } else if (diff < 3600) {
    return Math.floor(diff / 60) + '分钟前'
  } else if (diff < 86400) {
    return Math.floor(diff / 3600) + '小时前'
  } else if (diff < 2592000) {
    return Math.floor(diff / 86400) + '天前'
  } else {
    return formatDate(date)
  }
}`;
  } else {
    dateContent = `// 日期相关工具函数
export function formatDate(date, fmt = 'YYYY-MM-DD') {
  const o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  }
  
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k].toString() : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  
  return fmt
}

export function timeAgo(time) {
  const date = typeof time === 'string' ? new Date(time) : time
  const now = new Date()
  const diff = (now.getTime() - date.getTime()) / 1000
  
  if (diff < 60) {
    return '刚刚'
  } else if (diff < 3600) {
    return Math.floor(diff / 60) + '分钟前'
  } else if (diff < 86400) {
    return Math.floor(diff / 3600) + '小时前'
  } else if (diff < 2592000) {
    return Math.floor(diff / 86400) + '天前'
  } else {
    return formatDate(date)
  }
}`;
  }
  
  await fs.writeFile(
    path.join(utilsDir, `date.${fileExt}`),
    dateContent,
    'utf-8'
  );
  
  // 创建存储工具
  let storageContent = '';
  
  if (isTS) {
    storageContent = `// 存储相关工具函数
export function getItem<T>(key: string, defaultValue: T | null = null): T | null {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('getItem error:', error)
    return defaultValue
  }
}

export function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('setItem error:', error)
  }
}

export function removeItem(key: string): void {
  localStorage.removeItem(key)
}

export function clearItems(): void {
  localStorage.clear()
}

export function getSessionItem<T>(key: string, defaultValue: T | null = null): T | null {
  try {
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('getSessionItem error:', error)
    return defaultValue
  }
}

export function setSessionItem<T>(key: string, value: T): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('setSessionItem error:', error)
  }
}

export function removeSessionItem(key: string): void {
  sessionStorage.removeItem(key)
}

export function clearSessionItems(): void {
  sessionStorage.clear()
}`;
  } else {
    storageContent = `// 存储相关工具函数
export function getItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('getItem error:', error)
    return defaultValue
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('setItem error:', error)
  }
}

export function removeItem(key) {
  localStorage.removeItem(key)
}

export function clearItems() {
  localStorage.clear()
}

export function getSessionItem(key, defaultValue = null) {
  try {
    const item = sessionStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error('getSessionItem error:', error)
    return defaultValue
  }
}

export function setSessionItem(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('setSessionItem error:', error)
  }
}

export function removeSessionItem(key) {
  sessionStorage.removeItem(key)
}

export function clearSessionItems() {
  sessionStorage.clear()
}`;
  }
  
  await fs.writeFile(
    path.join(utilsDir, `storage.${fileExt}`),
    storageContent,
    'utf-8'
  );
  
  // 创建 mock 目录和文件
  await createMockFiles(utilsDir, options);
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
  Mock.mock(/\\/auth\\/login function(options) {
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
    path.join(mockDir, `setup.${fileExt}`),
    mockSetupContent,
    'utf-8'
  );
}

module.exports = {
  createUtilsFiles
}; 