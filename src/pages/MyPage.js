import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import '../css/MyPage.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const MyPage = () => {
  const [user, setUser] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawReason, setWithdrawReason] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/users/me', {
          withCredentials: true,
        });
        setUser(res.data);
      } catch (err) {
        navigate('/');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleWithdrawSubmit = async () => {
    if (!withdrawReason.trim()) {
      alert('탈퇴 사유를 입력해주세요.');
      return;
    }
  
    try {
      await axios.post('http://localhost:8080/api/users/withdraw', {
        reason: withdrawReason,
      }, { withCredentials: true });
  
      alert('탈퇴 처리되었습니다.');
      navigate('/');
    } catch (err) {
      alert('탈퇴에 실패했습니다.');
    }
  };

  if (!user) return <div>null</div>;

  return (
    <>
      <Header />
      <div className="mypage-container">
      <div className="mypage-inner">
        <aside className="mypage-sidebar">
          <div className="user-profile">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
          <ul className="sidebar-menu">
            <li>내프로필</li>
            <li>보호자 정보</li>
            <li>서비스 내역</li>
          </ul>
        </aside>

        <main className="mypage-main">
          <div className="info-box">
            <h4>보호자 기본 정보</h4>
            <p><strong>아이디:</strong> {user.username}</p>
            <p><strong>이름:</strong> {user.name}</p>
            <p><strong>생년월일:</strong> {user.birth}</p>
            <p><strong>이메일:</strong> {user.email}</p>
            <p><strong>주소:</strong> {user.address}</p>
            <div className="btn-box">
            <button className="withdraw-btn" onClick={() => setShowWithdrawModal(true)}>
              회원 탈퇴하기
            </button>
          </div>
            
          </div>

          <div className="info-box">
            <h4>보호 대상 어르신</h4>
            <p><strong>이름:</strong> 김할머니</p>
            <p><strong>입소일:</strong> 2023-11-15</p>
            <p><strong>현재 상태:</strong> 안정적인 상태로 요양 중</p>
          </div>

          <div className="info-box">
            <h4>이용 중인 서비스</h4>
            <ul>
              <li>기본 요양 서비스</li>
              <li>정기 건강 검진</li>
              <li>주간 문화 프로그램 (서예, 음악 치료 등)</li>
            </ul>
          </div>
        </main>
      </div>
      </div>
          {showWithdrawModal && (
      <div className="modal-backdrop" onClick={() => setShowWithdrawModal(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h3>탈퇴 사유를 입력해주세요</h3>
          <textarea
            rows="4"
            placeholder="ex) 서비스 이용이 불편했어요..."
            value={withdrawReason}
            onChange={(e) => setWithdrawReason(e.target.value)}
          />
          <div className="modal-actions">
            <button onClick={handleWithdrawSubmit} className="withdraw-btn">탈퇴하기</button>
            <button onClick={() => setShowWithdrawModal(false)}>취소</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default MyPage;
