#!/usr/bin/env node

import chalk from 'chalk';
import figlet from 'figlet';
import clear from 'clear';
import { Command } from 'commander';
import inquirer from 'inquirer';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateProject } from './src/generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 清屏
clear();

// 输出脚手架标题
console.log(
  chalk.blue(
    figlet.textSync('Frontend Scaffold', { horizontalLayout: 'full' })
  )
);

const program = new Command();

program
  .version('1.0.0')
  .description('创建一个新的前端项目')
  .argument('[name]', '项目名称')
  .action(async (name) => {
    let projectName = name;

    // 如果没有提供项目名称，则提示用户输入
    if (!projectName) {
      const answers = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: '请输入项目名称:',
          default: 'my-frontend-app',
          validate: (input) => {
            if (/^([A-Za-z\-\_\d])+$/.test(input)) return true;
            else return '项目名称只能包含字母、数字、横线和下划线';
          }
        }
      ]);
      projectName = answers.projectName;
    }

    // 检查项目目录是否已存在
    const targetDir = path.join(process.cwd(), projectName);
    if (fs.existsSync(targetDir)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `目录 ${projectName} 已存在。是否覆盖?`,
          default: false
        }
      ]);
      if (!overwrite) {
        console.log(chalk.red('操作取消'));
        return;
      }
      await fs.remove(targetDir);
    }

    // 收集用户配置
    const config = await inquirer.prompt([
      {
        type: 'list',
        name: 'framework',
        message: '请选择前端框架:',
        choices: ['Vue 3', 'React'],
        default: 'Vue 3'
      },
      {
        type: 'list',
        name: 'uiFramework',
        message: '请选择UI框架:',
        choices: (answers) => {
          if (answers.framework === 'Vue 3') {
            return ['Element Plus', 'Ant Design Vue', '不使用UI框架'];
          } else {
            return ['Ant Design', 'Chakra UI', '不使用UI框架'];
          }
        }
      },
      {
        type: 'list',
        name: 'unitTest',
        message: '是否添加单元测试?',
        choices: (answers) => {
          if (answers.framework === 'Vue 3') {
            return ['Vitest', 'Jest', '不使用单元测试'];
          } else {
            return ['Jest', 'React Testing Library', '不使用单元测试'];
          }
        }
      },
      {
        type: 'checkbox',
        name: 'features',
        message: '选择其他功能:',
        choices: [
          { name: 'TypeScript', value: 'typescript', checked: true },
          { name: 'ESLint + Prettier', value: 'linting', checked: true },
          { name: 'Axios请求封装', value: 'axios', checked: true },
          { name: '国际化支持', value: 'i18n', checked: false }
        ]
      }
    ]);

    // 开始创建项目
    const spinner = ora('创建项目中...').start();
    
    try {
      await fs.ensureDir(targetDir);
      await generateProject(targetDir, {
        ...config,
        projectName
      });
      
      spinner.succeed(`项目创建成功！\n`);
      console.log(chalk.green('🎉 项目已创建完成!'));
      console.log(`\n进入项目目录: ${chalk.cyan(`cd ${projectName}`)}`);
      console.log(`安装依赖: ${chalk.cyan('npm install')} 或 ${chalk.cyan('yarn')}`);
      console.log(`启动开发服务器: ${chalk.cyan('npm run dev')} 或 ${chalk.cyan('yarn dev')}\n`);
    } catch (error) {
      spinner.fail('项目创建失败');
      console.error(chalk.red(error));
    }
  });

program.parse(process.argv); 