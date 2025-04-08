import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import PatientList from './components/PatientList';
import PatientForm from './components/PatientForm';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import MyPage from './pages/MyPage.js';
import NoticeListPage from './pages/NoticeListPage.js';
import NoticeDetailPage from './pages/NoticeDetailPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage.js';
import SchedulePage from './pages/SchedulePage.js';
import NoticeFormPage from './pages/NoticeFormPage.js';
import DietCalendarPage from './pages/DietCalendarPage.js';
import UserDietCalendarPage from './pages/UserDietCalendarPage.js';
import TownNewsPage from './pages/TownNewsPage';
import ServicePicturePage from './pages/ServicePicturePage.js';
import AdminServicePicture from './pages/AdminServicePicture.js';
import UserDailySnapPage from './pages/UserDailySnapPage';
import AdminDailyUploadPage from './pages/AdminDailyUploadPages.js'; 



function App() {
  return (
    <Router>  
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/register" element={<PatientForm />} />
      <Route path="/list" element={<PatientList />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route path="/notice" element={<NoticeListPage />} />
      <Route path="/notice/:id" element={<NoticeDetailPage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/schedule" element={<SchedulePage />} />
      <Route path="/notice/new" element={<NoticeFormPage />} />
      <Route path="/admin/diet" element={<DietCalendarPage />} />
      <Route path="/meals" element={<UserDietCalendarPage />} />
      <Route path="/town" element={<TownNewsPage />} />
      <Route path="/town/event" element={<ServicePicturePage />} />
      <Route path="/town/admin/event" element={<AdminServicePicture />} />
      <Route path="/town/daily" element={<UserDailySnapPage />} />
      <Route path="/town/admin/daily" element={<AdminDailyUploadPage />} />


      {/* 나중에 staff, guardian 페이지도 추가 가능 */}
    </Routes>
  </Router>
  );
}

export default App; 
