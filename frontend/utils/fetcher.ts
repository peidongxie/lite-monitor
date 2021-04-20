import { JsonItem } from '@lite-monitor/base';

export const jsonFetcher = async <Body>(
  input: RequestInfo,
  method: string,
  body?: JsonItem[] | Record<string, JsonItem>,
): Promise<Body> => {
  const res = await fetch(input, {
    body: body && JSON.stringify(body),
    headers: {
      Authorization: localStorage.getItem('token') || '',
      'Content-Type': 'application/json',
    },
    method,
  });
  if (res.status >= 200 && res.status < 300) {
    return res.json();
  } else {
    throw res.status;
  }
};
