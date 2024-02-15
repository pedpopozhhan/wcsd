import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import App from './app/App';
import InvoiceDetails from './features/invoice-details/invoice-details';
import Reconciliation from './features/reconciliation/reonciliation';
import VendorTimeReports from './features/vendor-time-reports/vendor-time-reports';
import ProcessInvoice from './features/process-invoice/process-invoice';
import ProcessedInvoice from './features/processed-invoice/Processed-invoice';
import ProtectedRoute from './app/protectec-route';
import { PERMISSION } from './common/permission';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<App />}>
          <Route key='1' path='/' element={<Reconciliation />} />
          {/* example usage of protected route 
          <Route element={<ProtectedRoute permissions={[PERMISSION.FIN_INVOICE_V, PERMISSION.FIN_INVOICE_W]} />}>
            <Route path='/reconciliation2' element={<Reconciliation />} />
          </Route>*/}
          <Route key='2' path='reconciliation' element={<Reconciliation />} />
          <Route key='3' path='VendorTimeReports/:contractNumber' element={<VendorTimeReports />} />
          <Route key='4' path='invoice/:invoiceId' element={<InvoiceDetails />} />
          <Route key='5' path='invoice/:invoiceId/processInvoice' element={<ProcessInvoice></ProcessInvoice>} />
          <Route key='6' path='ProcessedInvoice/:invoiceKey' element={<ProcessedInvoice></ProcessedInvoice>} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
