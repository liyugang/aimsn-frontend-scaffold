'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * 创建API请求文件
 */
async function createApiFiles(apiDir, options) {
  const isTS = options.language === 'TypeScript';
  const fileExt = isTS ? 'ts' : 'js';
  
  // 创建index文件
  let indexContent = '';
  
  if (isTS) {
    indexContent = `// API请求入口文件
export * from './user'`;
  } else {
    indexContent = `// API请求入口文件
export * from './user'`;
  }
  
  await fs.writeFile(
    path.join(apiDir, `index.${fileExt}`),
    indexContent,
    'utf-8'
  );
  
  // 创建请求实例文件
  let requestContent = '';
  
  if (isTS) {
    requestContent = `import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { getToken } from '../utils/auth'
import { useUserStore } from '../store/user'

// 创建axios实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 15000
})

// 请求拦截器
request.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    const token = getToken()
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: \`Bearer \${token}\`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    
    // 根据自己的API响应格式进行修改
    if (res.code !== 0) {
      // 处理错误情况
      if (res.code === 401) {
        // Token过期
        const userStore = useUserStore()
        userStore.resetState()
      }
      return Promise.reject(new Error(res.message || '未知错误'))
    }
    
    return res
  },
  (error) => {
    // 处理网络错误
    let message = '网络错误'
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        // 未授权
        message = '未授权，请重新登录'
        const userStore = useUserStore()
        userStore.resetState()
      } else if (status === 403) {
        message = '拒绝访问'
      } else if (status === 404) {
        message = '请求的资源不存在'
      } else if (status === 500) {
        message = '服务器内部错误'
      }
    } else if (error.request) {
      message = '服务器无响应'
    } else {
      message = error.message
    }
    
    // 显示错误消息，如果使用Element Plus可以在这里调用消息提示
    console.error(\`[API Error] \${message}\`)
    
    return Promise.reject(error)
  }
)

export default request`;
  } else {
    requestContent = `import axios from 'axios'
import { getToken } from '../utils/auth'
import { useUserStore } from '../store/user'

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 15000
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: \`Bearer \${token}\`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    
    // 根据自己的API响应格式进行修改
    if (res.code !== 0) {
      // 处理错误情况
      if (res.code === 401) {
        // Token过期
        const userStore = useUserStore()
        userStore.resetState()
      }
      return Promise.reject(new Error(res.message || '未知错误'))
    }
    
    return res
  },
  (error) => {
    // 处理网络错误
    let message = '网络错误'
    if (error.response) {
      const status = error.response.status
      if (status === 401) {
        // 未授权
        message = '未授权，请重新登录'
        const userStore = useUserStore()
        userStore.resetState()
      } else if (status === 403) {
        message = '拒绝访问'
      } else if (status === 404) {
        message = '请求的资源不存在'
      } else if (status === 500) {
        message = '服务器内部错误'
      }
    } else if (error.request) {
      message = '服务器无响应'
    } else {
      message = error.message
    }
    
    // 显示错误消息，如果使用Element Plus可以在这里调用消息提示
    console.error(\`[API Error] \${message}\`)
    
    return Promise.reject(error)
  }
)

export default request`;
  }
  
  await fs.writeFile(
    path.join(apiDir, `request.${fileExt}`),
    requestContent,
    'utf-8'
  );
  
  // 创建用户API文件
  let userApiContent = '';
  
  if (isTS) {
    userApiContent = `import request from './request'

interface LoginParams {
  username: string;
  password: string;
}

export function login(username: string, password: string) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: { username, password }
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/auth/user-info',
    method: 'get'
  })
}`;
  } else {
    userApiContent = `import request from './request'

export function login(username, password) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: { username, password }
  })
}

export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  return request({
    url: '/auth/user-info',
    method: 'get'
  })
}`;
  }
  
  await fs.writeFile(
    path.join(apiDir, `user.${fileExt}`),
    userApiContent,
    'utf-8'
  );
}

module.exports = {
  createApiFiles
}; 