import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../api/axiosClient';

let listeners = [];
let cachedCount = 0;
let cachedOrders = [];

const notify = () => listeners.forEach(fn => fn({ count: cachedCount, orders: cachedOrders }));

async function fetchPendingPayments() {
  try {
    const res = await axiosClient.get('/admin/orders', {
      params: { page: 0, size: 100, sortBy: 'createdAt', direction: 'desc' }
    });
    const raw    = res?.data?.data || res?.data || res;
    const orders = Array.isArray(raw) ? raw : (raw.content || []);
    const pending = orders.filter(o => o.status === 'PENDING' && o.paymentStatus === 'UNPAID');
    cachedCount  = pending.length;
    cachedOrders = pending;
    notify();
  } catch {}
}

let pollingTimer = null;

export function startPendingPaymentsPolling() {
  fetchPendingPayments();
  if (!pollingTimer) {
    pollingTimer = setInterval(fetchPendingPayments, 20000);
  }
}

export function stopPendingPaymentsPolling() {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
}

export function refreshPendingPayments() {
  fetchPendingPayments();
}

export function usePendingPayments() {
  const [state, setState] = useState({ count: cachedCount, orders: cachedOrders });

  useEffect(() => {
    const handler = data => setState({ ...data });
    listeners.push(handler);
    startPendingPaymentsPolling();
    return () => {
      listeners = listeners.filter(fn => fn !== handler);
    };
  }, []);

  return state;
}
