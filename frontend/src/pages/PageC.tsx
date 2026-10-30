import React from 'react';
import { Link } from 'react-router-dom';

export const PageC: React.FC = () => {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>صفحه C</h1>
      <p>محتوای صفحه C در اینجا قرار می‌گیرد.</p>
      <Link to="/" style={{ color: '#2563eb' }}>
        ← بازگشت به صفحه A
      </Link>
    </main>
  );
};
