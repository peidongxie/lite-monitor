const jsonFetcher = async <Body>(
  url: string,
  method?: string,
  body?: BodyInit,
  headers?: Record<string, string>,
  init?: RequestInit,
): Promise<Body> => {
  const res = await fetch(url, {
    method: method ?? 'GET',
    body:
      body === undefined
        ? null
        : JSON.stringify(body, (key, value) => {
            return typeof value === 'bigint' ? value.toString() + 'n' : value;
          }),
    headers: {
      Authorization: localStorage.getItem('token') || '',
      'Content-Type': 'application/json',
      ...headers,
    },
    ...init,
  });
  if (res.status >= 200 && res.status < 300) {
    return res.json();
  } else {
    throw res.status;
  }
};

export { jsonFetcher };
