import { Event, Output } from '../type/server';
import { info } from '../util/logger';

export const addRecords = async (records: Event[]): Output => {
  info(JSON.stringify(records));
  return 200;
};
