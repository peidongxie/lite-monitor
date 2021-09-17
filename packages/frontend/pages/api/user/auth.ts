import { NextApiHandler } from 'next';

interface Body {
  showName: string;
  token: string;
}

const body: Body = { showName: 'Teacher', token: '141592653589793238462643' };

const auth: NextApiHandler<Body> = (req, res) => {
  const { name, password } = req.body;
  const token = req.headers.authorization;
  if (name === 'admin' && password === 'sql-exam') {
    res.status(200).json(body);
  } else if (token && token === '141592653589793238462643') {
    res.status(200).json(body);
  } else {
    res.status(401).end();
  }
};

export default auth;
