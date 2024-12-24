import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import SPVSetup from './components/SPVSetup';
import Vehicles from './components/Vehicles';
import Login from './components/Login';
import CreateUser from './components/CreateUser';
import DealPage from './components/DealPage';
import ProtectedRoute from './components/ProtectedRoute';
import { MenuIcon, Car, Network, LogOut } from 'lucide-react';
import { supabase } from './lib/supabase';

function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Unauthorized Access</h1>
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    </div>
  );
}

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="w-64 bg-white border-r h-screen fixed flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center">
          <MenuIcon className="h-6 w-6" />
          <span className="ml-2 font-bold text-xl">TWELLED</span>
        </div>
      </div>
      <div className="p-4 flex-1">
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/vehicles')}
            className="flex items-center space-x-2 p-2 bg-[#1B3B36] text-white rounded w-full"
          >
            <Car className="h-5 w-5" />
            <span>Vehicles</span>
          </button>
          <button 
            onClick={() => navigate('/lp-network')}
            className="flex items-center space-x-2 p-2 text-gray-600 w-full"
          >
            <Network className="h-5 w-5" />
            <span>LP Network</span>
          </button>
        </div>
      </div>
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded w-full"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
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
    // initializeDatabase();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <Layout>
                <Vehicles />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/deal/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <DealPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/spv-setup"
          element={
            <ProtectedRoute>
              <Layout>
                <SPVSetup />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/create-user"
          element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <CreateUser />
              </Layout>
            </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
