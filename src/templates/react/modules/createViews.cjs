'use strict';

const fs = require('fs-extra');
const path = require('path');

/**
 * 创建登录页面
 */
async function createLoginFiles(loginDir, options) {
  const isTS = options.language === 'TypeScript';
  const isAntd = options.uiFramework === 'Ant Design';
  const isChakra = options.uiFramework === 'Chakra UI';
  const fileExt = isTS ? 'tsx' : 'jsx';
  const cssExt = options.cssPreprocessor === 'SCSS' ? 'scss' : 'css';
  
  // 创建登录页面
  let loginContent = '';
  
  if (isTS) {
    if (isAntd) {
      loginContent = `import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import './index.${cssExt}';

interface LoginFormValues {
  username: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 如果已登录，重定向到首页
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const onFinish = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const result = await login({ username: values.username, password: values.password });
      if (result.code === 0) {
        message.success('登录成功！');
        navigate('/');
      } else {
        message.error(result.error?.message || '登录失败，请检查用户名和密码');
      }
    } catch (error) {
      message.error('登录过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <Card className="login-card">
          <div className="login-header">
            <h2>管理系统登录</h2>
            <p>欢迎回来，请登录您的账号</p>
          </div>
          
          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            className="login-form"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: '请输入用户名!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="用户名" 
                size="large" 
              />
            </Form.Item>
            
            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码"
                size="large"
              />
            </Form.Item>
            
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              
              <a className="login-form-forgot" href="#">
                忘记密码?
              </a>
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} className="login-form-button">
                登录
              </Button>
            </Form.Item>
            
            <div className="login-tips">
              <p>开发环境默认账号：admin</p>
              <p>开发环境默认密码：password</p>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
`;
    } else if (isChakra) {
      loginContent = `import React, { useState } from 'react';
import { 
  Box, 
  Flex, 
  Heading, 
  Text, 
  FormControl, 
  FormLabel, 
  Input, 
  Checkbox, 
  Button, 
  Alert, 
  AlertIcon,
  Link,
  VStack,
  Container,
  useColorModeValue
} from '@chakra-ui/react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';

interface FormState {
  username: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    username: '',
    password: '',
    remember: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const bg = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');

  // 如果已登录，重定向到首页
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState({
      ...formState,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // 清除错误
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formState.username.trim()) {
      setError('请输入用户名');
      return;
    }
    
    if (!formState.password) {
      setError('请输入密码');
      return;
    }
    
    setLoading(true);
    try {
      const result = await login({ username: formState.username, password: formState.password });
      if (result.code === 0) {
        navigate('/');
      } else {
        setError(result.error?.message || '登录失败，请检查用户名和密码');
      }
    } catch (error) {
      setError('登录过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box bg={bg} minH="100vh" py={12} px={4}>
      <Container maxW="lg">
        <Flex direction="column" alignItems="center">
          <Heading as="h1" size="xl" mb={2}>管理系统</Heading>
          
          <Box
            p={8}
            width="100%"
            maxWidth="400px"
            borderWidth={1}
            borderRadius="lg"
            boxShadow="lg"
            bg={cardBg}
          >
            <VStack spacing={4} as="form" onSubmit={handleSubmit}>
              <Heading as="h2" size="md" alignSelf="flex-start">
                欢迎登录
              </Heading>
              
              {error && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  {error}
                </Alert>
              )}
              
              <FormControl id="username" isRequired>
                <FormLabel>用户名</FormLabel>
                <Input 
                  name="username"
                  value={formState.username}
                  onChange={handleChange}
                  placeholder="请输入用户名"
                />
              </FormControl>
              
              <FormControl id="password" isRequired>
                <FormLabel>密码</FormLabel>
                <Input 
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={handleChange}
                  placeholder="请输入密码"
                />
              </FormControl>
              
              <Flex w="100%" justify="space-between" align="center">
                <Checkbox 
                  name="remember"
                  isChecked={formState.remember}
                  onChange={handleChange}
                >
                  记住我
                </Checkbox>
                <Link color="blue.500" fontSize="sm">
                  忘记密码?
                </Link>
              </Flex>
              
              <Button 
                colorScheme="blue" 
                width="100%" 
                type="submit"
                isLoading={loading}
                loadingText="登录中..."
              >
                登录
              </Button>
              
              <Box textAlign="center" w="100%" pt={2}>
                <Text fontSize="sm" color="gray.500">
                  开发环境默认账号：admin
                </Text>
                <Text fontSize="sm" color="gray.500">
                  开发环境默认密码：password
                </Text>
              </Box>
            </VStack>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default Login;
`;
    } else {
      loginContent = `import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks';
import './index.${cssExt}';

interface FormState {
  username: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const [formState, setFormState] = useState<FormState>({
    username: '',
    password: '',
    remember: false
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 如果已登录，重定向到首页
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormState({
      ...formState,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // 清除错误
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formState.username.trim()) {
      newErrors.username = '请输入用户名';
    }
    
    if (!formState.password) {
      newErrors.password = '请输入密码';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    try {
      const result = await login({ username: formState.username, password: formState.password });
      if (result.code === 0) {
        navigate('/');
      } else {
        setErrors({
          general: result.error?.message || '登录失败，请检查用户名和密码'
        });
      }
    } catch (error) {
      setErrors({
        general: '登录过程中发生错误'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-card">
          <div className="login-header">
            <h2>管理系统登录</h2>
            <p>欢迎回来，请登录您的账号</p>
          </div>
          
          <form onSubmit={handleSubmit} className="login-form">
            {errors.general && (
              <div className="error-message">{errors.general}</div>
            )}
            
            <div className="form-group">
              <label htmlFor="username">用户名</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formState.username}
                onChange={handleChange}
                className={errors.username ? 'error' : ''}
              />
              {errors.username && (
                <div className="field-error">{errors.username}</div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="password">密码</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formState.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
              />
              {errors.password && (
                <div className="field-error">{errors.password}</div>
              )}
            </div>
            
            <div className="form-group checkbox">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                checked={formState.remember}
                onChange={handleChange}
              />
              <label htmlFor="remember">记住我</label>
              
              <a className="forgot-password" href="#">
                忘记密码?
              </a>
            </div>
            
            <button 
              type="submit" 
              className="login-button" 
              disabled={loading}
            >
              {loading ? '登录中...' : '登录'}
            </button>
            
            <div className="login-tips">
              <p>开发环境默认账号：admin</p>
              <p>开发环境默认密码：password</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
`;
    }
  }
  
  await fs.writeFile(
    path.join(loginDir, `index.${fileExt}`),
    loginContent,
    'utf-8'
  );
  
  // 创建登录页面样式
  let loginCssContent = '';
  
  if (isAntd) {
    loginCssContent = `.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.login-content {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.login-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.login-header h2 {
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
}

.login-header p {
  color: rgba(0, 0, 0, 0.45);
}

.login-form-forgot {
  float: right;
}

.login-form-button {
  width: 100%;
}

.login-tips {
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.login-tips p {
  margin: 5px 0;
}
`;
  } else if (isChakra) {
    loginCssContent = `.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.login-content {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.login-card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 24px;
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.login-header h2 {
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
}

.login-header p {
  color: rgba(0, 0, 0, 0.45);
}

.login-form {
  margin-top: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input[type="text"],
.form-group input[type="password"] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s;
}

.form-group input[type="text"]:focus,
.form-group input[type="password"]:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  outline: none;
}

.form-group input.error {
  border-color: #ff4d4f;
}

.field-error {
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 5px;
}

.error-message {
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.form-group.checkbox {
  display: flex;
  align-items: center;
}

.form-group.checkbox input {
  margin-right: 8px;
}

.forgot-password {
  margin-left: auto;
}

.login-button {
  width: 100%;
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 12px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #40a9ff;
}

.login-button:disabled {
  background-color: #d9d9d9;
  cursor: not-allowed;
}

.login-tips {
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.login-tips p {
  margin: 5px 0;
}
`;
  } else {
    loginCssContent = `.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}

.login-content {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.login-card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 24px;
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.login-header h2 {
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
}

.login-header p {
  color: rgba(0, 0, 0, 0.45);
}

.login-form {
  margin-top: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input[type="text"],
.form-group input[type="password"] {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  transition: all 0.3s;
}

.form-group input[type="text"]:focus,
.form-group input[type="password"]:focus {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  outline: none;
}

.form-group input.error {
  border-color: #ff4d4f;
}

.field-error {
  color: #ff4d4f;
  font-size: 14px;
  margin-top: 5px;
}

.error-message {
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.form-group.checkbox {
  display: flex;
  align-items: center;
}

.form-group.checkbox input {
  margin-right: 8px;
}

.forgot-password {
  margin-left: auto;
}

.login-button {
  width: 100%;
  background-color: #1890ff;
  color: white;
  border: none;
  padding: 12px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #40a9ff;
}

.login-button:disabled {
  background-color: #d9d9d9;
  cursor: not-allowed;
}

.login-tips {
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.login-tips p {
  margin: 5px 0;
}
`;
  }
  
  await fs.writeFile(
    path.join(loginDir, `index.${cssExt}`),
    loginCssContent,
    'utf-8'
  );
}

