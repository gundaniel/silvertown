import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import '../css/TownNewsPage.css';

const TownNewsPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 서버에 관리자 로그인 여부 확인 요청
    axios.get('http://localhost:8080/api/admin/check', { withCredentials: true })
      .then(res => {
        if (res.data === true) {
          setIsAdmin(true);
          sessionStorage.setItem('ADMIN_LOGIN', 'true');
        } else {
          setIsAdmin(false);
          sessionStorage.removeItem('ADMIN_LOGIN');
        }
      })
      .catch(() => {
        setIsAdmin(false);
        sessionStorage.removeItem('ADMIN_LOGIN');
      });
  }, []);

  return (
    <>
      <Header />
      <div className="town-news-container">
      <div className="town-news-wrapper">
        <h2 className="town-news-title">타운소식</h2>
        <div className="news-polaroid-container">
          <Link
            to={isAdmin ? "/town/admin/event" : "/town/event"}
            className="polaroid-card"
          >
            <img src="/images/service.png" alt="봉사 행사" />
            <div className="caption">봉사 및 행사</div> 
          </Link>

          <Link to={isAdmin? "/town/admin/daily" : "/town/daily"} className="polaroid-card">
            <img src="/images/snap.png" alt="일상 스냅" />
            <div className="caption">일상 사진</div>
          </Link>
        </div>
      </div>
      </div>
    </>
  );
};

export default TownNewsPage;
