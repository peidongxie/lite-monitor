const formFetcher = async <Body>(
  url: string,
  method?: string,
  body?: FormData | URLSearchParams | null,
  headers?: Record<string, string>,
  init?: RequestInit,
): Promise<Body> => {
  const res = await globalThis.fetch(url, {
    method: method ?? 'POST',
    body: body ?? null,
    headers: {
      Authorization: localStorage.getItem('token') || '',
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

const jsonFetcher = async <Body>(
  url: string,
  method?: string,
  body?: unknown,
  headers?: Record<string, string>,
  init?: RequestInit,
): Promise<Body> => {
  const res = await globalThis.fetch(url, {
    method: method ?? 'GET',
    body:
      body === undefined || body === null
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

export { formFetcher, jsonFetcher };
