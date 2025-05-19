'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * 为 Vue 项目创建 package.json 文件
 * @param {string} projectPath - 项目路径
 * @param {Object} options - 项目选项
 */
async function createPackageJson(projectPath, options) {
  const isTS = options.language === 'TypeScript';
  const isElementPlus = options.uiFramework === 'Element Plus';
  const isAntDesignVue = options.uiFramework === 'Ant Design Vue';
  
  // 基本依赖
  const dependencies = {
    "vue": "^3.3.4",
    "vue-router": "^4.2.4",
    "pinia": "^2.1.6",
    "axios": "^1.5.0"
  };
  
  // 根据选择的UI框架添加依赖
  if (isElementPlus) {
    dependencies['element-plus'] = '^2.3.7';
    dependencies['@element-plus/icons-vue'] = '^2.1.0';
  } else if (isAntDesignVue) {
    dependencies['ant-design-vue'] = '^4.0.0';
    dependencies['@ant-design/icons-vue'] = '^7.0.0';
  }
  
  // 开发依赖
  const devDependencies = {
    "vite": "^4.4.9",
    "@vitejs/plugin-vue": "^4.3.4",
    "mockjs": "^1.1.0"
  };
  
  // 如果使用 TypeScript，添加相关依赖
  if (isTS) {
    devDependencies['typescript'] = '^5.2.2';
    devDependencies['vue-tsc'] = '^1.8.11';
  }
  
  // 如果使用 Jest 单元测试，添加相关依赖
  if (options.unitTest === 'Jest') {
    devDependencies['jest'] = '^29.6.2';
    devDependencies['@vue/test-utils'] = '^2.4.1';
    devDependencies['@babel/preset-env'] = '^7.22.10';
    if (isTS) {
      devDependencies['ts-jest'] = '^29.1.1';
      devDependencies['@babel/preset-typescript'] = '^7.22.5';
    }
  }
  
  // 如果使用 Vitest 单元测试，添加相关依赖
  if (options.unitTest === 'Vitest') {
    devDependencies['vitest'] = '^0.34.3';
    devDependencies['@vue/test-utils'] = '^2.4.1';
    devDependencies['jsdom'] = '^22.1.0';
  }
  
  // 构建 package.json 内容
  const packageJson = {
    name: options.projectName.toLowerCase().replace(/\s+/g, '-'),
    version: '0.1.0',
    private: true,
    scripts: {
      "dev": "vite --mode development",
      "fat": "vite --mode fat",
      "build": "vite build",
      "build:fat": "vite build --mode fat",
      "build:prod": "vite build --mode production",
      "preview": "vite preview"
    },
    dependencies,
    devDependencies
  };
  
  // 添加 TypeScript 相关脚本
  if (isTS) {
    packageJson.scripts.build = isTS ? "vue-tsc && vite build" : "vite build";
    packageJson.scripts.typecheck = "vue-tsc --noEmit";
  }
  
  // 添加测试相关脚本
  if (options.unitTest === 'Jest') {
    packageJson.scripts.test = "jest";
  } else if (options.unitTest === 'Vitest') {
    packageJson.scripts.test = "vitest run";
    packageJson.scripts["test:watch"] = "vitest";
  }
  
  // 写入 package.json 文件
  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2),
    'utf-8'
  );
  
  // 创建 vite.config.js/ts
  await createViteConfig(projectPath, options);
  
  // 创建 .gitignore 文件
  await createGitignore(projectPath);
  
  // 如果是 TypeScript 项目，创建 tsconfig.json
  if (isTS) {
    await createTsConfig(projectPath);
  }
  
  // 创建 README.md 文件
  await createReadme(projectPath, options);
  
  // 创建 public 目录和 index.html
  await createPublicFiles(projectPath, options);
  
  // 创建环境配置文件
  await createEnvFiles(projectPath, options);
}

/**
 * 创建 Vite 配置文件
 * @param {string} projectPath - 项目路径
 * @param {Object} options - 项目选项
 */
async function createViteConfig(projectPath, options) {
  const isTS = options.language === 'TypeScript';
  const fileExt = isTS ? 'ts' : 'js';
  
  let viteConfigContent = '';
  
  if (isTS) {
    viteConfigContent = `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
`;
  } else {
    viteConfigContent = `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
`;
  }
  
  await fs.writeFile(
    path.join(projectPath, `vite.config.${fileExt}`),
    viteConfigContent,
    'utf-8'
  );
}

/**
 * 创建 .gitignore 文件
 * @param {string} projectPath - 项目路径
 */
async function createGitignore(projectPath) {
  const gitignoreContent = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Coverage directory
coverage
`;

  await fs.writeFile(
    path.join(projectPath, '.gitignore'),
    gitignoreContent,
    'utf-8'
  );
}

/**
 * 创建 tsconfig.json 文件
 * @param {string} projectPath - 项目路径
 */
async function createTsConfig(projectPath) {
  const tsConfigContent = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
`;

  const tsConfigNodeContent = `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
`;

  await fs.writeFile(
    path.join(projectPath, 'tsconfig.json'),
    tsConfigContent,
    'utf-8'
  );
  
  await fs.writeFile(
    path.join(projectPath, 'tsconfig.node.json'),
    tsConfigNodeContent,
    'utf-8'
  );
}

/**
 * 创建 README.md 文件
 * @param {string} projectPath - 项目路径
 * @param {Object} options - 项目选项
 */
