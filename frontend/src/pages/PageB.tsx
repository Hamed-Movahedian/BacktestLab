import React from 'react';
import { Link } from 'react-router-dom';

export const PageB: React.FC = () => {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>صفحه B</h1>
      <p>محتوای صفحه B در اینجا قرار می‌گیرد.</p>
      <Link to="/" style={{ color: '#2563eb' }}>
        ← بازگشت به صفحه A
      </Link>
    </main>
  );
};
