// src/pages/NoticeFormPage.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../css/NoticeFormPage.css';

const NoticeFormPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    } 

    try {
      await axios.post('http://localhost:8080/api/notices', {
        title,
        content,
      } ,{withCredentials: true
        
      });
      alert('공지사항이 등록되었습니다.');
      navigate('/notice');
    } catch {
      alert('공지사항 등록 실패');
    }
  };

  return (
    <>
      <Header />
      <div className="notice-form-wrapper">
        <h2>공지사항 작성</h2>
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="form-buttons">
          <button onClick={handleSubmit}>작성</button>
          <button onClick={() => navigate('/notice')}>취소</button>
        </div>
      </div>
    </>
  );
};

export default NoticeFormPage;
