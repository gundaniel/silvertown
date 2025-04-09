import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 추가
import Header from '../components/Header';
import UserChart from '../components/UserChart';
import '../css/AdminDashboardPage.css';
import axios from 'axios';


const AdminDashboardPage = () => {
  const navigate = useNavigate(); // ✅ 네비게이션 훅
  const [summary, setSummary] = useState({
    totalUsers: 0,
    todayUsers: 0,
    withdrawnUsers: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [users, setUsers] = useState([]);
  const [withdrawnUsers, setWithdrawnUsers] = useState([]);
  const [qnaList, setQnaList] = useState([]);


  const [activeModal, setActiveModal] = useState(null); // 'new', 'withdrawn', 'qna'

  useEffect(() => {
    const isAdmin = async () => {
      try{
      const res = await axios.get('http://localhost:8080/api/admin/check', {
      withCredentials: true,
    });

    if (!res.data) {
      alert("관리자만 접근 가능합니다.");
      navigate('/'); // 또는 navigate('/login') 등
      return;
    }
    fetchAll();
  }
    catch (error) {
      alert("접근권한이 없습니다.");
      navigate('/'); // 또는 navigate('/login') 등
    }
  };  

    const fetchAll = async () => {
      try {
      const summary = await axios.get('http://localhost:8080/api/admin/users/statistics');
      const users = await axios.get('http://localhost:8080/api/admin/users');
      const withdrawn = await axios.get('http://localhost:8080/api/admin/users/withdrawn');
      const chart = await axios.get('http://localhost:8080/api/admin/users/chart');
      const qnas = await axios.get('http://localhost:8080/api/admin/qna');

      setSummary(summary.data);
      setUsers(users.data);
      setWithdrawnUsers(withdrawn.data);
      setChartData(chart.data);
      setQnaList(qnas.data);
    } catch (error) {
      console.error('데이터 불러오기 실패:', error);
      alert('서버 오류가 발생했습니다.');
    }
  };

    isAdmin();
  }, [navigate]);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <Header />
      <div className="admin-dashboard">
        <aside className="admin-sidebar">
          <h3>📂 관리 메뉴</h3>
          <ul>
            <li onClick={() => setActiveModal('new')}> 전체 회원 목록</li>
            <li onClick={() => setActiveModal('withdrawn')}> 탈퇴 회원 목록</li>
            <li onClick={() => setActiveModal('qna')}> Q&A 목록</li>
          </ul>
        </aside>

        <main className="dashboard-main">
          <h2>관리자 대시보드</h2>
          <div className="summary-cards">
            <div className="card">
              <h3>전체 회원</h3>
              <p>{summary.totalUsers}명</p>
            </div>
            <div className="card">
              <h3>오늘 가입</h3>
              <p>{summary.todayUsers}명</p>
            </div>
            <div className="card">
              <h3>탈퇴 회원</h3>
              <p>{summary.withdrawnUsers}명</p>
            </div>
          </div>

          <div className="chart-section">
            <h3>회원 통계</h3>
            <UserChart data={chartData} />
          </div>
        </main>

        {/* 전체 회원 모달 */}
        {activeModal === 'new' && (
          <div className="modal-backdrop" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>📌전체 회원 목록</h3>
              <table>
                <thead>
                  <tr>
                    <th>아이디</th>
                    <th>이메일</th>
                    <th>이름</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id}>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={closeModal}>닫기</button>
            </div>
          </div>
        )}

        {/* 탈퇴 회원 모달 */}
        {activeModal === 'withdrawn' && (
          <div className="modal-backdrop" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>🗑 탈퇴 회원 목록</h3>
              <table>
                <thead>
                  <tr>
                    <th>아이디</th>
                    <th>이메일</th>
                    <th>이름</th>
                    <th>탈퇴 사유</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawnUsers.map((u) => (
                    <tr key={u.id}>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>{u.name}</td>
                      <td>{u.reason}</td> 
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={closeModal}>닫기</button>
            </div>
          </div>
        )}
     {/* Q&A 모달 */}
     {activeModal === 'qna' && (
          <div className="modal-backdrop" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>📬 Q&A 목록</h3>
              <ul>
                {qnaList.map((q) => (
                  <li key={q.id}>
                    <strong>[{q.category}]</strong> {q.name} ({q.phone}) {q.content}
                  </li>
                ))}
              </ul>
              <button onClick={closeModal}>닫기</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboardPage;
