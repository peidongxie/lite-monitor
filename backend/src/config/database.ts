import { ProjectType } from '../type/database';

/**
 * 数据库用户名
 */
export const USERNAME = 'root';

/**
 * 数据库密码
 */
export const PASSWORD = 'lite-monitor';

/**
 * 数据库地址
 */
export const HOST = 'localhost';

/**
 * 数据库端口
 */
export const PORT = 27017;

/**
 * 数据库名称
 */
export const NAME = 'lite_monitor';

/**
 * 项目相关collection的名称前缀
 */
export const PROJECT_PREFIX = 'project_';

/**
 * 项目信息collection名称
 */
export const PROJECT_INFO = 'project_info';

/**
 * 示例项目信息
 */
export const DEMO_PROJECTS = [
  {
    name: 'node_demo_express',
    show_name: 'Express示例',
    type: ProjectType.NODE,
    token: '0000000000003001',
  },
  {
    name: 'node_demo_koa',
    show_name: 'Koa示例',
    type: ProjectType.NODE,
    token: '0000000000003002',
  },
  {
    name: 'node_demo_react',
    show_name: 'React示例',
    type: ProjectType.WEB,
    token: '0000000000003003',
  },
];
