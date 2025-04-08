// src/pages/NoticeListPage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import '../css/Notice.css';

const NoticeListPage = () => {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/notices');
        setNotices(res.data);
      } catch (err) {
        console.error('공지사항을 불러오지 못했습니다.', err);
      }
    };
    fetchNotices();
  }, []);

  const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
  axios.get('http://localhost:8080/api/admin/check', { withCredentials: true })
    .then(res => setIsAdmin(res.data === true))
    .catch(() => setIsAdmin(false));
}, []);

  return (
    <>
      <Header />
      <div className="notice-wrapper">
  <div className="notice-card">
    <h2>공지사항</h2>

    <div className="notice-tabs">
      <div className="notice-tab active">문화센터</div>
      <div className="notice-tab">스포츠센터</div>
    </div>

    <table className="notice-table">
      <thead>
        <tr>
          <th style={{ width: '10%' }}>NO</th>
          <th style={{ width: '55%' }}>제목</th>
          <th style={{ width: '15%' }}>작성자</th>
          <th style={{ width: '20%' }}>작성일</th>
        </tr>
      </thead>
      <tbody>
        {notices.map((notice, idx) => (
          <tr key={notice.id}>
            <td>{notices.length - idx}</td>
            <td>
              <Link to={`/notice/${notice.id}`}>{notice.title}</Link>
            </td>
            <td>관리자</td>
            <td>{new Date(notice.createdAt).toLocaleDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
    {isAdmin && (
  <div style={{ textAlign: 'right', marginBottom: '20px' }}>
    <Link to="/notice/new" className="write-notice-btn"> 공지 작성</Link>
  </div>
)}
  </div>
</div>


    </>
  );
};

export default NoticeListPage;
