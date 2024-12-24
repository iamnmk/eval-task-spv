import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SPVSetup from './components/SPVSetup';
import Vehicles from './components/Vehicles';
import { MenuIcon, Car, Network } from 'lucide-react';
import { initializeDatabase } from './lib/supabase';

function Sidebar() {
  return (
    <div className="w-64 bg-white border-r h-screen fixed">
      <div className="p-4 border-b">
        <div className="flex items-center">
          <MenuIcon className="h-6 w-6" />
          <span className="ml-2 font-bold text-xl">TWELLED</span>
        </div>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          <a 
            href="/vehicles" 
            className="flex items-center space-x-2 p-2 bg-[#1B3B36] text-white rounded"
          >
            <Car className="h-5 w-5" />
            <span>Vehicles</span>
          </a>
          <a 
            href="/lp-network" 
            className="flex items-center space-x-2 p-2 text-gray-600"
          >
            <Network className="h-5 w-5" />
            <span>LP Network</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 flex-1">
        {children}
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    initializeDatabase();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/spv-setup" element={<SPVSetup />} />
          <Route path="/" element={<Navigate to="/vehicles" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