/**
 * 创建仪表盘页面
 */
async function createDashboardFiles(dashboardDir, options) {
  const isTS = options.language === 'TypeScript';
  const isAntd = options.uiFramework === 'Ant Design';
  const isChakra = options.uiFramework === 'Chakra UI';
  const fileExt = isTS ? 'tsx' : 'jsx';
  const cssExt = options.cssPreprocessor === 'SCSS' ? 'scss' : 'css';
  
  // 创建仪表盘组件
  let dashboardContent = '';
  
  if (isTS) {
    if (isAntd) {
      // Ant Design 仪表盘组件 - TypeScript
      dashboardContent = `import React, { useState, useEffect } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Statistic, 
  Table, 
  Tag, 
  List, 
  Avatar, 
  Typography, 
  Badge, 
  Space 
} from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  UserOutlined, 
  ShoppingCartOutlined, 
  DollarOutlined, 
  FileTextOutlined 
} from '@ant-design/icons';
import { useAuth } from '../../hooks';

const { Title, Text } = Typography;

interface Order {
  id: string;
  customer: string;
  amount: number;
  status: 'success' | 'processing' | 'error';
  time: string;
}

interface Activity {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  time: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // 模拟数据
  const stats = [
    { 
      title: '总用户数', 
      value: 4294, 
      prefix: <UserOutlined />, 
      increase: 21, 
      suffix: '人' 
    },
    { 
      title: '今日访问量', 
      value: 1352, 
      prefix: <UserOutlined />, 
      increase: 18, 
      suffix: '次' 
    },
    { 
      title: '总销售额', 
      value: 93239, 
      prefix: <DollarOutlined />, 
      increase: 12, 
      suffix: '元' 
    },
    { 
      title: '待处理工单', 
      value: 23, 
      prefix: <FileTextOutlined />, 
      increase: -5, 
      suffix: '个' 
    }
  ];
  
  const recentActivities: Activity[] = [
    { 
      id: '1', 
      user: { name: '张三', avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' },
      action: '创建了一个新订单 #45631',
      time: '2分钟前'
    },
    { 
      id: '2', 
      user: { name: '李四', avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' },
      action: '完成了任务 "更新产品说明"',
      time: '15分钟前'
    },
    { 
      id: '3', 
      user: { name: '王五', avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' },
      action: '上传了3张图片到相册 "产品展示"',
      time: '1小时前'
    },
    { 
      id: '4', 
      user: { name: '赵六', avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png' },
      action: '回复了工单 #11926',
      time: '2小时前'
    },
  ];
  
  const recentOrders: Order[] = [
    { id: 'ORD-7529', customer: '张三', amount: 149.99, status: 'success', time: '2023-10-20 15:30' },
    { id: 'ORD-7528', customer: '李四', amount: 89.99, status: 'processing', time: '2023-10-20 14:45' },
    { id: 'ORD-7527', customer: '王五', amount: 199.99, status: 'success', time: '2023-10-20 13:12' },
    { id: 'ORD-7526', customer: '赵六', amount: 49.99, status: 'error', time: '2023-10-20 11:05' },
    { id: 'ORD-7525', customer: '钱七', amount: 129.99, status: 'success', time: '2023-10-20 09:27' }
  ];
  
  const orderColumns = [
    {
      title: '订单号',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => \`¥\${amount.toFixed(2)}\`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          success: { color: 'success', text: '已完成' },
          processing: { color: 'processing', text: '处理中' },
          error: { color: 'error', text: '已取消' },
        };
        return (
          <Tag color={statusMap[status as keyof typeof statusMap].color}>
            {statusMap[status as keyof typeof statusMap].text}
          </Tag>
        );
      },
    },
    {
      title: '时间',
      dataIndex: 'time',
      key: 'time',
    },
  ];

  return (
    <div className="dashboard-container">
      <Title level={4} style={{ marginBottom: 24 }}>仪表盘</Title>
      
      {/* 统计数据 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {stats.map((stat, index) => (
          <Col xs={24} sm={12} md={12} lg={6} key={index}>
            <Card>
              <Statistic
                title={stat.title}
                value={stat.value}
                precision={0}
                valueStyle={{ color: stat.increase > 0 ? '#3f8600' : '#cf1322' }}
                prefix={stat.prefix}
                suffix={stat.suffix}
              />
              <div style={{ marginTop: 8 }}>
                {stat.increase > 0 ? (
                  <Badge status="success" text={<Text type="success">{stat.increase}% 增长</Text>} />
                ) : (
                  <Badge status="error" text={<Text type="danger">{Math.abs(stat.increase)}% 下降</Text>} />
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
      
      <Row gutter={16}>
        {/* 最近活动 */}
        <Col xs={24} sm={24} md={8} lg={8} style={{ marginBottom: 16 }}>
          <Card title="最近活动" bordered={false}>
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.user.avatar} />}
                    title={item.user.name}
                    description={item.action}
                  />
                  <div>{item.time}</div>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        {/* 最近订单 */}
        <Col xs={24} sm={24} md={16} lg={16}>
          <Card title="最近订单" bordered={false}>
            <Table 
              columns={orderColumns} 
              dataSource={recentOrders} 
              rowKey="id" 
              pagination={false} 
              size="small" 
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
`;
    } else if (isChakra) {
      // Chakra UI 仪表盘组件 - JavaScript
      dashboardContent = `import React from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  VStack,
  HStack,
  Text,
  Flex,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Card,
  CardHeader,
  CardBody,
  Avatar,
  useColorModeValue
} from '@chakra-ui/react';
import { useAuth } from '../../hooks';

const Dashboard = () => {
  const { user } = useAuth();
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  
  // 模拟数据
  const stats = [
    { label: '总用户数', value: '4,294', change: '+21%', color: 'blue' },
    { label: '今日访问量', value: '1,352', change: '+18%', color: 'green' },
    { label: '总销售额', value: '¥93,239', change: '+12%', color: 'purple' },
    { label: '待处理工单', value: '23', change: '-5%', color: 'orange' }
  ];
  
  const recentActivities = [
    { 
      id: '1', 
      user: { name: '张三', avatar: 'https://i.pravatar.cc/150?img=1' },
      action: '创建了一个新订单 #45631',
      time: '2分钟前'
    },
    { 
      id: '2', 
      user: { name: '李四', avatar: 'https://i.pravatar.cc/150?img=2' },
      action: '完成了任务 "更新产品说明"',
      time: '15分钟前'
    },
    { 
      id: '3', 
      user: { name: '王五', avatar: 'https://i.pravatar.cc/150?img=3' },
      action: '上传了3张图片到相册 "产品展示"',
      time: '1小时前'
    },
    { 
      id: '4', 
      user: { name: '赵六', avatar: 'https://i.pravatar.cc/150?img=4' },
      action: '回复了工单 #11926',
      time: '2小时前'
    },
  ];
  
  const recentOrders = [
    { id: 'ORD-7529', customer: '张三', amount: 149.99, status: 'completed', time: '2023-10-20 15:30' },
    { id: 'ORD-7528', customer: '李四', amount: 89.99, status: 'pending', time: '2023-10-20 14:45' },
    { id: 'ORD-7527', customer: '王五', amount: 199.99, status: 'completed', time: '2023-10-20 13:12' },
    { id: 'ORD-7526', customer: '赵六', amount: 49.99, status: 'canceled', time: '2023-10-20 11:05' },
    { id: 'ORD-7525', customer: '钱七', amount: 129.99, status: 'completed', time: '2023-10-20 09:27' }
  ];
  
  const getStatusBadge = (status) => {
    const statusProps = {
      completed: { colorScheme: 'green', text: '已完成' },
      pending: { colorScheme: 'yellow', text: '处理中' },
      canceled: { colorScheme: 'red', text: '已取消' }
    };
    
    const { colorScheme, text } = statusProps[status];
    
    return (
      <Badge colorScheme={colorScheme} variant="subtle" borderRadius="full" px={2}>
        {text}
      </Badge>
    );
  };
  
  return (
    <Box p={5}>
      <Heading size="lg" mb={6}>仪表盘</Heading>
      
      {/* 统计数据 */}
      <Grid templateColumns="repeat(4, 1fr)" gap={6} mb={8}>
        {stats.map((stat, index) => (
          <GridItem key={index}>
            <Card bg={cardBg} boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <Stat>
                  <StatLabel fontSize="sm" color="gray.500">{stat.label}</StatLabel>
                  <StatNumber fontSize="2xl" fontWeight="bold" my={1}>
                    {stat.value}
                  </StatNumber>
                  <StatHelpText 
                    m={0} 
                    color={stat.change.startsWith('+') ? 'green.500' : 'red.500'}
                  >
                    {stat.change}
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
        ))}
      </Grid>
      
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {/* 最近活动 */}
        <GridItem colSpan={1}>
          <Card bg={cardBg} height="100%" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
            <CardHeader pb={0}>
              <Heading size="md">最近活动</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {recentActivities.map((activity) => (
                  <HStack key={activity.id} spacing={3}>
                    <Avatar 
                      size="sm" 
                      name={activity.user.name} 
                      src={activity.user.avatar} 
                    />
                    <Box flex={1}>
                      <Text fontSize="sm" fontWeight="medium">
                        {activity.user.name}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {activity.action}
                      </Text>
                      <Text fontSize="xs" color="gray.400" mt={1}>
                        {activity.time}
                      </Text>
                    </Box>
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
        
        {/* 最近订单 */}
        <GridItem colSpan={2}>
          <Card bg={cardBg} height="100%" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
            <CardHeader pb={0}>
              <Heading size="md">最近订单</Heading>
            </CardHeader>
            <CardBody>
              <TableContainer>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>订单号</Th>
                      <Th>客户</Th>
                      <Th isNumeric>金额</Th>
                      <Th>状态</Th>
                      <Th>时间</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {recentOrders.map((order) => (
                      <Tr key={order.id}>
                        <Td>{order.id}</Td>
                        <Td>{order.customer}</Td>
                        <Td isNumeric>¥{order.amount.toFixed(2)}</Td>
                        <Td>{getStatusBadge(order.status)}</Td>
                        <Td>{order.time}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Dashboard;
`;
    } else {
      // 标准仪表盘组件 - JavaScript
      dashboardContent = `import React from 'react';
      import { useAuth } from '../../hooks';
      import './index.${cssExt}';

      const Dashboard = () => {
        const { user } = useAuth();
        
        // 模拟数据
        const stats = [
          { label: '总用户数', value: '4,294', change: '+21%', isPositive: true },
          { label: '今日访问量', value: '1,352', change: '+18%', isPositive: true },
          { label: '总销售额', value: '¥93,239', change: '+12%', isPositive: true },
          { label: '待处理工单', value: '23', change: '-5%', isPositive: false }
        ];
        
        const recentActivities = [
          { 
            id: '1', 
            user: { name: '张三', avatar: 'https://i.pravatar.cc/150?img=1' },
            action: '创建了一个新订单 #45631',
            time: '2分钟前'
          },
          { 
            id: '2', 
            user: { name: '李四', avatar: 'https://i.pravatar.cc/150?img=2' },
            action: '完成了任务 "更新产品说明"',
            time: '15分钟前'
          },
          { 
            id: '3', 
            user: { name: '王五', avatar: 'https://i.pravatar.cc/150?img=3' },
            action: '上传了3张图片到相册 "产品展示"',
            time: '1小时前'
          },
          { 
            id: '4', 
            user: { name: '赵六', avatar: 'https://i.pravatar.cc/150?img=4' },
            action: '回复了工单 #11926',
            time: '2小时前'
          },
        ];
        
        const recentOrders = [
          { id: 'ORD-7529', customer: '张三', amount: 149.99, status: 'completed', time: '2023-10-20 15:30' },
          { id: 'ORD-7528', customer: '李四', amount: 89.99, status: 'pending', time: '2023-10-20 14:45' },
          { id: 'ORD-7527', customer: '王五', amount: 199.99, status: 'completed', time: '2023-10-20 13:12' },
          { id: 'ORD-7526', customer: '赵六', amount: 49.99, status: 'canceled', time: '2023-10-20 11:05' },
          { id: 'ORD-7525', customer: '钱七', amount: 129.99, status: 'completed', time: '2023-10-20 09:27' }
        ];
        
        const getStatusBadge = (status) => {
          const statusClasses = {
            completed: 'status-badge status-completed',
            pending: 'status-badge status-pending',
            canceled: 'status-badge status-canceled'
          };
          
          const statusText = {
            completed: '已完成',
            pending: '处理中',
            canceled: '已取消'
          };
          
          return (
            <span className={statusClasses[status]}>
              {statusText[status]}
            </span>
          );
        };
        
        return (
          <div className="dashboard-container">
            <h1 className="dashboard-title">仪表盘</h1>
            
            {/* 统计数据 */}
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div className="stat-card" key={index}>
                  <div className="stat-title">{stat.label}</div>
                  <div className="stat-value">{stat.value}</div>
                  <div className={stat.isPositive ? 'stat-change positive' : 'stat-change negative'}>
                    {stat.change}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="content-grid">
              {/* 最近活动 */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">最近活动</h2>
                </div>
                <div className="card-body">
                  <ul className="activity-list">
                    {recentActivities.map((activity) => (
                      <li className="activity-item" key={activity.id}>
                        <div className="activity-avatar">
                          <img src={activity.user.avatar} alt={activity.user.name} />
                        </div>
                        <div className="activity-content">
                          <div className="activity-user">{activity.user.name}</div>
                          <div className="activity-action">{activity.action}</div>
                          <div className="activity-time">{activity.time}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* 最近订单 */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">最近订单</h2>
                </div>
                <div className="card-body">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>订单号</th>
                        <th>客户</th>
                        <th>金额</th>
                        <th>状态</th>
                        <th>时间</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.customer}</td>
                          <td>¥{order.amount.toFixed(2)}</td>
                          <td>{getStatusBadge(order.status)}</td>
                          <td>{order.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      };

export default Dashboard;
`;
    }
  }
  
  // 创建文件
  await fs.writeFile(
    path.join(dashboardDir, `index.${fileExt}`),
    dashboardContent,
    'utf-8'
  );
  
  // 如果不是使用Chakra UI，创建样式文件
  if (!isChakra) {
    await createDashboardCss(path.join(dashboardDir, `index.${cssExt}`));
  }
}

