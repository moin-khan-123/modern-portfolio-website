"use client";

import React, { useState } from 'react';
import { User } from '../types';
import { APP_NAME } from '../utils/constants';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { Button } from './ui/Button';
import { api } from '../services/api';
import About from './About';
import Hero from './Hero';

const Playground: React.FC = () => {
  const scrollY = useScrollPosition();
  const [serverMsg, setServerMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sampleUser: User = { id: 'u1', name: 'Jane Doe', email: 'jane@example.com' };

  function getErrorMessage(err: unknown) {
    if (!err) return 'unknown error';
    if (typeof err === 'string') return err;
    if (err instanceof Error) return err.message;
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  }

  async function checkApi() {
    setLoading(true);
    try {
      // This will try to call the API_BASE_URL + '/status' — keep it optional in your app.
      const res = await api.get<{ message: string }>('/status');
      setServerMsg(res?.message ?? 'no message');
    } catch (err: unknown) {
      setServerMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8 py-8">
    </div>
  );
};

export default Playground;
