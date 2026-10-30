import React from 'react';
import { Link } from 'react-router-dom';

export const PageA: React.FC = () => {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>صفحه A (صفحه شروع)</h1>
      <p>لطفاً یکی از صفحات زیر را انتخاب کنید:</p>
      
      <nav style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Link to="/page-b" style={linkStyle}>
          رفتن به صفحه B
        </Link>
        <Link to="/page-c" style={linkStyle}>
          رفتن به صفحه C
        </Link>
      </nav>
    </main>
  );
};

const linkStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  background: '#2563eb',
  color: '#fff',
  textDecoration: 'none',
  borderRadius: '6px',
};
