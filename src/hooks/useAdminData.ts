import { useState, useEffect, useCallback } from 'react';
import api from '@/services/api';

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export default function useAdminData<T extends { _id: string }>(endpoint: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const fetchAll = useCallback(async (params?: Record<string, string>) => {
    setLoading(true);
    setError('');
    try {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      const res = await api<{ data: T[]; pagination?: Pagination }>(`/admin/${endpoint}${query}`);
      setData(res.data || []);
      if (res.pagination) setPagination(res.pagination);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const createItem = async (item: Partial<T>) => {
    const res = await api<{ data: T }>(`/admin/${endpoint}`, { method: 'POST', body: item });
    await fetchAll();
    return res.data;
  };

  const updateItem = async (id: string, item: Partial<T>) => {
    const res = await api<{ data: T }>(`/admin/${endpoint}/${id}`, { method: 'PUT', body: item });
    await fetchAll();
    return res.data;
  };

  const deleteItem = async (id: string) => {
    await api(`/admin/${endpoint}/${id}`, { method: 'DELETE' });
    await fetchAll();
  };

  const toggleField = async (id: string, field: string) => {
    await api(`/admin/${endpoint}/${id}/toggle-${field}`, { method: 'PUT' });
    await fetchAll();
  };

  useEffect(() => { fetchAll(); }, [fetchAll]);

  return { data, loading, error, pagination, fetchAll, createItem, updateItem, deleteItem, toggleField, setData };
}
