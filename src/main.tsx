import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';

import ErrorDismissible from './components/Alert/ErrorDismissible';
import App from './components/App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorDismissible} onReset={() => window.localStorage.clear()}>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
