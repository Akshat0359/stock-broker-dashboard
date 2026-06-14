const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";

type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  options: ApiOptions = {}
): Promise<T> {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...rest,
    credentials: "include", // Always send cookies
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      message = data.error ?? data.message ?? message;
    } catch {
      // ignore parse errors
    }
    throw new ApiError(response.status, message);
  }

  return response.json() as Promise<T>;
}

// ─── Auth API ───────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
}

export async function apiLogin(email: string, password: string): Promise<AuthUser> {
  const res = await apiFetch<{ user: AuthUser }>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  return res.user;
}

export async function apiRegister(email: string, password: string): Promise<AuthUser> {
  const res = await apiFetch<{ user: AuthUser }>("/auth/register", {
    method: "POST",
    body: { email, password },
  });
  return res.user;
}

export async function apiLogout(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST", body: {} });
}

export async function apiGetMe(): Promise<AuthUser | null> {
  try {
    const res = await apiFetch<{ user: AuthUser }>("/auth/me");
    return res.user;
  } catch {
    return null;
  }
}

// ─── Stocks API ─────────────────────────────────────────────────────────────

export interface StockInfo {
  ticker: string;
  price: number;
}

export async function apiGetStocks(): Promise<StockInfo[]> {
  const res = await apiFetch<{ stocks: StockInfo[] }>("/stocks");
  return res.stocks;
}

export async function apiGetSubscriptions(): Promise<StockInfo[]> {
  const res = await apiFetch<{ subscriptions: StockInfo[] }>("/stocks/subscriptions");
  return res.subscriptions;
}

export async function apiSubscribe(ticker: string): Promise<void> {
  await apiFetch("/stocks/subscribe", { method: "POST", body: { ticker } });
}

export async function apiUnsubscribe(ticker: string): Promise<void> {
  await apiFetch("/stocks/unsubscribe", { method: "DELETE", body: { ticker } });
}
