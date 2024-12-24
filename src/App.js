import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import Login from './components/Login';
import Vehicles from './components/Vehicles';
import SPVSetup from './components/SPVSetup';
import DealPage from './components/DealPage';
import CreateUser from './components/CreateUser';
import Unauthorized from './components/Unauthorized';
import { MenuIcon, Car, Network, LogOut } from 'lucide-react';

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
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      checkAdminStatus(session?.user?.email);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      checkAdminStatus(session?.user?.email);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (email) => {
    if (!email) {
      setIsAdmin(false);
      return;
    }

    if (email === 'admin@twelled.com') {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  // Use basename only in production
  const basename = process.env.NODE_ENV === 'production' ? '/eval-task-spv' : '';

  return (
    <Router basename={basename}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route
          path="/"
          element={
            session ? (
              <Navigate to="/vehicles" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/vehicles"
          element={
            session ? (
              <Layout>
                <Vehicles isAdmin={isAdmin} />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/spv-setup"
          element={
            session ? (
              <Layout>
                <SPVSetup />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/deal/:spvId"
          element={
            session ? (
              <Layout>
                <DealPage />
              </Layout>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/create-user"
          element={
            session && isAdmin ? (
              <Layout>
                <CreateUser />
              </Layout>
            ) : (
              <Navigate to="/unauthorized" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
