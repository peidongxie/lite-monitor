import { type NextApiHandler } from 'next';

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
      [0, 4, 7, 14, 24, 39, 56, 72, 84, 91, 96, 48],
      [0, 1, 2, 3, 6, 10, 14, 18, 21, 23, 24, 24],
    ],
    labels,
  };
};

const trend: NextApiHandler<Body> = (req, res) => {
  const token = req.headers.authorization;
  if (token === '141592653589793238462643') {
    res.status(200).json(getBody(1));
  } else {
    res.status(401).end();
  }
};

export default trend;
