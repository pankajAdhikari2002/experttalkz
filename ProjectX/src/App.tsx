import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { router } from './router';

import { AuthProvider } from './context/AuthContext';
import { CurrencyProvider } from './context/CurrencyContext';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CurrencyProvider>
          <RouterProvider router={router} />
        </CurrencyProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
