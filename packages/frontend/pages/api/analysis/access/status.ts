import { type NextApiHandler } from 'next';

interface Body {
  data: number[][];
  labels: string[];
}

const body: Body = {
  data: [[31, 14, 159, 26]],
  labels: ['0', '1', '2', '3'],
};

const status: NextApiHandler<Body> = (req, res) => {
  const token = req.headers.authorization;
  if (token === '141592653589793238462643') {
    res.status(200).json(body);
  } else {
    res.status(401).end();
  }
};

export default status;
