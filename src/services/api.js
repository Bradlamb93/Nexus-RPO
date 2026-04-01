const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

let accessToken = localStorage.getItem('accessToken');
let refreshToken = localStorage.getItem('refreshToken');

function setTokens(access, refresh) {
  accessToken = access;
  refreshToken = refresh;
  if (access) localStorage.setItem('accessToken', access);
  else localStorage.removeItem('accessToken');
  if (refresh) localStorage.setItem('refreshToken', refresh);
  else localStorage.removeItem('refreshToken');
}

function clearTokens() {
  setTokens(null, null);
  localStorage.removeItem('user');
}

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  let res = await fetch(url, { ...options, headers });

  // If token expired, try refresh
  if (res.status === 401) {
    const body = await res.json().catch(() => ({}));
    if (body.code === 'TOKEN_EXPIRED' && refreshToken) {
      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (refreshRes.ok) {
        const tokens = await refreshRes.json();
        setTokens(tokens.accessToken, tokens.refreshToken);
        headers.Authorization = `Bearer ${tokens.accessToken}`;
        res = await fetch(url, { ...options, headers });
      } else {
        clearTokens();
        window.location.reload();
        throw new Error('Session expired');
      }
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ─── Auth ───────────────────────────────────────────────────────────
export const auth = {
  async login(email, password) {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setTokens(data.accessToken, data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async register(name, email, password, role, org) {
    const data = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role, org }),
    });
    setTokens(data.accessToken, data.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  async me() {
    return request('/auth/me');
  },

  async logout() {
    try { await request('/auth/logout', { method: 'POST' }); } catch {}
    clearTokens();
  },

  getStoredUser() {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  },

  isAuthenticated() {
    return !!accessToken;
  },
};

// ─── CRUD Helpers ───────────────────────────────────────────────────
function createCRUD(base) {
  return {
    list: (params) => {
      const qs = params ? '?' + new URLSearchParams(params).toString() : '';
      return request(`${base}${qs}`);
    },
    get: (id) => request(`${base}/${id}`),
    create: (data) => request(base, { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`${base}/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`${base}/${id}`, { method: 'DELETE' }),
  };
}

// ─── Domain APIs ────────────────────────────────────────────────────
export const shifts = createCRUD('/shifts');
export const agencies = createCRUD('/agencies');
export const workers = createCRUD('/workers');
export const timesheets = createCRUD('/timesheets');
export const invoices = createCRUD('/invoices');
export const compliance = createCRUD('/compliance');
export const rateCards = createCRUD('/rate-cards');
export const bankStaff = createCRUD('/bank-staff');
export const users = createCRUD('/users');
export const documents = createCRUD('/documents');
export const creditNotes = createCRUD('/credit-notes');
export const rateUplifts = createCRUD('/rate-uplifts');
export const notifications = {
  list: (params) => request('/notifications' + (params ? '?' + new URLSearchParams(params) : '')),
  markRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllRead: () => request('/notifications/mark-all-read', { method: 'POST' }),
};

// ─── Structured endpoints ──────────────────────────────────────────
export const clients = {
  groups: {
    list: () => request('/clients/groups'),
    get: (id) => request(`/clients/groups/${id}`),
    create: (data) => request('/clients/groups', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/clients/groups/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  locations: {
    list: (params) => request('/clients/locations' + (params ? '?' + new URLSearchParams(params) : '')),
    create: (data) => request('/clients/locations', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/clients/locations/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  pricing: {
    list: () => request('/clients/pricing'),
    update: (groupId, data) => request(`/clients/pricing/${groupId}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
};

export const budgets = {
  list: () => request('/budgets'),
  update: (careHome, data) => request(`/budgets/${encodeURIComponent(careHome)}`, { method: 'PUT', body: JSON.stringify(data) }),
};

export const bankRates = {
  list: () => request('/bank-rates'),
  create: (data) => request('/bank-rates', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => request(`/bank-rates/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id) => request(`/bank-rates/${id}`, { method: 'DELETE' }),
};

export const health = () => request('/health');
