import { type NextApiHandler } from 'next';

interface BodyItem {
  uid: string;
  timestamp: number;
  action: number;
  count: number;
  items: {
    timestamp: number;
    core: number;
    memory: number;
    platformVersion: string;
    action: number;
    payload: string;
  }[];
}

const getTimestamp = (offset: number) =>
  Date.now() - Math.round(Math.random() * 5 * 60 * 1000) - offset * 60 * 1000;

const body: BodyItem[] = [
  {
    uid: 'docker-31',
    timestamp: Date.now() - 31000,
    action: 3,
    count: 311,
    items: [
      {
        timestamp: Date.now() - 31000,
        core: 4,
        memory: 4,
        platformVersion: '15.11.0',
        action: 6,
        payload: 'remove docker',
      },
      {
        timestamp: Date.now() - 31000,
        core: 4,
        memory: 4,
        platformVersion: '15.11.0',
        action: 5,
        payload: 'remove docker',
      },
      {
        timestamp: getTimestamp(20),
        core: 4,
        memory: 4,
        platformVersion: '15.11.0',
        action: 3,
        payload: 'run sql in question 5',
      },
      {
        timestamp: getTimestamp(30),
        core: 4,
        memory: 4,
        platformVersion: '15.11.0',
        action: 3,
        payload: 'run sql in question 5',
      },
    ],
  },
  {
    uid: 'docker-14',
    timestamp: Date.now() - 14000,
    action: 3,
    count: 141,
    items: [
      {
        timestamp: Date.now() - 14000,
        core: 4,
        memory: 4,
        platformVersion: '15.11.0',
        action: 3,
        payload: 'run sql in question 1',
      },
      {
        timestamp: getTimestamp(10),
        core: 4,
        memory: 4,
        platformVersion: '15.11.0',
        action: 3,
        payload: 'run sql in question 1',
      },
      {
        timestamp: getTimestamp(20),
        core: 4,
        memory: 4,
        platformVersion: '15.11.0',
        action: 3,
        payload: 'create schema',
      },
      {
        timestamp: getTimestamp(30),
        core: 4,
        memory: 4,
        platformVersion: '15.11.0',
        action: 3,
        payload: 'create readonly database user',
      },
      {
        timestamp: getTimestamp(40),
        core: 4,
        memory: 4,
        platformVersion: '15.11.0',
        action: 2,
        payload: 'start container',
      },
      {
        timestamp: getTimestamp(50),
        core: 4,
        memory: 4,
        platformVersion: '15.11.0',
        action: 1,
        payload: 'create container',
      },
    ],
  },
];

const docker: NextApiHandler<BodyItem[]> = (req, res) => {
  const token = req.headers.authorization;
  if (token === '141592653589793238462643') {
    res.status(200).json(body);
  } else {
    res.status(401).end();
  }
};

export default docker;
