import { NextApiHandler } from 'next';

interface Body {
  data: number[][];
  label: string[];
}

const getBody = (): Body => {
  const now = new Date().getTime();
  const end = now - (now % (5 * 60 * 1000));
  const label = Array.from(Array(10)).map((value, index) => {
    const date = new Date(end - (9 - index) * (5 * 60 * 1000));
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${hour}:${minute < 10 ? '0' : ''}${minute}`;
  });
  return {
    data: [
      [7, 14, 24, 39, 56, 72, 84, 91, 96, 48],
      [2, 3, 6, 10, 14, 18, 21, 23, 24, 24],
    ],
    label,
  };
};

const trend: NextApiHandler<Body> = (req, res) => {
  const token = req.headers.authorization;
  if (token && token === '141592653589793238462643') {
    res.status(200).json(getBody());
  } else {
    res.status(401).end();
  }
};

export default trend;
