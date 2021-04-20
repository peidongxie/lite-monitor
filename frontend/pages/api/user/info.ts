import { NextApiHandler } from 'next';

interface Body {
  showName: string;
  token: string;
}

const body: Body = { showName: 'Teacher', token: '141592653589793238462643' };

const info: NextApiHandler<Body> = (req, res) => {
  const { name, password, token } = req.body;
  if (token && token === body.token) {
    res.status(200).json(body);
  } else if (name === 'admin' && password === 'njuse2021') {
    res.status(200).json(body);
  } else {
    res.status(401).end();
  }
};

export default info;
