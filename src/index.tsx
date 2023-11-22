import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { Home } from './routes/home';
import Utilization from './routes/utilization/utilization';
import App from './App';

// import './App.scss';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<App />}>
          <Route key='1' path='/' element={<Utilization />} />
          <Route key='2' path='utilization' element={<Utilization />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>
);
