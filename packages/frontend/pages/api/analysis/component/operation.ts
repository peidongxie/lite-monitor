import { NextApiHandler } from 'next';

interface BodyItem {
  user: string;
  timestamp: number;
  action: number;
  operation: number;
  count: number;
  items: {
    timestamp: number;
    platform: string;
    platformVersion: string;
    xpath: string[];
    action: number;
    payload: string;
  }[];
}

const body: BodyItem[] = [
  {
    user: '171250512',
    timestamp: Date.now() - 314,
    action: 1,
    operation: 3,
    count: 314,
    items: [
      {
        timestamp: Date.now() - 314,
        platform: 'Chrome',
        platformVersion: '90.0.4430.212',
        xpath: ['html', 'body', 'div[1]', 'main', 'div[1]', 'div[3]'],
        action: 1,
        payload: 'select * from user where user.age < 18;',
      },
      {
        timestamp: Date.now() - 1590,
        platform: 'Chrome',
        platformVersion: '90.0.4430.212',
        xpath: ['html', 'body', 'div[1]', 'main', 'div[1]', 'div[3]'],
        action: 10,
        payload: 'select * from user where',
      },
      {
        timestamp: Date.now() - 2650,
        platform: 'Chrome',
        platformVersion: '90.0.4430.212',
        xpath: ['html', 'body', 'div[1]', 'main', 'div[1]', 'div[3]'],
        action: 2,
        payload: '',
      },
      {
        timestamp: Date.now() - 3580,
        platform: 'Chrome',
        platformVersion: '90.0.4430.212',
        xpath: ['html', 'body', 'div[1]', 'main', 'div[1]', 'div[3]'],
        action: 3,
        payload: '',
      },
    ],
  },
  {
    user: '171250509',
    timestamp: Date.now() - 314,
    action: 1,
    operation: 1,
    count: 159,
    items: [
      {
        timestamp: Date.now() - 314,
        platform: 'Chrome',
        platformVersion: '89.0.4389.82',
        xpath: ['html', 'body', 'div[1]', 'main', 'div[1]', 'div[3]'],
        action: 1,
        payload: 'select * from user where user.age >= 18;',
      },
      {
        timestamp: Date.now() - 1590,
        platform: 'Chrome',
        platformVersion: '89.0.4389.82',
        xpath: ['html', 'body', 'div[1]', 'main', 'div[1]', 'div[3]'],
        action: 10,
        payload: 'select * from user where',
      },
      {
        timestamp: Date.now() - 2650,
        platform: 'Chrome',
        platformVersion: '89.0.4389.82',
        xpath: ['html', 'body', 'div[1]', 'main', 'div[1]', 'div[3]'],
        action: 8,
        payload: 'select * from user where',
      },
      {
        timestamp: Date.now() - 3580,
        platform: 'Chrome',
        platformVersion: '89.0.4389.82',
        xpath: ['html', 'body', 'div[1]', 'main', 'div[1]', 'div[3]'],
        action: 9,
        payload: 'select * from user where',
      },
    ],
  },
];

const operation: NextApiHandler<BodyItem[]> = (req, res) => {
  const token = req.headers.authorization;
  if (token && token === '141592653589793238462643') {
    res.status(200).json(body);
  } else {
    res.status(401).end();
  }
};

export default operation;
