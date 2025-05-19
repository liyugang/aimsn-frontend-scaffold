const fs = require('fs-extra');
const path = require('path');

/**
 * 创建布局和组件文件
 * @param {string} srcDir - 源码目录
 * @param {Object} options - 项目选项
 */
async function createLayoutAndComponents(srcDir, options) {
  console.log('[createLayoutAndComponents] 开始创建布局和组件...');
  
  try {
    const isTS = options.language === 'TypeScript';
    const fileExt = isTS ? 'tsx' : 'jsx';
    const isAntd = options.uiFramework === 'Ant Design';
    const isChakra = options.uiFramework === 'Chakra UI';
    const useUI = isAntd || isChakra;

    console.log(`[createLayoutAndComponents] 使用UI框架: ${options.uiFramework}, TypeScript: ${isTS}`);

    // 确保必要的目录存在
    await fs.ensureDir(path.join(srcDir, 'layouts'));
    await fs.ensureDir(path.join(srcDir, 'components'));
    await fs.ensureDir(path.join(srcDir, 'components/common'));
    await fs.ensureDir(path.join(srcDir, 'components/layout'));
    await fs.ensureDir(path.join(srcDir, 'context'));
    
    // 这些功能已经由其他模块处理，这里只创建Chakra UI主题（如果需要）
    // 如果使用Chakra UI，创建主题配置
    if (isChakra) {
      console.log('[createLayoutAndComponents] 创建Chakra UI主题配置...');
      await createChakraTheme(srcDir, options);
    }
    
    console.log('[createLayoutAndComponents] 布局和组件创建完成');
  } catch (error) {
    console.error('[createLayoutAndComponents] 创建布局和组件时出错:', error);
    throw error;
  }
}

/**
 * 创建Chakra UI主题配置
 * @param {string} srcDir - 源码目录
 * @param {Object} options - 项目选项
 */
async function createChakraTheme(srcDir, options) {
  try {
    console.log('[createChakraTheme] 开始创建Chakra UI主题...');
    
    const isTS = options.language === 'TypeScript';
    const fileExt = isTS ? 'ts' : 'js';
    
    // 创建主题目录
    const themeDir = path.join(srcDir, 'theme');
    console.log(`[createChakraTheme] 创建主题目录: ${themeDir}`);
    await fs.ensureDir(themeDir);
    
    // 创建主题配置文件
    const themeContent = `${isTS ? 'import { type ThemeConfig, extendTheme } from "@chakra-ui/react"' : 'import { extendTheme } from "@chakra-ui/react"'}

// 颜色模式配置
const config${isTS ? ': ThemeConfig' : ''} = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

// 自定义颜色
const colors = {
  brand: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
}

// 自定义组件样式
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'semibold',
      borderRadius: 'md',
    },
    variants: {
      primary: {
        bg: 'brand.500',
        color: 'white',
        _hover: { bg: 'brand.600' },
        _active: { bg: 'brand.700' },
      },
    },
  },
}

// 扩展默认主题
const theme = extendTheme({ 
  config, 
  colors, 
  components,
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
})

export default theme
`;

    const themeFilePath = path.join(srcDir, `theme/index.${fileExt}`);
    console.log(`[createChakraTheme] 写入主题文件: ${themeFilePath}`);
    await fs.writeFile(themeFilePath, themeContent, 'utf-8');
    
    console.log('[createChakraTheme] Chakra UI主题创建完成');
  } catch (error) {
    console.error('[createChakraTheme] 创建Chakra UI主题时出错:', error);
    throw error;
  }
}

module.exports = createLayoutAndComponents; 