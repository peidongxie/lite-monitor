import fastify from 'fastify';
import cors from 'fastify-cors';
import mongodb from 'fastify-mongodb';
import sensible from 'fastify-sensible';
import config from '../config.json';

const server = fastify({
  logger: { level: config.server.logger, prettyPrint: true },
});
server.register(cors);
server.register(mongodb, {
  forceClose: true,
  name: config.database.name,
  url: `mongodb://${config.database.username}:${config.database.password}@${config.database.host}:${config.database.port}`,
});
server.register(sensible);

server.get('/', async () => {
  return { hello: 'world' };
});

try {
  await server.listen(config.server.port);
} catch (e) {
  server.log.error(e);
}
