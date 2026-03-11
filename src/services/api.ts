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
  options: ApiOptions = {}
): Promise<T> {
  const { method = 'GET', body, headers = {}, isFormData = false } = options;

  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
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

  return data as T;
}

// Auth API helpers
export const authApi = {
  checkSetup: () => api('/auth/check-setup'),
  setup: (data: { name: string; email: string; password: string }) =>
    api('/auth/setup', { method: 'POST', body: data }),
  login: (data: { email: string; password: string }) =>
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
  forgotPassword: (email: string) =>
    api('/auth/forgot-password', { method: 'POST', body: { email } }),
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
  submitContact: (data: { name: string; email: string; subject: string; message: string }) =>
    api('/public/contact', { method: 'POST', body: data }),
  submitTestimonial: (data: { name: string; role?: string; company?: string; content: string; rating: number }) =>
    api('/public/testimonials', { method: 'POST', body: data }),
  subscribeNewsletter: (email: string) =>
    api('/public/newsletter', { method: 'POST', body: { email } }),
};

export { ApiError };
export default api;