/**
 * 创建仪表盘页面样式
 */
async function createDashboardCss(filePath) {
  const dashboardCssContent = `.dashboard-container {
  padding: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

.stat-title {
  color: #8c8c8c;
  font-size: 14px;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.stat-change {
  font-size: 14px;
}

.stat-change.positive {
  color: #52c41a;
}

.stat-change.negative {
  color: #f5222d;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
}

.card {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.card-header {
  border-bottom: 1px solid #f0f0f0;
  padding: 16px 20px;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.card-body {
  padding: 20px;
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 12px;
  overflow: hidden;
}

.activity-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.activity-content {
  flex: 1;
}

.activity-user {
  font-weight: 500;
  margin-bottom: 4px;
}

.activity-action {
  color: #595959;
  margin-bottom: 4px;
}

.activity-time {
  color: #8c8c8c;
  font-size: 12px;
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th,
.orders-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.orders-table th {
  font-weight: 500;
  color: #8c8c8c;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 12px;
}

.status-completed {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #52c41a;
}

.status-pending {
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  color: #faad14;
}

.status-canceled {
  background-color: #fff1f0;
  border: 1px solid #ffa39e;
  color: #f5222d;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .content-grid {
    grid-template-columns: 1fr;
  }
}
`;

  await fs.writeFile(filePath, dashboardCssContent, 'utf-8');
}

module.exports = {
  createLoginFiles,
  createDashboardFiles
}; 