import { NextApiHandler } from 'next';

interface Body {
  data: number[][];
  labels: string[];
}

const getBody = (hour: number): Body => {
  const granularity = hour * 5 * 60 * 1000;
  const now = Date.now();
  const end = now - (now % granularity);
  const labels: string[] = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(end - i * granularity);
    const hour = date.getHours();
    const minute = date.getMinutes();
    labels.unshift(`${hour}:${String(minute).padStart(2, '0')}`);
  }
  return {
    data: [
      [0, 0, 16, 2, 0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 14, 4, 0, 0, 0, 0, 2, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0],
    ],
    labels,
  };
};

const cluster: NextApiHandler<Body> = (req, res) => {
  const token = req.headers.authorization;
  if (token && token === '141592653589793238462643') {
    res.status(200).json(getBody(1));
  } else {
    res.status(401).end();
  }
};

export default cluster;
