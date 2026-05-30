import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import UserDashboardLayout from '../layouts/UserDashboardLayout';
import AdminDashboardLayout from '../layouts/AdminDashboardLayout';

// Auth Route Guards
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import PublicRoute from './PublicRoute';

// Public Pages
import LandingPage from '../pages/public/LandingPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';

// User Dashboard Pages
import UserDashboardPage from '../pages/user/UserDashboardPage';
import UserSyllabusPage from '../pages/user/UserSyllabusPage';
import UserMockTestsPage from '../pages/user/UserMockTestsPage';
import UserDailyQuizPage from '../pages/user/UserDailyQuizPage';
import UserAiAssistantPage from '../pages/user/UserAiAssistantPage';
import UserAnalyticsPage from '../pages/user/UserAnalyticsPage';
import UserSettingsPage from '../pages/user/UserSettingsPage';
import UserPapersPage from '../pages/user/UserPapersPage';
import TestInterfacePage from '../pages/user/TestInterfacePage';
import TestSummaryPage from '../pages/user/TestSummaryPage';
import ResultsPage from '../pages/user/ResultsPage';
import AttemptDetailsPage from '../pages/user/AttemptDetailsPage';

// Admin Dashboard Pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import UserManagementPage from '../pages/admin/UserManagementPage';
import ExamManagementPage from '../pages/admin/ExamManagementPage';
import MockTestsManagementPage from '../pages/admin/MockTestsManagementPage';
import AiAssistantManagementPage from '../pages/admin/AiAssistantManagementPage';
import AnalyticsPage from '../pages/admin/AnalyticsPage';
import AdminStudyLibraryPage from '../pages/admin/AdminStudyLibraryPage';
import SettingsPage from '../pages/admin/SettingsPage';
import AdminPapersPage from '../pages/admin/AdminPapersPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        } 
      />
      
      <Route 
        path="/register" 
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        } 
      />

      {/* User Dashboard Nested Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <UserDashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserDashboardPage />} />
        <Route path="syllabus" element={<UserSyllabusPage />} />
        <Route path="papers" element={<UserPapersPage />} />
        <Route path="mocktests" element={<UserMockTestsPage />} />
        <Route path="dailyquiz" element={<UserDailyQuizPage />} />
        <Route path="ai" element={<UserAiAssistantPage />} />
        <Route path="analytics" element={<UserAnalyticsPage />} />
        <Route path="settings" element={<UserSettingsPage />} />
        
        <Route path="results" element={<ResultsPage />} />
        <Route path="results/:id" element={<AttemptDetailsPage />} />
      </Route>

      {/* Standalone Protected Routes for Tests and Results */}
      <Route path="/mock-tests/:id" element={<ProtectedRoute><TestInterfacePage /></ProtectedRoute>} />
      <Route path="/dashboard/results/:id/summary" element={<ProtectedRoute><TestSummaryPage /></ProtectedRoute>} />

      {/* Admin Dashboard Nested Routes */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <AdminDashboardLayout />
          </AdminRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="exams" element={<ExamManagementPage />} />
        <Route path="mocktests" element={<MockTestsManagementPage />} />
        <Route path="ai" element={<AiAssistantManagementPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="library" element={<AdminStudyLibraryPage />} />
        <Route path="papers" element={<AdminPapersPage />} />
        <Route path="settings" element={<SettingsPage />} />
        {/* Fallback to admin/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />
      </Route>

      {/* Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
