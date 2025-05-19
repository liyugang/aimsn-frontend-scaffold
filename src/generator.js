import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
// 修改导入方式，使用默认导入后再解构
import vueTemplates from './templates/vue/index.cjs';
import reactTemplates from './templates/react/index.cjs';

const { createVueProject } = vueTemplates;
const { createReactProject } = reactTemplates;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * 生成前端项目
 * @param {string} targetDir - 目标目录
 * @param {Object} options - 项目配置
 */
export async function generateProject(targetDir, options) {
  options = {
    ...options,
    projectPath: targetDir
  }
  // 根据选择的框架来生成对应的项目
  if (options.framework === 'Vue 3') {
    await createVueProject(options);
  } else if (options.framework === 'React') {
    // 为 React 项目添加 language 参数
    const reactOptions = {
      ...options,
      language: options.features.includes('typescript') ? 'TypeScript' : 'JavaScript'
    };
    await createReactProject(reactOptions);
  }
  
  // 生成通用的README.md
  await generateReadme(targetDir, options);
}

/**
 * 生成README.md文件
 * @param {string} targetDir - 目标目录
 * @param {Object} options - 项目配置
 */
async function generateReadme(targetDir, options) {
  const frameworkName = options.framework;
  const uiName = options.uiFramework !== '不使用UI框架' ? options.uiFramework : '无';
  const testingName = options.unitTest !== '不使用单元测试' ? options.unitTest : '无';
  
  const readmeContent = `# ${options.projectName}

## 项目说明

这是一个使用前端脚手架生成的项目，基于以下技术栈：

- 前端框架: ${frameworkName}
- UI框架: ${uiName}
- 单元测试: ${testingName}
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
│   │   └── ...         
│   ├── App.${options.features.includes('typescript') ? 'tsx' : 'jsx'}   # 根组件
│   └── main.${options.features.includes('typescript') ? 'ts' : 'js'}    # 入口文件
├── ${options.features.includes('typescript') ? 'tsconfig.json' : ''}
├── package.json         # 项目依赖
└── README.md            # 项目说明
\`\`\`

## 快速开始

### 安装依赖

\`\`\`bash
npm install
# 或
yarn
\`\`\`

### 启动开发服务器

\`\`\`bash
npm run dev
# 或
yarn dev
\`\`\`

### 构建生产版本

\`\`\`bash
npm run build
# 或
yarn build
\`\`\`

${options.unitTest !== '不使用单元测试' ? `
### 运行单元测试

\`\`\`bash
npm run test
# 或
yarn test
\`\`\`
` : ''}

## 功能模块

- **路由管理**: 基于${frameworkName === 'Vue 3' ? 'Vue Router' : 'React Router'}的路由配置
- **状态管理**: 使用${frameworkName === 'Vue 3' ? 'Pinia' : 'Redux Toolkit'}进行集中状态管理
- **API请求**: 基于Axios的请求封装，支持拦截器配置
- **登录认证**: 完整的登录/注销流程，包含令牌管理
- **权限控制**: 基于角色的访问控制系统
- **UI组件**: ${uiName !== '无' ? `集成${uiName}组件库` : '无UI框架依赖'}
- **工具函数**: 常用工具函数集合
`;

  await fs.writeFile(
    path.join(targetDir, 'README.md'),
    readmeContent,
    'utf-8'
  );
} 