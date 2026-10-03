import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { WishlistProvider } from './context/WishlistContext.tsx';
import { PartsInventoryProvider } from './context/PartsInventoryContext.tsx';
import { VehicleStockProvider } from './context/VehicleStockContext.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <LanguageProvider>
      <WishlistProvider>
        <PartsInventoryProvider>
          <VehicleStockProvider>
            <App />
          </VehicleStockProvider>
        </PartsInventoryProvider>
      </WishlistProvider>
    </LanguageProvider>
  </StrictMode>
);

