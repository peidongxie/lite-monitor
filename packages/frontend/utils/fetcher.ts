export const jsonFetcher = async <Body>(
  input: RequestInfo,
  method: string,
  body?: unknown,
): Promise<Body> => {
  const res = await fetch(input, {
    body:
      body === undefined || body === null
        ? null
        : JSON.stringify(body, (key, value) => {
            return typeof value === 'bigint' ? value.toString() + 'n' : value;
          }),
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
