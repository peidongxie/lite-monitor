import { NextApiHandler } from 'next';

interface BodyItem {
  user: string;
  timestamp: number;
  method: number;
  page: number;
  activity: number;
  items: {
    timestamp: number;
    method: number;
    host: string;
    path: string;
  }[];
}

const getTimestamp = (offset: number) =>
  new Date().getTime() -
  Math.round(Math.random() * 5 * 60 * 1000) -
  offset * 60 * 1000;

const body: BodyItem[] = [
  {
    user: '171250512',
    timestamp: new Date().getTime() - 31000,
    method: 4,
    page: 31,
    activity: 4,
    items: [
      {
        timestamp: new Date().getTime() - 31000,
        method: 4,
        host: '212.129.149.40',
        path: '/exam/question',
      },
      {
        timestamp: getTimestamp(10),
        method: 5,
        host: '212.129.149.40',
        path: '/exam/question',
      },
      {
        timestamp: getTimestamp(20),
        method: 2,
        host: '212.129.149.40',
        path: '/exam/question',
      },
      {
        timestamp: getTimestamp(30),
        method: 2,
        host: '212.129.149.40',
        path: '/exam/info',
      },
    ],
  },
  {
    user: '171250509',
    timestamp: new Date().getTime() - 31000,
    method: 4,
    page: 15,
    activity: 9,
    items: [
      {
        timestamp: new Date().getTime() - 31000,
        method: 5,
        host: '212.129.149.40',
        path: '/exam/question',
      },
      {
        timestamp: getTimestamp(10),
        method: 2,
        host: '212.129.149.40',
        path: '/exam/question',
      },
      {
        timestamp: getTimestamp(20),
        method: 1,
        host: '212.129.149.40',
        path: '/exam/info',
      },
      {
        timestamp: getTimestamp(30),
        method: 3,
        host: '212.129.149.40',
        path: '/exam/info',
      },
      {
        timestamp: getTimestamp(40),
        method: 1,
        host: '212.129.149.40',
        path: '/exam/info',
      },
    ],
  },
];

const record: NextApiHandler<BodyItem[]> = (req, res) => {
  const token = req.headers.authorization;
  if (token && token === '141592653589793238462643') {
    res.status(200).json(body);
  } else {
    res.status(401).end();
  }
};

export default record;
