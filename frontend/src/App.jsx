import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import ProtectedRouter from './components/ProtectedRouter';
import Layout from './pages/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Unauthorized from './pages/Unauthorized';
import AdminPanel from './pages/AdminPanel';
import RoleRoute from './components/RoleRoute';
import TaskForm from './pages/TaskForm';
import ProjectForm from './pages/ProjectForm';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import DashboardLayout from '#components/DashboardLayout';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/unauthorized' element={<Unauthorized />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />


        <Route element={<ProtectedRouter />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/project" element={<ProjectForm />} />
            <Route path="/task" element={<TaskForm />} />
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </Route>
        </Route>

      </Routes >
    </>
  )
}

export default App

