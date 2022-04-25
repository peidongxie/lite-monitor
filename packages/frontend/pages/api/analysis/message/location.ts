import { NextApiHandler } from 'next';

interface BodyItem {
  auth: string;
  timestamp: number;
  ip: [string, string];
  location: number;
  count: number;
  items: {
    timestamp: number;
    method: string;
    protocol: string;
    port: number;
    version: string;
    ip: [string, string];
    code: number;
  }[];
}

const getTimestamp = (offset: number) =>
  Date.now() - Math.round(Math.random() * 5 * 60 * 1000) - offset * 60 * 1000;

const body: BodyItem[] = [
  {
    auth: '171250512',
    timestamp: Date.now() - 31000,
    ip: ['219.219.120.72', '127.0.0.1'],
    location: 3,
    count: 92,
    items: [
      {
        timestamp: Date.now() - 31000,
        method: 'GET',
        protocol: 'HTTP',
        port: 80,
        version: 'HTTP 1.0',
        ip: ['219.219.120.72', '127.0.0.1'],
        code: 200,
      },
      {
        timestamp: getTimestamp(10),
        method: 'GET',
        protocol: 'HTTP',
        port: 80,
        version: 'HTTP 1.0',
        ip: ['219.219.120.72', '127.0.0.1'],
        code: 200,
      },
      {
        timestamp: getTimestamp(20),
        method: 'POST',
        protocol: 'HTTP',
        port: 80,
        version: 'HTTP 1.1',
        ip: ['219.219.115.181', '127.0.0.1'],
        code: 200,
      },
      {
        timestamp: getTimestamp(30),
        method: 'POST',
        protocol: 'HTTPS',
        port: 80,
        version: 'HTTP 1.1',
        ip: ['212.129.149.40', '127.0.0.1'],
        code: 200,
      },
    ],
  },
  {
    auth: '171250511',
    timestamp: Date.now() - 31000,
    ip: ['219.219.120.72', '127.0.0.1'],
    location: 2,
    count: 15,
    items: [
      {
        timestamp: Date.now() - 31000,
        method: 'GET',
        protocol: 'HTTP',
        port: 80,
        version: 'HTTP 1.0',
        ip: ['219.219.120.72', '127.0.0.1'],
        code: 200,
      },
      {
        timestamp: getTimestamp(10),
        method: 'GET',
        protocol: 'HTTP',
        port: 80,
        version: 'HTTP 1.0',
        ip: ['219.219.120.72', '127.0.0.1'],
        code: 404,
      },
      {
        timestamp: getTimestamp(20),
        method: 'POST',
        protocol: 'HTTPS',
        port: 80,
        version: 'HTTP 1.1',
        ip: ['212.129.149.40', '127.0.0.1'],
        code: 200,
      },
      {
        timestamp: getTimestamp(30),
        method: 'POST',
        protocol: 'HTTPS',
        port: 80,
        version: 'HTTP 1.1',
        ip: ['212.129.149.40', '127.0.0.1'],
        code: 200,
      },
    ],
  },
  {
    auth: '171250510',
    timestamp: Date.now() - 31000,
    ip: ['219.219.120.72', '127.0.0.1'],
    location: 2,
    count: 14,
    items: [
      {
        timestamp: Date.now() - 31000,
        method: 'GET',
        protocol: 'HTTP',
        port: 80,
        version: 'HTTP 1.0',
        ip: ['219.219.120.72', '127.0.0.1'],
        code: 200,
      },
      {
        timestamp: getTimestamp(10),
        method: 'GET',
        protocol: 'HTTP',
        port: 80,
        version: 'HTTP 1.0',
        ip: ['219.219.120.72', '127.0.0.1'],
        code: 404,
      },
      {
        timestamp: getTimestamp(20),
        method: 'POST',
        protocol: 'HTTPS',
        port: 80,
        version: 'HTTP 1.1',
        ip: ['212.129.149.40', '127.0.0.1'],
        code: 200,
      },
      {
        timestamp: getTimestamp(30),
        method: 'POST',
        protocol: 'HTTPS',
        port: 80,
        version: 'HTTP 1.1',
        ip: ['212.129.149.40', '127.0.0.1'],
        code: 200,
      },
    ],
  },
  {
    auth: '171250509',
    timestamp: Date.now() - 31000,
    ip: ['219.219.120.72', '127.0.0.1'],
    location: 2,
    count: 31,
    items: [
      {
        timestamp: Date.now() - 31000,
        method: 'GET',
        protocol: 'HTTP',
        port: 80,
        version: 'HTTP 1.0',
        ip: ['219.219.120.72', '127.0.0.1'],
        code: 200,
      },
      {
        timestamp: getTimestamp(10),
        method: 'GET',
        protocol: 'HTTP',
        port: 80,
        version: 'HTTP 1.0',
        ip: ['219.219.120.72', '127.0.0.1'],
        code: 404,
      },
      {
        timestamp: getTimestamp(20),
        method: 'POST',
        protocol: 'HTTPS',
        port: 80,
        version: 'HTTP 1.1',
        ip: ['212.129.149.40', '127.0.0.1'],
        code: 200,
      },
      {
        timestamp: getTimestamp(30),
        method: 'POST',
        protocol: 'HTTPS',
        port: 80,
        version: 'HTTP 1.1',
        ip: ['212.129.149.40', '127.0.0.1'],
        code: 200,
      },
    ],
  },
];

const location: NextApiHandler<BodyItem[]> = (req, res) => {
  const token = req.headers.authorization;
  if (token && token === '141592653589793238462643') {
    res.status(200).json(body);
  } else {
    res.status(401).end();
  }
};

export default location;
