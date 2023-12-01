import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Home } from './routes/home';
import Reconciliation from './routes/reconciliation/reonciliation';

import VendorTimeReports from './routes/vendor-time-reports/vendor-time-reports';
import App from './App';
import InvoiceDetails from './routes/invoice-details/invoice-details';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<App />}>
          <Route key='1' path='/' element={<Reconciliation />} />
          <Route key='2' path='reconciliation' element={<Reconciliation />} />
          <Route
            key='3'
            path='VendorTimeReports/:contractId'
            element={<VendorTimeReports />}
          />
          <Route
            key='4'
            path='invoice/:invoiceId'
            element={<InvoiceDetails />}
          />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
