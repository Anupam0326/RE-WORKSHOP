/**
 * Minimal Supabase client (REST, Auth, Storage) over fetch — no SDK, so no extra dependency or bundle weight.
 * The URL and publishable key are public by design; data is protected by Row Level Security.
 * NEVER put a secret key (sb_secret_…) in this file or anywhere in the frontend.
 */

export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) ?? "https://gzrrwncbouybfitcvkqw.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ?? "sb_publishable_eHq3jJOF_y-QqmSx9qIBYw_fSEx92LN";
export const PRODUCT_BUCKET = "product-images";

export type Session = {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // epoch seconds
  email: string;
};

const SESSION_KEY = "rw-admin-session";

export class SupabaseError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function parseError(response: Response) {
  let message = `Request failed (${response.status})`;
  let code: string | undefined;
  try {
    const body = await response.json();
    message = body.msg || body.message || body.error_description || body.error || message;
    code = body.code || body.error_code;
  } catch {
    /* non-JSON body */
  }
  return new SupabaseError(message, response.status, code);
}

/* ---------------- Session ---------------- */

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function writeSession(session: Session | null) {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new CustomEvent("rw-auth-change"));
}

function toSession(body: { access_token: string; refresh_token: string; expires_in: number; user?: { email?: string } }): Session {
  return {
    accessToken: body.access_token,
    refreshToken: body.refresh_token,
    expiresAt: Math.floor(Date.now() / 1000) + body.expires_in,
    email: body.user?.email ?? "",
  };
}

async function authRequest(path: string, body: unknown, accessToken?: string) {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw await parseError(response);
  return response.status === 204 ? null : response.json();
}

let refreshing: Promise<Session | null> | null = null;

/** Current session, refreshed automatically when it is about to expire. */
export async function getSession(): Promise<Session | null> {
  const session = readSession();
  if (!session) return null;
  if (session.expiresAt - 60 > Date.now() / 1000) return session;
  refreshing ??= authRequest("token?grant_type=refresh_token", { refresh_token: session.refreshToken })
    .then((body) => {
      const next = toSession(body);
      writeSession(next);
      return next;
    })
    .catch(() => {
      writeSession(null);
      return null;
    })
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

export function peekSession() {
  return readSession();
}

/** Sign in with email + password (Supabase Auth). Errors are deliberately generic. */
export async function signIn(emailInput: string, password: string) {
  const email = emailInput.trim().toLowerCase();
  try {
    const body = await authRequest("token?grant_type=password", { email, password });
    const session = toSession(body);
    writeSession(session);
    return session;
  } catch (error) {
    if (error instanceof SupabaseError && (error.status === 400 || error.status === 401)) {
      throw new SupabaseError("Incorrect email or password.", error.status, error.code);
    }
    throw error;
  }
}

export async function signOut() {
  const session = readSession();
  writeSession(null);
  if (session) {
    try {
      await authRequest("logout", {}, session.accessToken);
    } catch {
      /* already signed out server-side */
    }
  }
}

/* ---------------- REST ---------------- */

type RequestOptions = { anonymous?: boolean; headers?: Record<string, string> };

async function authHeaders(options?: RequestOptions): Promise<Record<string, string>> {
  const headers: Record<string, string> = { apikey: SUPABASE_PUBLISHABLE_KEY };
  if (!options?.anonymous) {
    const session = await getSession();
    if (session) headers.Authorization = `Bearer ${session.accessToken}`;
  }
  return headers;
}

export async function rest<T>(path: string, init: { method?: string; body?: unknown } & RequestOptions = {}): Promise<T> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method: init.method ?? "GET",
    headers: {
      ...(await authHeaders(init)),
      ...(init.body !== undefined ? { "Content-Type": "application/json" } : {}),
      ...(init.method && init.method !== "GET" ? { Prefer: "return=representation" } : {}),
      ...init.headers,
    },
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });
  if (!response.ok) throw await parseError(response);
  if (response.status === 204) return null as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

export function rpc<T>(fn: string, args: Record<string, unknown>, options?: RequestOptions) {
  return rest<T>(`rpc/${fn}`, { method: "POST", body: args, ...options, headers: { Prefer: "return=representation", ...options?.headers } });
}

/* ---------------- Storage ---------------- */

export function publicStorageUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/${PRODUCT_BUCKET}/${path}`;
}

export async function uploadImage(path: string, blob: Blob) {
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${PRODUCT_BUCKET}/${path}`, {
    method: "POST",
    headers: { ...(await authHeaders()), "Content-Type": blob.type, "Cache-Control": "31536000", "x-upsert": "false" },
    body: blob,
  });
  if (!response.ok) throw await parseError(response);
  return publicStorageUrl(path);
}

export async function deleteImages(paths: string[]) {
  if (!paths.length) return;
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${PRODUCT_BUCKET}`, {
    method: "DELETE",
    headers: { ...(await authHeaders()), "Content-Type": "application/json" },
    body: JSON.stringify({ prefixes: paths }),
  });
  if (!response.ok) throw await parseError(response);
}
