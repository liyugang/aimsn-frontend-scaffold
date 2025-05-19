'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * 创建状态管理文件
 */
async function createStoreFiles(storeDir, options) {
  const isTS = options.language === 'TypeScript';
  const fileExt = isTS ? 'ts' : 'js';
  
  // 创建index文件
  let indexContent = '';
  
  if (isTS) {
    indexContent = `// 状态管理入口文件
export * from './user'`;
  } else {
    indexContent = `// 状态管理入口文件
export * from './user'`;
  }
  
  await fs.writeFile(
    path.join(storeDir, `index.${fileExt}`),
    indexContent,
    'utf-8'
  );
  
  // 创建user store文件
  let userStoreContent = '';
  
  if (isTS) {
    userStoreContent = `import { defineStore } from 'pinia'
import { login, logout, getUserInfo } from '../api/user'
import { setToken, removeToken, getToken } from '../utils/auth'

interface UserState {
  token: string | null;
  userId: string | null;
  username: string | null;
  avatar: string | null;
  roles: string[];
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    token: getToken(),
    userId: null,
    username: null,
    avatar: null,
    roles: []
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    hasRole: (state) => (role: string) => state.roles.includes(role)
  },
  
  actions: {
    async loginAction(username: string, password: string) {
      try {
        const response = await login(username, password)
        const { token } = response.data
        
        this.token = token
        setToken(token)
        
        // 获取用户信息
        await this.getUserInfoAction()
        
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    async getUserInfoAction() {
      try {
        const response = await getUserInfo()
        const { userId, username, avatar, roles } = response.data
        
        this.userId = userId
        this.username = username
        this.avatar = avatar
        this.roles = roles
        
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    async logoutAction() {
      try {
        await logout()
        this.resetState()
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    resetState() {
      this.token = null
      this.userId = null
      this.username = null
      this.avatar = null
      this.roles = []
      removeToken()
    }
  }
})`;
  } else {
    userStoreContent = `import { defineStore } from 'pinia'
import { login, logout, getUserInfo } from '../api/user'
import { setToken, removeToken, getToken } from '../utils/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getToken(),
    userId: null,
    username: null,
    avatar: null,
    roles: []
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    hasRole: (state) => (role) => state.roles.includes(role)
  },
  
  actions: {
    async loginAction(username, password) {
      try {
        const response = await login(username, password)
        const { token } = response.data
        
        this.token = token
        setToken(token)
        
        // 获取用户信息
        await this.getUserInfoAction()
        
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    async getUserInfoAction() {
      try {
        const response = await getUserInfo()
        const { userId, username, avatar, roles } = response.data
        
        this.userId = userId
        this.username = username
        this.avatar = avatar
        this.roles = roles
        
        return Promise.resolve(response)
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    async logoutAction() {
      try {
        await logout()
        this.resetState()
        return Promise.resolve()
      } catch (error) {
        return Promise.reject(error)
      }
    },
    
    resetState() {
      this.token = null
      this.userId = null
      this.username = null
      this.avatar = null
      this.roles = []
      removeToken()
    }
  }
})`;
  }
  
  await fs.writeFile(
    path.join(storeDir, `user.${fileExt}`),
    userStoreContent,
    'utf-8'
  );
}

module.exports = {
  createStoreFiles
}; 