async function createReadme(projectPath, options) {
  const readmeContent = `# ${options.projectName}

## 项目说明

这是一个使用前端脚手架生成的 Vue 3 项目，基于以下技术栈：

- 前端框架: Vue 3
- UI框架: ${options.uiFramework !== '不使用UI框架' ? options.uiFramework : '无'}
- 单元测试: ${options.unitTest !== '不使用单元测试' ? options.unitTest : '无'}
- 其他功能: ${options.features.join(', ')}

## 项目结构

\`\`\`
├── public/              # 静态资源目录
├── src/                 # 源代码目录
│   ├── api/             # API请求模块
│   ├── assets/          # 资源文件
│   ├── components/      # 公共组件
│   ├── router/          # 路由配置
│   ├── store/           # 状态管理
│   ├── utils/           # 工具函数
│   ├── views/           # 页面组件
│   │   ├── login/       # 登录模块
│   │   └── dashboard/   # 仪表盘模块
│   ├── App.vue          # 根组件
│   └── main.${options.language === 'TypeScript' ? 'ts' : 'js'}    # 入口文件
├── ${options.language === 'TypeScript' ? 'tsconfig.json           # TypeScript 配置\n├── tsconfig.node.json     # TypeScript Node 配置\n├── ' : ''}vite.config.${options.language === 'TypeScript' ? 'ts' : 'js'}       # Vite 配置
├── package.json         # 项目依赖
├── .gitignore           # Git 忽略文件
└── README.md            # 项目说明
\`\`\`

## 快速开始

### 安装依赖

\`\`\`bash
npm install
# 或
yarn
# 或
pnpm install
\`\`\`

### 启动开发服务器

\`\`\`bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
\`\`\`

### 构建生产版本

\`\`\`bash
npm run build
# 或
yarn build
# 或
pnpm build
\`\`\`

${options.unitTest !== '不使用单元测试' ? `
### 运行单元测试

\`\`\`bash
npm run test
# 或
yarn test
# 或
pnpm test
\`\`\`
` : ''}

## 功能模块

- **路由管理**: 基于 Vue Router 的路由配置
- **状态管理**: 使用 Pinia 进行集中状态管理
- **API请求**: 基于 Axios 的请求封装，支持拦截器配置
- **登录认证**: 完整的登录/注销流程，包含令牌管理
- **权限控制**: 基于角色的访问控制系统
- **UI组件**: ${options.uiFramework !== '不使用UI框架' ? `集成 ${options.uiFramework} 组件库` : '无UI框架依赖'}
- **工具函数**: 常用工具函数集合
`;

  await fs.writeFile(
    path.join(projectPath, 'README.md'),
    readmeContent,
    'utf-8'
  );
}

/**
 * 创建公共文件
 * @param {string} projectPath - 项目路径
 * @param {Object} options - 项目选项
 */
async function createPublicFiles(projectPath, options) {
  // 创建 public 目录
  await fs.mkdir(path.join(projectPath, 'public'), { recursive: true });
  
  // 创建 index.html
  const indexHtmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${options.projectName}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.${options.language === 'TypeScript' ? 'ts' : 'js'}"></script>
  </body>
</html>
`;

  await fs.writeFile(
    path.join(projectPath, 'index.html'),
    indexHtmlContent,
    'utf-8'
  );
  
  // 创建 vite.svg
  await fs.copyFile(
    path.join(__dirname, '../../../../node_modules/vite/dist/client/vite.svg'),
    path.join(projectPath, 'public/vite.svg')
  ).catch(() => {
    // 如果复制失败，创建一个简单的占位SVG
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <path fill="currentColor" d="M29.884 6.146l-13.142 23.5a.714.714 0 0 1-1.244.005L2.096 6.148a.714.714 0 0 1 .746-1.057l13.156 2.352a.714.714 0 0 0 .253 0l12.881-2.348a.714.714 0 0 1 .752 1.05z"/>
</svg>`;
    return fs.writeFile(path.join(projectPath, 'public/vite.svg'), svgContent, 'utf-8');
  });
}

/**
 * 创建环境配置文件
 * @param {string} projectPath - 项目路径
 * @param {Object} options - 项目选项
 */
async function createEnvFiles(projectPath, options) {
  // 创建 .env 文件
  const envContent = `# 所有环境都会加载的公共环境变量
VITE_APP_TITLE=${options.projectName}
`;
  await fs.writeFile(
    path.join(projectPath, '.env'),
    envContent,
    'utf-8'
  );
  
  // 创建 .env.development 文件
  const envDevContent = `# 开发环境变量
NODE_ENV=development
VITE_APP_ENV=development
VITE_APP_BASE_URL=/api
VITE_APP_MOCK=true
`;
  await fs.writeFile(
    path.join(projectPath, '.env.development'),
    envDevContent,
    'utf-8'
  );
  
  // 创建 .env.fat 文件
  const envFatContent = `# 测试环境变量
NODE_ENV=production
VITE_APP_ENV=fat
VITE_APP_BASE_URL=https://api-fat.example.com
VITE_APP_MOCK=false
`;
  await fs.writeFile(
    path.join(projectPath, '.env.fat'),
    envFatContent,
    'utf-8'
  );
  
  // 创建 .env.production 文件
  const envProdContent = `# 生产环境变量
NODE_ENV=production
VITE_APP_ENV=production
VITE_APP_BASE_URL=https://api.example.com
VITE_APP_MOCK=false
`;
  await fs.writeFile(
    path.join(projectPath, '.env.production'),
    envProdContent,
    'utf-8'
  );
}

module.exports = {
  createPackageJson
}; 