'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * 创建登录模块文件
 */
async function createLoginFiles(loginDir, options) {
  const isElementPlus = options.uiFramework === 'Element Plus';
  const isAntDesignVue = options.uiFramework === 'Ant Design Vue';
  
  // 创建登录页面，这里简化版本
  let loginContent = '';
  
  if (isElementPlus) {
    loginContent = `<template>
  <div class="login-container">
    <div class="login-form-container">
      <h2 class="title">系统登录</h2>
      
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="用户名"
          >
            <template #prefix>
              <el-icon><user /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="密码"
            show-password
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <el-icon><lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" class="login-button" @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
        
        <div class="login-tips">
          <p>开发环境默认账号：admin</p>
          <p>开发环境默认密码：password</p>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock } from '@element-plus/icons-vue'
import { useUserStore } from '../../store/user'

const router = useRouter()
const userStore = useUserStore()
const loginFormRef = ref(null)

const loginForm = reactive({
  username: 'admin',
  password: 'password'
})

const loginRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleLogin = () => {
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        await userStore.loginAction(loginForm.username, loginForm.password)
        router.push('/')
      } catch (error) {
        console.error('登录失败:', error)
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f3f3f3;
}

.login-form-container {
  width: 350px;
  padding: 30px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 30px;
}

.login-button {
  width: 100%;
}

.login-tips {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #606266;
}

.login-tips p {
  margin: 5px 0;
}
</style>`;
  } else if (isAntDesignVue) {
    loginContent = `<template>
  <div class="login-container">
    <div class="login-form">
      <h1>系统登录</h1>
      <a-form
        :model="loginForm"
        :rules="rules"
        ref="loginFormRef"
        @finish="handleSubmit"
      >
        <a-form-item name="username">
          <a-input v-model:value="loginForm.username" placeholder="用户名">
            <template #prefix><user-outlined /></template>
          </a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input-password v-model:value="loginForm.password" placeholder="密码">
            <template #prefix><lock-outlined /></template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-checkbox v-model:checked="rememberMe">记住我</a-checkbox>
          <a class="login-form-forgot" href="">忘记密码?</a>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" class="login-form-button" :loading="loading">
            登录
          </a-button>
        </a-form-item>
        
        <div class="login-tips">
          <p>开发环境默认账号：admin</p>
          <p>开发环境默认密码：password</p>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { useUserStore } from '@/store/user';

const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const rememberMe = ref(false);
const loginFormRef = ref(null);

const loginForm = reactive({
  username: '',
  password: ''
});

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
};

const handleSubmit = async () => {
  loading.value = true;
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (loginForm.username === 'admin' && loginForm.password === 'password') {
      await userStore.loginAction(loginForm.username, loginForm.password)
      
      message.success('登录成功');
      router.push('/');
    } else {
      message.error('用户名或密码错误');
    }
  } catch (error) {
    message.error('登录失败: ' + error.message);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.login-form {
  width: 350px;
  padding: 30px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 30px;
  color: #1890ff;
}

.login-form-forgot {
  float: right;
}

.login-form-button {
  width: 100%;
}

.login-tips {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #606266;
}

.login-tips p {
  margin: 5px 0;
}
</style>`;
  } else {
    loginContent = `<template>
  <div class="login-container">
    <div class="login-form-container">
      <h2 class="title">系统登录</h2>
      
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-item">
          <label for="username">用户名</label>
          <input
            id="username"
            v-model="loginForm.username"
            type="text"
            placeholder="请输入用户名"
            required
          />
        </div>
        
        <div class="form-item">
          <label for="password">密码</label>
          <input
            id="password"
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            required
          />
        </div>
        
        <div class="form-item">
          <button type="submit" class="login-button">
            登录
          </button>
        </div>
        
        <div class="login-tips">
          <p>开发环境默认账号：admin</p>
          <p>开发环境默认密码：password</p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'

const router = useRouter()
const userStore = useUserStore()

const loginForm = reactive({
  username: 'admin',
  password: 'password'
})

const handleLogin = async () => {
  try {
    await userStore.loginAction(loginForm.username, loginForm.password)
    router.push('/')
  } catch (error) {
    console.error('登录失败:', error)
    alert('登录失败: ' + (error.message || '未知错误'))
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f3f3f3;
}

.login-form-container {
  width: 350px;
  padding: 30px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 30px;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 5px;
}

.form-item input {
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.login-button {
  width: 100%;
  padding: 12px;
  background-color: #409EFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.login-tips {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #606266;
}

.login-tips p {
  margin: 5px 0;
}
</style>`;
  }
  
  await fs.writeFile(
    path.join(loginDir, 'index.vue'),
    loginContent,
    'utf-8'
  );
}

