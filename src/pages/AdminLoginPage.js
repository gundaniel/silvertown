import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AdminLoginPage.css';

const AdminLoginPage = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        await fetch('http://localhost:8080/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
              adminId: 'adminkim',
              password: 'admin1234'
            }),
          });

      navigate('/admin'); // 관리자 대시보드로 이동
    } catch (err) {
      alert('관리자 ID 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-form">
        <h2>관리자 로그인</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="관리자 ID"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">로그인</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
