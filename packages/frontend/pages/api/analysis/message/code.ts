import { NextApiHandler } from 'next';

interface Body {
  data: number[][];
  labels: string[];
}

const body: Body = {
  data: [
    [3, 1, 4, 1, 59, 2, 6, 5],
    [1.17, 0.39, 1.56, 16.67, 1.44, 1.56, 2.34, 1.95],
  ],
  labels: [
    '/exam/detail',
    '/exam/info',
    '/exam/list',
    '/exam/publish',
    '/exam/question',
    '/exam/submit',
    '/user/info',
    '/user/login',
  ],
};

const code: NextApiHandler<Body> = (req, res) => {
  const token = req.headers.authorization;
  if (token && token === '141592653589793238462643') {
    res.status(200).json(body);
  } else {
    res.status(401).end();
  }
};

export default code;
