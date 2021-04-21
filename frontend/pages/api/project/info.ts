import { NextApiHandler } from 'next';

interface BodyItem {
  name: string;
  showName: string;
}

const body: BodyItem[] = [
  { name: 'node-demo-express', showName: 'Express.js Demo' },
  { name: 'node-demo-koa', showName: 'Koa.js Demo' },
  { name: 'node-demo-react', showName: 'React.js Demo' },
  { name: 'sql-exam-backend', showName: '数据库考试系统后端' },
  { name: 'sql-exam-frontend', showName: '数据库考试系统前端' },
];

const project: NextApiHandler<BodyItem[]> = (req, res) => {
  const token = req.headers.authorization;
  if (token && token === '141592653589793238462643') {
    res.status(200).json(body);
  } else {
    res.status(401).end();
  }
};

export default project;
