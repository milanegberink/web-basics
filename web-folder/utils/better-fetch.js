import { tryCatch } from "./try-catch";

const BACK_END_BASE_URL = "http://localhost:3000";

const defaultHeaders = {
  "Content-Type": "application/json",
};

class HttpError {
  statusCode;
  message;
  constructor(statusCode, message) {
    this.statusCode = statusCode;
    this.message = message;
  }
}

async function request(endpoint, method, headers, body) {
  const url = `${BACK_END_BASE_URL}${endpoint}`;
  const options = {
    method,
    credentials: "include",
    headers: { ...defaultHeaders, ...headers },
    body,
  };

  const fetchData = async () => {
    const res = await fetch(url, options);

    if (!res.ok) {
      const x = await res.json();
      throw new HttpError(res.status, x.error);
    }

    return res.json();
  };

  return await tryCatch(fetchData());
}

export const get = (endpoint, headers) => request(endpoint, "GET", headers);

export const post = (endpoint, body, headers) =>
  request(endpoint, "POST", headers, JSON.stringify(body));