/**
 * 创建仪表盘文件
 */
async function createDashboardFiles(dashboardDir, options) {
  const isElementPlus = options.uiFramework === 'Element Plus';
  const isAntDesignVue = options.uiFramework === 'Ant Design Vue';
  
  // 创建仪表盘页面，这里简化版本
  let dashboardContent = '';
  
  if (isElementPlus) {
    dashboardContent = `<template>
  <div class="dashboard-container">
    <div class="row">
      <div class="col">
        <div class="card welcome-card">
          <div class="card-header">
            <span>欢迎，{{ userStore.username || '管理员' }}</span>
          </div>
          <div class="card-body">
            <div class="welcome-content">
              <p>欢迎使用管理系统</p>
              <p>当前系统版本：1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row mt-20">
      <div class="col-4">
        <div class="card">
          <div class="card-header">
            <span>用户统计</span>
          </div>
          <div class="card-body">
            <div class="stat-content">
              <div class="stat-value">1,254</div>
              <div class="stat-label">总用户数</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-4">
        <div class="card">
          <div class="card-header">
            <span>订单统计</span>
          </div>
          <div class="card-body">
            <div class="stat-content">
              <div class="stat-value">5,678</div>
              <div class="stat-label">总订单数</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-4">
        <div class="card">
          <div class="card-header">
            <span>收入统计</span>
          </div>
          <div class="card-body">
            <div class="stat-content">
              <div class="stat-value">¥123,456</div>
              <div class="stat-label">总收入</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row mt-20">
      <div class="col">
        <div class="card">
          <div class="card-header">
            <span>最近活动</span>
          </div>
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th>日期</th>
                  <th>用户</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(activity, index) in activities" :key="index">
                  <td>{{ activity.date }}</td>
                  <td>{{ activity.name }}</td>
                  <td>{{ activity.action }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../../store/user'

const userStore = useUserStore()

// 模拟数据
const activities = ref([
  {
    date: '2023-08-01 10:00:00',
    name: '张三',
    action: '登录了系统'
  },
  {
    date: '2023-08-01 11:30:00',
    name: '李四',
    action: '创建了新订单'
  },
  {
    date: '2023-08-01 13:15:00',
    name: '王五',
    action: '更新了个人信息'
  },
  {
    date: '2023-08-01 14:45:00',
    name: '赵六',
    action: '上传了新文件'
  }
])
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px;
}

.mt-20 {
  margin-top: 20px;
}

.col {
  flex: 0 0 100%;
  max-width: 100%;
  padding: 0 10px;
}

.col-4 {
  flex: 0 0 33.333333%;
  max-width: 33.333333%;
  padding: 0 10px;
}

.card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.card-header {
  padding: 15px;
  border-bottom: 1px solid #ebeef5;
}

.card-body {
  padding: 20px;
}

.welcome-content {
  font-size: 16px;
  line-height: 1.6;
}

.stat-content {
  text-align: center;
  padding: 20px 0;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid #ebeef5;
}

.table th {
  font-weight: 500;
  color: #909399;
  white-space: nowrap;
}
</style>`;
  } else if (isAntDesignVue) {
    dashboardContent = `<template>
  <div class="dashboard-container">
    <a-row :gutter="24">
      <a-col :span="8">
        <a-card title="用户统计" :bordered="false">
          <template #extra>
            <team-outlined />
          </template>
          <div class="card-content">
            <div class="card-statistic">{{ userCount }}</div>
            <div class="card-description">总用户数</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="订单统计" :bordered="false">
          <template #extra>
            <shopping-outlined />
          </template>
          <div class="card-content">
            <div class="card-statistic">{{ orderCount }}</div>
            <div class="card-description">总订单数</div>
          </div>
        </a-card>
      </a-col>
      <a-col :span="8">
        <a-card title="收入统计" :bordered="false">
          <template #extra>
            <dollar-outlined />
          </template>
          <div class="card-content">
            <div class="card-statistic">¥{{ revenue }}</div>
            <div class="card-description">总收入</div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    
    <a-card title="最近活动" class="recent-activity" :bordered="false">
      <a-table :dataSource="recentActivities" :columns="columns" :pagination="false">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a @click="handleView(record)">查看</a>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  TeamOutlined, 
  ShoppingOutlined, 
  DollarOutlined
} from '@ant-design/icons-vue';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const userCount = ref(0);
const orderCount = ref(0);
const revenue = ref(0);
const recentActivities = ref([]);

const columns = [
  {
    title: '用户',
    dataIndex: 'user',
    key: 'user',
  },
  {
    title: '活动类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '内容',
    dataIndex: 'content',
    key: 'content',
  },
  {
    title: '时间',
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: '操作',
    key: 'action',
  }
];

onMounted(async () => {
  // 模拟异步数据获取
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  userCount.value = 1284;
  orderCount.value = 5962;
  revenue.value = 89632;
  
  // 模拟活动数据
  recentActivities.value = [
    {
      key: '1',
      user: '张三',
      type: '登录',
      content: '用户登录系统',
      time: '2023-08-15 10:30:00'
    },
    {
      key: '2',
      user: '李四',
      type: '订单',
      content: '创建了新订单 #1234',
      time: '2023-08-15 09:15:00'
    },
    {
      key: '3',
      user: '王五',
      type: '支付',
      content: '支付订单 #1002',
      time: '2023-08-15 08:45:00'
    },
    {
      key: '4',
      user: '赵六',
      type: '注册',
      content: '新用户注册',
      time: '2023-08-14 16:20:00'
    }
  ];
});

// 查看活动详情
const handleView = (record) => {
  console.log('查看活动详情:', record);
};
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.card-content {
  text-align: center;
}

.card-statistic {
  font-size: 28px;
  font-weight: bold;
  color: #1890ff;
}

.card-description {
  margin-top: 8px;
  color: #8c8c8c;
}

.recent-activity {
  margin-top: 24px;
}
</style>`;
  } else {
    dashboardContent = `<template>
  <div class="dashboard-container">
    <div class="row">
      <div class="col">
        <div class="card welcome-card">
          <div class="card-header">
            <span>欢迎，{{ userStore.username || '管理员' }}</span>
          </div>
          <div class="card-body">
            <div class="welcome-content">
              <p>欢迎使用管理系统</p>
              <p>当前系统版本：1.0.0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row mt-20">
      <div class="col-4">
        <div class="card">
          <div class="card-header">
            <span>用户统计</span>
          </div>
          <div class="card-body">
            <div class="stat-content">
              <div class="stat-value">1,254</div>
              <div class="stat-label">总用户数</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-4">
        <div class="card">
          <div class="card-header">
            <span>订单统计</span>
          </div>
          <div class="card-body">
            <div class="stat-content">
              <div class="stat-value">5,678</div>
              <div class="stat-label">总订单数</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-4">
        <div class="card">
          <div class="card-header">
            <span>收入统计</span>
          </div>
          <div class="card-body">
            <div class="stat-content">
              <div class="stat-value">¥123,456</div>
              <div class="stat-label">总收入</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row mt-20">
      <div class="col">
        <div class="card">
          <div class="card-header">
            <span>最近活动</span>
          </div>
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th>日期</th>
                  <th>用户</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(activity, index) in activities" :key="index">
                  <td>{{ activity.date }}</td>
                  <td>{{ activity.name }}</td>
                  <td>{{ activity.action }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '../../store/user'

const userStore = useUserStore()

// 模拟数据
const activities = ref([
  {
    date: '2023-08-01 10:00:00',
    name: '张三',
    action: '登录了系统'
  },
  {
    date: '2023-08-01 11:30:00',
    name: '李四',
    action: '创建了新订单'
  },
  {
    date: '2023-08-01 13:15:00',
    name: '王五',
    action: '更新了个人信息'
  },
  {
    date: '2023-08-01 14:45:00',
    name: '赵六',
    action: '上传了新文件'
  }
])
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -10px;
}

.mt-20 {
  margin-top: 20px;
}

.col {
  flex: 0 0 100%;
  max-width: 100%;
  padding: 0 10px;
}

.col-4 {
  flex: 0 0 33.333333%;
  max-width: 33.333333%;
  padding: 0 10px;
}

.card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.card-header {
  padding: 15px;
  border-bottom: 1px solid #ebeef5;
}

.card-body {
  padding: 20px;
}

.welcome-content {
  font-size: 16px;
  line-height: 1.6;
}

.stat-content {
  text-align: center;
  padding: 20px 0;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #409EFF;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid #ebeef5;
}

.table th {
  font-weight: 500;
  color: #909399;
  white-space: nowrap;
}
</style>`;
  }
  
  await fs.writeFile(
    path.join(dashboardDir, 'index.vue'),
    dashboardContent,
    'utf-8'
  );
}

module.exports = {
  createLoginFiles,
  createDashboardFiles
}; 