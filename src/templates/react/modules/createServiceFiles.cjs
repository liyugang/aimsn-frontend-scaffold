'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * 创建API服务文件
 */
async function createServiceFiles(servicesDir, options) {
  console.log('[createServiceFiles] 开始创建API服务文件...');
  
  try {
    const isTS = options.language === 'TypeScript';
    const fileExt = isTS ? 'ts' : 'js';
    
    // 创建API客户端
    let apiClientContent = '';
    
    if (isTS) {
      apiClientContent = `import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getToken, removeToken } from '../utils/auth';

// 创建axios实例
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 请求拦截器：在请求发送前添加token
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器：处理响应数据和错误
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回响应数据
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      // 请求已发出，服务器返回状态码不在2xx范围内
      const status = error.response.status;
      
      // 处理401未授权错误
      if (status === 401) {
        console.error('未授权访问或token已过期');
        // 清除token
        removeToken();
        // 可以在这里重定向到登录页面
        window.location.href = '/login';
      } 
      
      // 记录其他错误
      console.error('API响应错误:', {
        status,
        url: error.config?.url,
        data: error.response.data
      });
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('网络错误，未收到响应:', error.request);
    } else {
      // 在设置请求时发生错误
      console.error('请求配置错误:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API客户端
const apiClient = {
  // GET请求
  get: async <T>(url: string, params?: Record<string, any>): Promise<T> => {
    try {
      return await axiosInstance.get(url, { params });
    } catch (error) {
      console.error(\`GET \${url} 请求失败\`, error);
      throw error;
    }
  },
  
  // POST请求
  post: async <T>(url: string, data?: any): Promise<T> => {
    try {
      return await axiosInstance.post(url, data);
    } catch (error) {
      console.error(\`POST \${url} 请求失败\`, error);
      throw error;
    }
  },
  
  // PUT请求
  put: async <T>(url: string, data?: any): Promise<T> => {
    try {
      return await axiosInstance.put(url, data);
    } catch (error) {
      console.error(\`PUT \${url} 请求失败\`, error);
      throw error;
    }
  },
  
  // PATCH请求
  patch: async <T>(url: string, data?: any): Promise<T> => {
    try {
      return await axiosInstance.patch(url, data);
    } catch (error) {
      console.error(\`PATCH \${url} 请求失败\`, error);
      throw error;
    }
  },
  
  // DELETE请求
  delete: async <T>(url: string): Promise<T> => {
    try {
      return await axiosInstance.delete(url);
    } catch (error) {
      console.error(\`DELETE \${url} 请求失败\`, error);
      throw error;
    }
  }
};

export default apiClient;
`;
    } else {
      apiClientContent = `import axios from 'axios';
import { getToken, removeToken } from '../utils/auth';

// 创建axios实例
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 请求拦截器：在请求发送前添加token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => {
    console.error('请求拦截器错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器：处理响应数据和错误
axiosInstance.interceptors.response.use(
  (response) => {
    // 直接返回响应数据
    return response.data;
  },
  (error) => {
    if (error.response) {
      // 请求已发出，服务器返回状态码不在2xx范围内
      const status = error.response.status;
      
      // 处理401未授权错误
      if (status === 401) {
        console.error('未授权访问或token已过期');
        // 清除token
        removeToken();
        // 可以在这里重定向到登录页面
        window.location.href = '/login';
      } 
      
      // 记录其他错误
      console.error('API响应错误:', {
        status,
        url: error.config?.url,
        data: error.response.data
      });
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error('网络错误，未收到响应:', error.request);
    } else {
      // 在设置请求时发生错误
      console.error('请求配置错误:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API客户端
const apiClient = {
  // GET请求
  get: async (url, params) => {
    try {
      return await axiosInstance.get(url, { params });
    } catch (error) {
      console.error(\`GET \${url} 请求失败\`, error);
      throw error;
    }
  },
  
  // POST请求
  post: async (url, data) => {
    try {
      return await axiosInstance.post(url, data);
    } catch (error) {
      console.error(\`POST \${url} 请求失败\`, error);
      throw error;
    }
  },
  
  // PUT请求
  put: async (url, data) => {
    try {
      return await axiosInstance.put(url, data);
    } catch (error) {
      console.error(\`PUT \${url} 请求失败\`, error);
      throw error;
    }
  },
  
  // PATCH请求
  patch: async (url, data) => {
    try {
      return await axiosInstance.patch(url, data);
    } catch (error) {
      console.error(\`PATCH \${url} 请求失败\`, error);
      throw error;
    }
  },
  
  // DELETE请求
  delete: async (url) => {
    try {
      return await axiosInstance.delete(url);
    } catch (error) {
      console.error(\`DELETE \${url} 请求失败\`, error);
      throw error;
    }
  }
};

export default apiClient;
`;
    }
    
    await fs.writeFile(
      path.join(servicesDir, `apiClient.${fileExt}`),
      apiClientContent,
      'utf-8'
    );
    
    console.log('[createServiceFiles] 已创建apiClient文件');
    
    // 创建用户服务
    let userServiceContent = '';
    
    if (isTS) {
      userServiceContent = `import apiClient from './apiClient';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreateInput {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export interface UserUpdateInput {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

export interface UserPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface UserPaginationResult {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 用户服务
const userService = {
  // 获取用户列表
  getUsers: async (params?: UserPaginationParams): Promise<UserPaginationResult> => {
    return apiClient.get('/users', params);
  },
  
  // 获取单个用户
  getUser: async (id: string): Promise<User> => {
    return apiClient.get(\`/users/\${id}\`);
  },
  
  // 创建用户
  createUser: async (userData: UserCreateInput): Promise<User> => {
    return apiClient.post('/users', userData);
  },
  
  // 更新用户
  updateUser: async (id: string, userData: UserUpdateInput): Promise<User> => {
    return apiClient.put(\`/users/\${id}\`, userData);
  },
  
  // 删除用户
  deleteUser: async (id: string): Promise<void> => {
    return apiClient.delete(\`/users/\${id}\`);
  }
};

export default userService;
`;
    } else {
      userServiceContent = `import apiClient from './apiClient';

// 用户服务
const userService = {
  // 获取用户列表
  getUsers: async (params) => {
    return apiClient.get('/users', params);
  },
  
  // 获取单个用户
  getUser: async (id) => {
    return apiClient.get(\`/users/\${id}\`);
  },
  
  // 创建用户
  createUser: async (userData) => {
    return apiClient.post('/users', userData);
  },
  
  // 更新用户
  updateUser: async (id, userData) => {
    return apiClient.put(\`/users/\${id}\`, userData);
  },
  
  // 删除用户
  deleteUser: async (id) => {
    return apiClient.delete(\`/users/\${id}\`);
  }
};

export default userService;
`;
    }
    
    await fs.writeFile(
      path.join(servicesDir, `userService.${fileExt}`),
      userServiceContent,
      'utf-8'
    );
    
    // 创建身份验证服务
    let authServiceContent = '';
    
    if (isTS) {
      authServiceContent = `import apiClient from './apiClient';
import { setToken, removeToken } from '../utils/auth';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    name: string;
    email: string;
    role: string;
  };
}

interface UserResponse {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
}

interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

const authService = {
  /**
   * 用户登录
   * @param {LoginRequest} credentials - 用户凭据
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
      if (response.token) {
        setToken(response.token);
      }
      return response;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  /**
   * 用户登出
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post<void>('/auth/logout');
    } catch (error) {
      console.error('登出请求失败:', error);
      // 即使API请求失败，也需要清除本地token
    } finally {
      removeToken();
    }
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser: async (): Promise<UserResponse> => {
    return await apiClient.get<UserResponse>('/auth/me');
  },

  /**
   * 修改密码
   * @param {ChangePasswordRequest} data - 密码修改请求
   */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    return await apiClient.post<void>('/auth/change-password', data);
  }
};

export default authService;
`;
    } else {
      authServiceContent = `import apiClient from './apiClient';
import { setToken, removeToken } from '../utils/auth';

const authService = {
  /**
   * 用户登录
   * @param {string} username - 用户名
   * @param {string} password - 密码
   */
  login: async (username, password) => {
    try {
      const response = await apiClient.post('/auth/login', { username, password });
      if (response.token) {
        setToken(response.token);
      }
      return response;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  /**
   * 用户登出
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('登出请求失败:', error);
      // 即使API请求失败，也需要清除本地token
    } finally {
      removeToken();
    }
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser: async () => {
    return await apiClient.get('/auth/me');
  },

  /**
   * 修改密码
   * @param {Object} data - 密码修改请求
   * @param {string} data.oldPassword - 旧密码
   * @param {string} data.newPassword - 新密码
   */
  changePassword: async (data) => {
    return await apiClient.post('/auth/change-password', data);
  }
};

export default authService;
`;
    }
    
    await fs.writeFile(
      path.join(servicesDir, `authService.${fileExt}`),
      authServiceContent,
      'utf-8'
    );
    
    console.log('[createServiceFiles] 已创建authService文件');
    
    // 创建API服务索引文件
    let indexContent = '';
    
    if (isTS) {
      indexContent = `import apiClient from './apiClient';
import userService from './userService';
import authService from './authService';

export {
  apiClient,
  userService,
  authService
};
`;
    } else {
      indexContent = `import apiClient from './apiClient';
import userService from './userService';
import authService from './authService';

export {
  apiClient,
  userService,
  authService
};
`;
    }
    
    await fs.writeFile(
      path.join(servicesDir, `index.${fileExt}`),
      indexContent,
      'utf-8'
    );
    
    console.log('[createServiceFiles] API服务文件创建完成');
  } catch (error) {
    console.error('[createServiceFiles] 创建API服务文件时出错:', error);
    throw error;
  }
}

module.exports = {
  createServiceFiles
}; 