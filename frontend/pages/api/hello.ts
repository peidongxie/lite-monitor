import { NextApiHandler } from 'next';

interface Body {
  name: string;
}

const hello: NextApiHandler<Body> = (req, res) => {
  res.status(200).json({ name: 'John Doe' });
};

export default hello;
