import { type NextApiHandler } from 'next';

interface Body {
  data: number[][];
  labels: string[];
}

const getTimestamp = (minute: number) =>
  Math.round(Math.random() * minute * 60 * 1000);

const body: Body = {
  data: [
    [
      getTimestamp(2),
      getTimestamp(5),
      getTimestamp(8),
      getTimestamp(4),
      getTimestamp(7),
      getTimestamp(10),
      getTimestamp(6),
      getTimestamp(9),
    ],
    [
      getTimestamp(3),
      getTimestamp(6),
      getTimestamp(9),
      getTimestamp(5),
      getTimestamp(8),
      getTimestamp(11),
      getTimestamp(7),
      getTimestamp(10),
    ],
    [
      0,
      0,
      getTimestamp(10),
      0,
      getTimestamp(9),
      getTimestamp(12),
      0,
      getTimestamp(11),
    ],
  ],
  labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'],
};

const time: NextApiHandler<Body> = (req, res) => {
  const token = req.headers.authorization;
  if (token === '141592653589793238462643') {
    res.status(200).json(body);
  } else {
    res.status(401).end();
  }
};

export default time;
