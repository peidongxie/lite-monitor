import Koa from 'koa';
import { MongoClient } from 'mongodb';
import Router from '@koa/router';
import { HOST, PASSWORD, PORT, USERNAME } from './config/database';
import { QueueState } from './type/queue';
import { Event } from './type/server';

class Queue<T> {
  state: QueueState;
  value: T[] = [];

  constructor(state: QueueState) {
    this.state = state;
  }

  push(items: T[]): void {
    this.value.push(...items);
  }

  pop(): T[] {
    return this.value.splice(0, this.value.length);
  }
}

export const database: MongoClient = new MongoClient(
  `mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}`,
  // { useUnifiedTopology: true },
);

export const logger: Console = console;

export const queue: Queue<Event> = new Queue<Event>(QueueState.MODIFIABLE);

export const router: Router = new Router();

export const server: Koa = new Koa();
