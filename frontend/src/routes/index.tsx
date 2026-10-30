import { createBrowserRouter } from 'react-router-dom';
import { PageA } from '../pages/PageA';
import { PageB } from '../pages/PageB';
import { PageC } from '../pages/PageC';
import {StockViewer} from '../components/StockViewer'
import { BacktestChart } from '@/components/BacktestChart';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PageA />,
  },
  {
    path: '/page-b',
    element: <StockViewer />,
  },
  {
    path: '/page-c',
    element: <BacktestChart />,
  },
  {
    path: '*',
    element: (
      <div style={{ padding: '2rem' }}>
        <h2>صفحه پیدا نشد (404)</h2>
      </div>
    ),
  },
]);
