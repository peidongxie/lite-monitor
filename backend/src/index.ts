import Koa from 'koa';
import s from './app';

const app = new Koa();
app.use(async (ctx) => {
  ctx.body = s;
});
app.listen(3000);

console.log('start!');
