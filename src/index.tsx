import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import App from './app/App';
import InvoiceDetails from './features/invoice-details/invoice-details';
import Reconciliation from './features/reconciliation/reonciliation';
import VendorTimeReports from './features/vendor-time-reports/vendor-time-reports';
import ProcessInvoice from './features/process-invoice/process-invoice';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<App />}>
          <Route key='1' path='/' element={<Reconciliation />} />
          <Route key='2' path='reconciliation' element={<Reconciliation />} />
          <Route key='3' path='VendorTimeReports/:contractNumber' element={<VendorTimeReports />} />
          <Route key='4' path='invoice/:invoiceId' element={<InvoiceDetails />} />
          <Route key='5' path='invoice/:invoiceId/processInvoice' element={<ProcessInvoice></ProcessInvoice>} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
