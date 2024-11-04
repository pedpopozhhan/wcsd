import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import App from './app/App';
import InvoiceDetails from './features/invoice-details/invoice-details';
import Invoices from './features/invoices/invoices';
import OneGxContract from '@/features/contracts/onegx-contract';
import InvoiceProcessing from './features/vendor-time-reports/vendor-time-reports';
import ProcessInvoice from './features/process-invoice/process-invoice';
import OneGxContractProcessing from './features/contracts/onegx-contract-detail';
import { AuthProvider } from 'react-oidc-context';
import { oidcConfig } from './common/kc-config';
import { LoggedOut } from './features/auth/logged-out';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './app/store';
import { UnAuthorized } from './features/auth/unauthorized';
import ProtectedRoute from './app/protectec-route';
import { PERMISSION } from './common/permission';
import InvoiceList from './features/invoicing/invoice-list';

const root = ReactDOM.createRoot(document.getElementById('root')!);
const authEnabled = import.meta.env.VITE_ENABLE_AUTHORIZATION === 'true';
root.render(
  <>
    {authEnabled && (
      <AuthProvider {...oidcConfig}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <React.StrictMode>
              <Router>
                <Routes>
                  {/* Redirect the root path to /invoicing */}
                  <Route path='/' element={<Navigate to='/invoicing' replace />} />

                  {/* Routes under /invoicing */}
                  <Route path='/invoicing' element={<App />}>
                    <Route element={<ProtectedRoute permissions={[PERMISSION.FIN_INVOICE_V, PERMISSION.FIN_INVOICE_W]} />}>
                      <Route key='1' index element={<Invoices />} />
                    </Route>
                    {/* <Route element={<ProtectedRoute permissions={[PERMISSION.FIN_INVOICE_V, PERMISSION.FIN_INVOICE_W]} />}>
                      <Route key='2' path='invoices' element={<Invoices />} />
                    </Route> */}
                    <Route element={<ProtectedRoute permissions={[PERMISSION.FIN_INVOICE_V, PERMISSION.FIN_INVOICE_W]} />}>
                      <Route key='3' path='invoice-processing/:contractNumber' element={<InvoiceProcessing />} />
                    </Route>
                    <Route element={<ProtectedRoute permissions={[PERMISSION.FIN_INVOICE_V, PERMISSION.FIN_INVOICE_W]} />}>
                      <Route key='4' path='invoice/:invoiceNumber' element={<InvoiceDetails />} />
                    </Route>
                    <Route element={<ProtectedRoute permissions={[PERMISSION.FIN_INVOICE_V, PERMISSION.FIN_INVOICE_W]} />}>
                      <Route key='5' path='invoice-process/:invoiceNumber' element={<ProcessInvoice />} />
                    </Route>
                    <Route element={<ProtectedRoute permissions={[PERMISSION.FIN_INVOICE_V, PERMISSION.FIN_INVOICE_W]} />}>
                      <Route key='6' path='processed-invoice/:invoiceId/:contractNumber' element={<ProcessInvoice />} />
                    </Route>
                  </Route>

                  {/* Root level routes */}
                  <Route key='7' path='/logged-out' element={<LoggedOut />} />
                  <Route key='8' path='/unauthorized' element={<UnAuthorized />} />

                  {/* Routes under /contracts */}
                  <Route path='/contracts' element={<App />}>
                    <Route element={<ProtectedRoute permissions={[PERMISSION.FIN_INVOICE_V, PERMISSION.FIN_INVOICE_W]} />}>
                      <Route key='9' index element={<OneGxContract />} />
                    </Route>
                    <Route element={<ProtectedRoute permissions={[PERMISSION.FIN_INVOICE_V, PERMISSION.FIN_INVOICE_W]} />}>
                      <Route key='10' path='contract-processing/:id' element={<OneGxContractProcessing />} />
                    </Route>
                  </Route>
                  {/* Routes under /invoices */}
                  <Route path='/invoices' element={<App />}>
                    <Route element={<ProtectedRoute permissions={[PERMISSION.FIN_INVOICE_V, PERMISSION.FIN_INVOICE_W]} />}>
                      <Route key='11' index element={<InvoiceList />} />
                    </Route>
                  </Route>
                </Routes>
              </Router>
            </React.StrictMode>
          </PersistGate>
        </Provider>
      </AuthProvider>
    )}
    ,
    {!authEnabled && (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <React.StrictMode>
            <Router>
              <Routes>
                {/* Redirect the root path to /invoicing */}
                <Route path='/' element={<Navigate to='/invoicing' replace />} />

                {/* Routes under /invoicing */}
                <Route path='/invoicing' element={<App />}>
                  <Route key='1' index element={<Invoices />} />

                  <Route key='3' path='invoice-processing/:contractNumber' element={<InvoiceProcessing />} />
                  <Route key='4' path='invoice/:invoiceNumber' element={<InvoiceDetails />} />
                  <Route key='5' path='invoice-process/:invoiceNumber' element={<ProcessInvoice />} />
                  <Route key='6' path='processed-invoice/:invoiceId/:contractNumber' element={<ProcessInvoice />} />
                </Route>

                {/* Root level routes */}
                <Route key='7' path='/logged-out' element={<LoggedOut />} />
                <Route key='8' path='/unauthorized' element={<UnAuthorized />} />

                {/* Routes under /contracts */}
                <Route path='/contracts' element={<App />}>
                  <Route key='9' index element={<OneGxContract />} />
                  <Route key='10' path='contract-processing/:id' element={<OneGxContractProcessing />} />
                </Route>

                <Route path='/invoices' element={<App />}>
                  <Route key='11' index element={<InvoiceList />} />
                </Route>
              </Routes>
            </Router>
          </React.StrictMode>
        </PersistGate>
      </Provider>
    )}
  </>,
);
