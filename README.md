# 前端项目脚手架

一个功能强大的命令行工具，用于快速创建现代化前端项目。支持 React 和 Vue 3，并提供多种 UI 框架和功能选项。

## 特性

- 🚀 支持 React 和 Vue 3 框架
- 🎨 集成多种 UI 框架（Ant Design、Chakra UI、Element Plus 等）
- 📦 TypeScript/JavaScript 双语言支持
- 🔧 内置 ESLint + Prettier 代码规范
- 🌐 Axios 请求封装
- 🔐 完整的认证系统
- 🧪 单元测试支持（Jest、React Testing Library、Vitest）
- 🌍 国际化支持（可选）
- 📱 响应式布局
- 🎭 暗黑模式支持

## 安装

```bash
npm install -g frontend-scaffold
# 或
yarn global add frontend-scaffold
```

## 使用方法

创建一个新项目：

```bash
frontend-scaffold my-app
```

或者直接运行，然后按照提示操作：

```bash
frontend-scaffold
```

## 可用选项

创建项目时，脚手架将引导您完成以下选择：

1. **项目名称**：为您的项目命名
2. **前端框架**：选择 React 或 Vue 3
3. **开发语言**：选择 TypeScript 或 JavaScript
4. **UI 框架**：
   - React: Ant Design、Chakra UI 或不使用 UI 框架
   - Vue 3: Element Plus、Ant Design Vue 或不使用 UI 框架
5. **单元测试**：选择适合您框架的测试工具
6. **其他功能**：ESLint + Prettier、Axios 请求封装、国际化支持等

## 项目结构

生成的项目具有以下结构：

```
├── public/              # 静态资源目录
├── src/                 # 源代码目录
│   ├── api/             # API 请求模块
│   ├── assets/          # 资源文件
│   ├── components/      # 公共组件
│   │   ├── common/      # 通用组件
│   │   └── layout/      # 布局组件
│   ├── context/         # React Context（仅 React）
│   ├── hooks/           # 自定义 Hooks
│   ├── layouts/         # 布局文件
│   ├── pages/           # 页面组件
│   │   ├── login/       # 登录页面
│   │   └── dashboard/   # 仪表盘页面
│   ├── routes/          # 路由配置
│   ├── services/        # 服务层（API 封装）
│   ├── store/           # 状态管理
│   ├── utils/           # 工具函数
│   └── App.[tsx|jsx]    # 根组件
├── .eslintrc.js         # ESLint 配置
├── .prettierrc          # Prettier 配置
├── package.json         # 项目依赖
└── README.md            # 项目说明
```

## 内置功能

### 认证系统

脚手架生成的项目包含完整的认证系统，包括：

- 登录/注销流程
- 令牌管理
- 路由保护
- 用户信息管理

### API 请求封装

基于 Axios 的请求封装，包括：

- 请求/响应拦截器
- 统一错误处理
- 令牌自动附加
- 请求取消支持

### 主题切换

支持亮色/暗色主题切换，使用 Context API（React）或 Provide/Inject（Vue）实现。

## 自定义

生成项目后，您可以根据需要自由修改和扩展。脚手架提供的是一个起点，而不是限制。

## 贡献

欢迎贡献代码、报告问题或提出改进建议！

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 许可证

MIT 