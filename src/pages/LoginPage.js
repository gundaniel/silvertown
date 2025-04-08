import React, { useState } from 'react';
import '../css/LoginPage.css';
import { Link,useNavigate  } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        'http://localhost:8080/api/auth/login',
        { username, password },
        { withCredentials: true }
      );

      navigate('/');
    } catch (err) {
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <>
    <Header />
    <div className="login-page">
      <div className="login-form">
        <h2>로그인</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <p className="register-link">
          계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </p>
      </div>
    </div>
    <p className="admin-link">
  <Link to="/admin/login">관리자로 로그인</Link>
</p>
    </>
  );
};

export default LoginPage;
