import { NextApiHandler } from 'next';

interface BodyItem {
  name: string;
  showName: string;
  type: number;
  token: string;
}

const body: BodyItem[] = [
  {
    name: 'node-demo-express',
    showName: 'Express.js Demo',
    type: 2,
    token: '0000000000003001',
  },
  {
    name: 'node-demo-koa',
    showName: 'Koa.js Demo',
    type: 2,
    token: '0000000000003002',
  },
  {
    name: 'node-demo-react',
    showName: 'React.js Demo',
    type: 1,
    token: '0000000000003003',
  },
  {
    name: 'sql-exam-backend',
    showName: '数据库考试系统后端',
    type: 2,
    token: '0000000000005001',
  },
  {
    name: 'sql-exam-frontend',
    showName: '数据库考试系统前端',
    type: 1,
    token: '0000000000005002',
  },
];

const summary: NextApiHandler<BodyItem[]> = (req, res) => {
  const token = req.headers.authorization;
  if (token && token === '141592653589793238462643') {
    res.status(200).json(body);
  } else {
    res.status(401).end();
  }
};

export default summary;
