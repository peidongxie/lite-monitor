import type {
  FastifyMongoNestedObject,
  FastifyMongoObject,
} from 'fastify-mongodb';
import type App from '../app';

class Persitence {
  #app: App;
  #value: FastifyMongoObject & FastifyMongoNestedObject;

  constructor(app: App) {
    this.#app = app;
    this.#value = app.getServer().getPersitenceValue();
  }
}

export default Persitence;
