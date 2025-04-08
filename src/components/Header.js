import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/auth/check', {
          withCredentials: true,
        });
        setIsLoggedIn(res.data);
      } catch {
        setIsLoggedIn(false);
      }

      try {
        const res = await axios.get('http://localhost:8080/api/admin/check', { withCredentials: true });
      if (res.data === true) {
        setIsAdmin(true);
      }
      } catch {
        setIsAdmin(false);
      }
    };

    checkLogin();
  }, []);

  const handleLogout = async () => {
    const confirmed = window.confirm('정말 로그아웃 하시겠습니까?');
    if (!confirmed) return;

    try {
      if (isAdmin) {
        await axios.post('http://localhost:8080/api/admin/logout', null, { withCredentials: true });
      } else {
        await axios.post('http://localhost:8080/api/auth/logout', null, { withCredentials: true });
      }

      setIsLoggedIn(false);
      setIsAdmin(false);
      navigate('/');
    } catch {
      alert('로그아웃 실패');
    }
  };

  return (
    <header className={`main-header ${isAdmin ? 'admin-mode' : ''}`}>
      <div className={`logo ${isAdmin ? 'admin-active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
        SILVERTOWN{isAdmin && ' 관리자'}
      </div>

      <nav className={`nav-links ${isAdmin ? 'admin-mode' : ''}`}>
        <div className="menu-item"><Link to="/notice">공지사항</Link></div>
        <div className="menu-item"><Link to="/schedule">프로그램 일정</Link></div>
        <div className="menu-item">
        <Link to={isAdmin ? "/admin/diet" : "/meals"}>식단표</Link>
        </div>
        <div className="menu-item"><Link to="/town">타운소식</Link></div>
        {isAdmin && <div className="menu-item"><Link to="/admin">관리자 대시보드</Link></div>}
      </nav>

      <div className={`login-fixed ${isAdmin ? 'admin-mode' : ''}`}>
        {isAdmin ? (
          <button onClick={handleLogout} className="nav-link logout-btn">관리자 로그아웃</button>
        ) : isLoggedIn ? (
          <>
            <Link to="/mypage" className="nav-link">마이페이지</Link>
            <span style={{ margin: '0 8px' }}>|</span>
            <button onClick={handleLogout} className="nav-link logout-btn">로그아웃</button>
          </>
        ) : (
          <Link to="/login" className="nav-link">로그인</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
