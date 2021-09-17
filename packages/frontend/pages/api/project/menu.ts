import { NextApiHandler } from 'next';

interface BodyItem {
  name: string;
  type: string;
  showNameMap: {
    zhCN: string;
    enUS: string;
  };
}

const summary = [
  {
    name: 'node-demo-express',
    showName: 'Express.js Demo',
    type: 1,
    token: '0000000000003001',
    event: 3141,
    error: 15,
  },
  {
    name: 'node-demo-koa',
    showName: 'Koa.js Demo',
    type: 1,
    token: '0000000000003002',
    event: 9265,
    error: 53,
  },
  {
    name: 'node-demo-react',
    showName: 'React.js Demo',
    type: 2,
    token: '0000000000003003',
    event: 5897,
    error: 79,
  },
  {
    name: 'sql-exam-backend',
    showName: '数据库考试系统后端',
    type: 1,
    token: '0000000000005001',
    event: 3238,
    error: 84,
  },
  {
    name: 'sql-exam-frontend',
    showName: '数据库考试系统前端',
    type: 2,
    token: '0000000000005002',
    event: 6264,
    error: 43,
  },
];

const getBody = (name: string | string[]): Record<string, BodyItem[]> => {
  const names = Array.isArray(name) ? name : [name];
  const body: Record<string, BodyItem[]> = {};
  for (const name of names) {
    const type = summary.find((project) => project.name === name)?.type;
    const menu = [
      {
        name: 'error',
        type: 'error',
        showNameMap: {
          zhCN: '错误监控',
          enUS: 'Error Monitoring',
        },
      },
    ];
    if (type === 1) {
      menu.push(
        {
          name: 'resource',
          type: 'resource',
          showNameMap: {
            zhCN: '资源监控',
            enUS: 'Resource Monitoring',
          },
        },
        {
          name: 'message',
          type: 'message',
          showNameMap: {
            zhCN: '报文监控',
            enUS: 'Message Monitoring',
          },
        },
      );
    }
    if (type === 2) {
      menu.push(
        {
          name: 'component',
          type: 'component',
          showNameMap: {
            zhCN: '组件监控',
            enUS: 'Component Monitoring',
          },
        },
        {
          name: 'access',
          type: 'access',
          showNameMap: {
            zhCN: '访问监控',
            enUS: 'Access Monitoring',
          },
        },
      );
    }
    body[name] = menu;
  }
  return body;
};

const menu: NextApiHandler<Record<string, BodyItem[]>> = (req, res) => {
  const name = req.query.name;
  const token = req.headers.authorization;
  if (token && token === '141592653589793238462643') {
    res.status(200).json(getBody(name));
  } else {
    res.status(401).end();
  }
};

export default menu;
