import { NextApiHandler } from 'next';

interface BodyItem {
  name: string;
  message: string;
  stack: string[];
  count: number;
  items: {
    timestamp: number;
    user: string;
    core: number;
    memory: number;
    platform: string;
    platformVersion: string;
  }[];
}

const getTimestamp = (offset: number) =>
  new Date().getTime() -
  Math.round(Math.random() * 5 * 60 * 1000) -
  offset * 60 * 1000;

const body: BodyItem[] = [
  {
    name: 'SyntaxError',
    message: 'Invalid or unexpected token',
    stack: [
      '/home/lite-monitor/node-demo-express/index.js:18:11',
      'Layer.handle [as handle_request] (/home/lite-monitor/node_modules/express/lib/router/layer.js:95:5)',
      'next (/home/lite-monitor/node_modules/express/lib/router/route.js:137:13)',
      'Route.dispatch (/home/lite-monitor/node_modules/express/lib/router/route.js:112:3)',
      'Layer.handle [as handle_request] (/home/lite-monitor/node_modules/express/lib/router/layer.js:95:5)',
      '/home/lite-monitor/node_modules/express/lib/router/index.js:281:22',
      'Function.process_params (/home/lite-monitor/node_modules/express/lib/router/index.js:335:12)',
      'next (/home/lite-monitor/node_modules/express/lib/router/index.js:275:10)',
      'expressInit (/home/lite-monitor/node_modules/express/lib/middleware/init.js:40:5)',
      'Layer.handle [as handle_request] (/home/lite-monitor/node_modules/express/lib/router/layer.js:95:5)',
    ],
    count: 31,
    items: [
      {
        timestamp: getTimestamp(0),
        user: '171250509',
        core: 4,
        memory: 8,
        platform: 'Node.js',
        platformVersion: '12.22.1',
      },
      {
        timestamp: getTimestamp(10),
        user: '171250510',
        core: 8,
        memory: 8,
        platform: 'Node.js',
        platformVersion: '13.14.0',
      },
      {
        timestamp: getTimestamp(20),
        user: '171250511',
        core: 8,
        memory: 16,
        platform: 'Node.js',
        platformVersion: '14.16.1',
      },
      {
        timestamp: getTimestamp(30),
        user: '171250512',
        core: 4,
        memory: 4,
        platform: 'Node.js',
        platformVersion: '15.11.0',
      },
    ],
  },
  {
    name: 'Uncaught ReferenceError',
    message: 'window is not defined',
    stack: [
      '/home/lite-monitor/node-demo-koa/index.js:18:11',
      'dispatch (/home/lite-monitor/node_modules/koa-compose/index.js:42:32)',
      '/home/lite-monitor/node_modules/@koa/router/lib/router.js:372:16',
      'dispatch (/home/lite-monitor/node_modules/koa-compose/index.js:42:32)',
      '/home/lite-monitor/node_modules/koa-compose/index.js:34:12',
      'dispatch (/home/lite-monitor/node_modules/@koa/router/lib/router.js:377:31)',
      'dispatch (/home/lite-monitor/node_modules/koa-compose/index.js:42:32)',
      '/home/lite-monitor/monitor-node/dist/index.js:439:42',
      'step (/home/lite-monitor/monitor-node/dist/index.js:207:23)',
      'Object.next (/home/lite-monitor/monitor-node/dist/index.js:188:53)',
    ],
    count: 15,
    items: [
      {
        timestamp: getTimestamp(0),
        user: '171250509',
        core: 4,
        memory: 8,
        platform: 'Node.js',
        platformVersion: '12.22.1',
      },
      {
        timestamp: getTimestamp(10),
        user: '171250510',
        core: 8,
        memory: 8,
        platform: 'Node.js',
        platformVersion: '13.14.0',
      },
      {
        timestamp: getTimestamp(20),
        user: '171250511',
        core: 8,
        memory: 16,
        platform: 'Node.js',
        platformVersion: '14.16.1',
      },
      {
        timestamp: getTimestamp(30),
        user: '171250512',
        core: 4,
        memory: 4,
        platform: 'Node.js',
        platformVersion: '15.11.0',
      },
    ],
  },
  {
    name: 'TypeError',
    message: "Cannot read property 'toLowerCase' of undefined",
    stack: [
      'https://localhost/static/js/main.e8205f0b.chunk.js:2:8105',
      'ro (https://localhost/static/js/2.3c0f489b.chunk.js:2:67718)',
      'Vo (https://localhost/static/js/2.3c0f489b.chunk.js:2:77285)',
      'Hu (https://localhost/static/js/2.3c0f489b.chunk.js:2:121167)',
      'Pi (https://localhost/static/js/2.3c0f489b.chunk.js:2:107350)',
      'xi (https://localhost/static/js/2.3c0f489b.chunk.js:2:107278)',
      '_i (https://localhost/static/js/2.3c0f489b.chunk.js:2:107141)',
      'vi (https://localhost/static/js/2.3c0f489b.chunk.js:2:104107)',
      'https://localhost/static/js/2.3c0f489b.chunk.js:2:53486',
      't.unstable_runWithPriority (https://localhost/static/js/2.3c0f489b.chunk.js:2:130903)',
    ],
    count: 14,
    items: [
      {
        timestamp: getTimestamp(0),
        user: '171250509',
        core: 4,
        memory: 8,
        platform: 'Chrome',
        platformVersion: '89.0.4389.82',
      },
      {
        timestamp: getTimestamp(10),
        user: '171250510',
        core: 8,
        memory: 8,
        platform: 'Firefox',
        platformVersion: '88.0',
      },
      {
        timestamp: getTimestamp(20),
        user: '171250511',
        core: 8,
        memory: 16,
        platform: 'Firefox',
        platformVersion: '87.0',
      },
      {
        timestamp: getTimestamp(30),
        user: '171250512',
        core: 4,
        memory: 4,
        platform: 'Chrome',
        platformVersion: '90.0.4430.212',
      },
    ],
  },
];

const detail: NextApiHandler<BodyItem[]> = (req, res) => {
  const token = req.headers.authorization;
  if (token && token === '141592653589793238462643') {
    res.status(200).json(body);
  } else {
    res.status(401).end();
  }
};

export default detail;
