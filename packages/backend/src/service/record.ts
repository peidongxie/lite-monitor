import { queue } from '../app';
import { Event, Output } from '../type/server';

export const addRecords = async (records: Event[]): Output => {
  queue.push(records);
  return 200;
};
