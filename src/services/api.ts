const API_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  isFormData?: boolean;
}

interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  [key: string]: T | boolean | string | undefined;
}

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function api<T = ApiResponse>(
  endpoint: string,
  options: ApiOptions & { forceRefresh?: boolean } = {}
): Promise<T> {
  const { method = 'GET', body, headers = {}, isFormData = false, forceRefresh = false } = options;

  let tokenLocal;
  try {
    tokenLocal = localStorage.getItem('token');
  } catch(e) {}

  if (tokenLocal) {
    headers['Authorization'] = `Bearer ${tokenLocal}`;
  }

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  // Session Storage Caching specific to Public GET endpoints
  const cacheKey = `av_cache_${endpoint.replace(/\//g, '_')}`;
  if (method === 'GET' && endpoint.startsWith('/public/') && !forceRefresh) {
    try {
      const cachedString = sessionStorage.getItem(cacheKey);
      if (cachedString) {
        const parsed = JSON.parse(cachedString);
        // Only return if it exists and possesses the signature
        if (parsed?._cacheTimestamp && (Date.now() - parsed._cacheTimestamp < 600000)) { // 10 minutes cache logic
          return parsed.data as T;
        }
      }
    } catch(e) {}
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? (body as FormData) : JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      data.message || 'Something went wrong',
      response.status
    );
  }

  // Cache successful GET results for public API calls
  if (method === 'GET' && endpoint.startsWith('/public/')) {
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify({ data, _cacheTimestamp: Date.now() }));
    } catch(e) {}
  }

  return data as T;
}

// Auth API helpers
export const authApi = {
  checkSetup: () => api('/auth/check-setup'),
  setup: (data: { name: string; email: string; password: string; turnstileToken?: string }) =>
    api('/auth/setup', { method: 'POST', body: data }),
  login: (data: { email: string; password: string; turnstileToken?: string }) =>
    api('/auth/login', { method: 'POST', body: data }),
  getMe: () => api('/auth/me'),
  updateProfile: (formData: FormData) =>
    api('/auth/update-profile', {
      method: 'PUT',
      body: formData,
      isFormData: true,
    }),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api('/auth/change-password', { method: 'PUT', body: data }),
  forgotPassword: (email: string, turnstileToken?: string) =>
    api('/auth/forgot-password', { method: 'POST', body: { email, turnstileToken } }),
  resetPassword: (token: string, password: string) =>
    api(`/auth/reset-password/${token}`, {
      method: 'POST',
      body: { password },
    }),
  acceptInvite: (token: string, password: string) =>
    api(`/auth/accept-invite/${token}`, {
      method: 'POST',
      body: { password },
    }),
};

// User Management API helpers (Admin only)
export const userApi = {
  getUsers: () => api<{ data: unknown[] }>('/users'),
  inviteUser: (data: { name: string; email: string; role?: string }) =>
    api('/users', { method: 'POST', body: data }),
  deleteUser: (id: string) => api(`/users/${id}`, { method: 'DELETE' }),
};

// Upload API helpers
export const uploadApi = {
  uploadImage: (formData: FormData) =>
    api('/upload/image', { method: 'POST', body: formData, isFormData: true }),
  uploadFile: (formData: FormData) =>
    api('/upload/file', { method: 'POST', body: formData, isFormData: true }),
  getFiles: (params?: Record<string, string>) => {
    const query = params ? '?' + new URLSearchParams(params).toString() : '';
    return api(`/upload/files${query}`);
  },
  deleteFile: (id: string) =>
    api(`/upload/files/${id}`, { method: 'DELETE' }),
};

// Public API helpers (no auth required)
export const publicApi = {
  getSite: () => api<{ data: Record<string, unknown> }>('/public/site'),
  getProjects: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return api<{ data: unknown[] }>(`/public/projects${q}`);
  },
  getProjectBySlug: (slug: string) => api<{ data: Record<string, unknown> }>(`/public/projects/${slug}`),
  getBlog: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return api<{ data: unknown[] }>(`/public/blog${q}`);
  },
  getBlogBySlug: (slug: string) => api<{ data: Record<string, unknown> }>(`/public/blog/${slug}`),
  getSkills: () => api<{ data: unknown[]; grouped: Record<string, unknown[]> }>('/public/skills'),
  getServices: () => api<{ data: unknown[] }>('/public/services'),
  getExperience: (type?: string) => {
    const q = type ? `?type=${type}` : '';
    return api<{ data: unknown[] }>(`/public/experience${q}`);
  },
  getTestimonials: (params?: Record<string, string>) => {
    const q = params ? '?' + new URLSearchParams(params).toString() : '';
    return api<{ data: unknown[] }>(`/public/testimonials${q}`);
  },
  submitContact: (data: { name: string; email: string; subject: string; message: string; turnstileToken?: string }) =>
    api('/public/contact', { method: 'POST', body: data }),
  submitTestimonial: (data: { name: string; role?: string; company?: string; content: string; rating: number; turnstileToken?: string }) =>
    api('/public/testimonials', { method: 'POST', body: data }),
  subscribeNewsletter: (email: string, turnstileToken?: string) =>
    api('/public/newsletter', { method: 'POST', body: { email, turnstileToken } }),
};

export { ApiError };
export default api;
