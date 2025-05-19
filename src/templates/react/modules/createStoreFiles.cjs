'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * 创建状态管理文件
 */
async function createStoreFiles(storeDir, options) {
  const isTS = options.language === 'TypeScript';
  const fileExt = isTS ? 'ts' : 'js';
  
  // 创建store入口文件
  let storeContent = '';
  
  if (isTS) {
    storeContent = `import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// 定义 RootState 和 AppDispatch 类型
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
`;
  } else {
    storeContent = `import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
`;
  }
  
  await fs.writeFile(
    path.join(storeDir, `index.${fileExt}`),
    storeContent,
    'utf-8'
  );
  
  // 创建hooks.ts/js 文件
  let hooksContent = '';
  
  if (isTS) {
    hooksContent = `import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

// 使用自定义的钩子，而不是简单的 useDispatch 和 useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
`;
  } else {
    hooksContent = `import { useDispatch, useSelector } from 'react-redux';

// 使用自定义的钩子，以便在需要时轻松添加类型信息
export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
`;
  }
  
  await fs.writeFile(
    path.join(storeDir, `hooks.${fileExt}`),
    hooksContent,
    'utf-8'
  );
  
  // 创建slices目录
  const slicesDir = path.join(storeDir, 'slices');
  await fs.mkdir(slicesDir, { recursive: true });
  
  // 创建authSlice
  let authSliceContent = '';
  
  if (isTS) {
    authSliceContent = `import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services';
import { getToken, setToken, removeToken } from '../../utils/auth';

// 定义接口
interface User {
  userId: string;
  username: string;
  avatar: string;
  roles: string[];
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// 初始状态
const initialState: AuthState = {
  user: null,
  isAuthenticated: !!getToken(),
  isLoading: false,
  error: null,
};

// 异步thunk actions
export const loginAction = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue, dispatch }) => {
    try {
      const response = await authService.login({ username, password });
      if (response && response.data && response.data.token) {
        setToken(response.data.token);
        // 登录成功后获取用户信息
        dispatch(getUserInfoAction());
        return response;
      }
      return rejectWithValue('登录失败，无法获取令牌');
    } catch (error: any) {
      return rejectWithValue(error.message || '登录失败');
    }
  }
);

export const logoutAction = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      console.error('退出登录失败', error);
      // 即使API调用失败，也要清除本地状态
      dispatch(logout());
    }
  }
);

export const getUserInfoAction = createAsyncThunk(
  'auth/getUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getUserInfo();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取用户信息失败');
    }
  }
);

// 创建slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      removeToken();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 登录
      .addCase(loginAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAction.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = true;
      })
      .addCase(loginAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // 获取用户信息
      .addCase(getUserInfoAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserInfoAction.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUserInfoAction.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        removeToken();
      });
  },
});

// 导出actions
export const { logout, clearError } = authSlice.actions;

// 导出reducer
export default authSlice.reducer;
`;
  } else {
    authSliceContent = `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services';
import { getToken, setToken, removeToken } from '../../utils/auth';

// 初始状态
const initialState = {
  user: null,
  isAuthenticated: !!getToken(),
  isLoading: false,
  error: null,
};

// 异步thunk actions
export const loginAction = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue, dispatch }) => {
    try {
      const response = await authService.login({ username, password });
      if (response && response.data && response.data.token) {
        setToken(response.data.token);
        // 登录成功后获取用户信息
        dispatch(getUserInfoAction());
        return response;
      }
      return rejectWithValue('登录失败，无法获取令牌');
    } catch (error) {
      return rejectWithValue(error.message || '登录失败');
    }
  }
);

export const logoutAction = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await authService.logout();
      dispatch(logout());
    } catch (error) {
      console.error('退出登录失败', error);
      // 即使API调用失败，也要清除本地状态
      dispatch(logout());
    }
  }
);

export const getUserInfoAction = createAsyncThunk(
  'auth/getUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getUserInfo();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || '获取用户信息失败');
    }
  }
);

// 创建slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      removeToken();
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 登录
      .addCase(loginAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAction.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = true;
      })
      .addCase(loginAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // 获取用户信息
      .addCase(getUserInfoAction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserInfoAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUserInfoAction.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
        removeToken();
      });
  },
});

// 导出actions
export const { logout, clearError } = authSlice.actions;

// 导出reducer
export default authSlice.reducer;
`;
  }
  
  await fs.writeFile(
    path.join(slicesDir, `authSlice.${fileExt}`),
    authSliceContent,
    'utf-8'
  );
  
  // 创建uiSlice
  let uiSliceContent = '';
  
  if (isTS) {
    uiSliceContent = `import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarCollapsed: boolean;
  darkMode: boolean;
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
    timestamp: number;
  }>;
}

const initialState: UiState = {
  sidebarCollapsed: false,
  darkMode: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    addNotification: (state, action: PayloadAction<Omit<UiState['notifications'][0], 'id' | 'timestamp'>>) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        ...action.payload,
        timestamp: Date.now(),
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  toggleSidebar,
  toggleDarkMode,
  addNotification,
  removeNotification,
  clearAllNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
`;
  } else {
    uiSliceContent = `import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarCollapsed: false,
  darkMode: false,
  notifications: [],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    addNotification: (state, action) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        ...action.payload,
        timestamp: Date.now(),
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  toggleSidebar,
  toggleDarkMode,
  addNotification,
  removeNotification,
  clearAllNotifications,
} = uiSlice.actions;

export default uiSlice.reducer;
`;
  }
  
  await fs.writeFile(
    path.join(slicesDir, `uiSlice.${fileExt}`),
    uiSliceContent,
    'utf-8'
  );
}

module.exports = {
  createStoreFiles
}; 