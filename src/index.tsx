import React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";


import { Home } from './routes/home';
import Utilization from './routes/utilization';
import App from './App';

import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
         <Route path="/" element={<App />}>
         <Route path="/" element={<Home />} />
         <Route path="utilization" element={<Utilization />} />          
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>,
);
