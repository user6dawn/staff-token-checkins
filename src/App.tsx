import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Success } from './pages/Success';
import { AdminDashboard } from './pages/AdminDashboard';
import { UserProfile } from './pages/UserProfile';
import { Form } from './pages/Form';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/success" element={<Success />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/form" element={<Form />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;