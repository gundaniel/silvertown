import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/SignupPage.css';
import Header from '../components/Header';

const SignupPage = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    birth: '',
    address: '',
    detailAddress: '',
    email: '',
  });
  const [usernameCheck, setUsernameCheck] = useState(null);
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [inputCode, setInputCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === 'username') {
      setUsernameCheck(null);
    }
  };

  const handleSearchAddress = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setForm((prev) => ({ ...prev, address: data.address }));
      },
    }).open();
  };

  const checkUsernameDuplicate = async () => {
    if (!form.username) {
      alert('아이디를 입력해주세요.');
      return;
    }

    try {
      const res = await axios.get('http://localhost:8080/api/users/check-username', {
        params: { username: form.username },
        withCredentials: true,
      });
      setUsernameCheck(res.data);
      alert(res.data ? '사용 가능한 아이디입니다!' : '이미 사용 중인 아이디입니다.');
    } catch (err) {
      alert('중복 검사 중 오류가 발생했습니다.');
    }
  };

  const requestEmailVerification = async () => {
    if (!form.email) {
      alert('이메일을 입력해주세요.');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/email/send', null, {
        params: { email: form.email },
        withCredentials: true,
      });
      setEmailSent(true);
      alert('이메일로 인증번호가 전송되었습니다.');
    } catch (err) {
      alert('이메일 인증 요청 중 오류가 발생했습니다.');
    }
  };

  const verifyCode = async () => {
    try {
      const res = await axios.post('http://localhost:8080/api/email/verify', null, {
        params: { code: inputCode },
        withCredentials: true,
      });
      if (res.data === '이메일 인증이 완료되었습니다.') {
        setEmailVerified(true);
        alert(res.data);
      }
    } catch (err) {
      alert('인증번호가 올바르지 않습니다.');
    }
  };

  const handleRegister = async () => {
    if (!emailVerified) {
      alert('이메일 인증을 완료해주세요.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8080/api/users/register', form, {
        withCredentials: true,
      });
      alert(res.data);
      window.location.href = '/login';
    } catch (err) {
      if (err.response && err.response.data) {
        alert(err.response.data);
      } else {
        alert('회원가입 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <>
    <Header />
    <div className="signup-page">
      <div className="signup-form">
        <h2>회원가입</h2>

        <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder="아이디"
            value={form.username}
            onChange={handleChange}
            required
          />
          <button type="button" onClick={checkUsernameDuplicate}>
            중복 확인
          </button>
        </div>
        {usernameCheck !== null && (
          <p className={usernameCheck ? 'valid' : 'invalid'}>
            {usernameCheck ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.'}
          </p>
        )}

        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="name"
          placeholder="이름"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="birth"
          placeholder="생년월일"
          value={form.birth}
          onChange={handleChange}
          required
        />

        <div className="input-group">
          <input
            type="text"
            name="address"
            placeholder="주소"
            value={form.address}
            onChange={handleChange}
            readOnly
          />
          <button type="button" onClick={handleSearchAddress}>
            주소 검색
          </button>
        </div>

        <input
          type="text"
          name="detailAddress"
          placeholder="상세 주소"
          value={form.detailAddress}
          onChange={handleChange}
        />

        <div className="input-group">
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={handleChange}
            required
            disabled={emailVerified}
          />
          <button
            type="button"
            onClick={requestEmailVerification}
            disabled={emailVerified}
          >
            {emailVerified ? '인증 완료' : '인증 요청'}
          </button> 
        </div>

        {emailSent && !emailVerified && (
          <div className="input-group">
            <input
              type="text"
              placeholder="인증번호 입력"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
            />
            <button type="button" onClick={verifyCode}>
              확인
            </button>
          </div>
        )}

        <button type="submit" className="submitBtn" onClick={handleRegister}>
          회원가입 완료
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
    </>
  );
};

export default SignupPage;