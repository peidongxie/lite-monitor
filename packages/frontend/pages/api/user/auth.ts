import { NextApiHandler } from 'next';

interface Body {
  showName: string;
  token: string;
}

const db: {
  name: string;
  password: string;
  showName: string;
  token: '141592653589793238462643';
}[] = [
  {
    name: 'admin',
    password: 'lite-monitor',
    showName: 'Admin',
    token: '141592653589793238462643',
  },
];

const auth: NextApiHandler<Body> = (req, res) => {
  const { name, password } = req.body;
  const token = req.headers.authorization;
  const item = db.find(
    (item) =>
      (item.name === name && item.password === password) ||
      item.token === token,
  );
  if (item) {
    res.status(200).json({
      showName: item.showName,
      token: item.token,
    });
  } else {
    res.status(401).end();
  }
};

export { auth as default };
