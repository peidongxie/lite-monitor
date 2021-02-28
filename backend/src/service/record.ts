import { Event } from '@lite-monitor/base';
import { Output } from '../type/server';
import { info } from '../util/log';

export const addRecords = async (records: Event[]): Output => {
  info(JSON.stringify(records));
  return 200;
};
