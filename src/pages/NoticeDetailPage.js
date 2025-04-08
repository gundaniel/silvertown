import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import '../css/NoticeDetailPage.css';
import Modal from 'react-modal';

const NoticeDetailPage = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [comments, setComments] = useState([]);
  const [username, setUsername] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [editNoticeModalOpen, setEditNoticeModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [editingPassword, setEditingPassword] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const noticeRes = await axios.get(`http://localhost:8080/api/notices/${id}`);
        setNotice(noticeRes.data);

        const commentsRes = await axios.get(`http://localhost:8080/api/notices/${id}/comments`);
        setComments(commentsRes.data);

        const userRes = await axios.get('http://localhost:8080/api/users/me', {
          withCredentials: true,
        });

        if (userRes.data?.username) {
          setIsLoggedIn(true);
          setUsername(userRes.data.username);
          return;
        }
      } catch {
        try {
          const adminRes = await axios.get('http://localhost:8080/api/admin/me', {
            withCredentials: true,
          });
          if (adminRes.data) {
            setIsLoggedIn(true);
            setUsername('관리자');
          }
        } catch {
          setIsLoggedIn(false);
        }
      }
    };

    fetchAll();
  }, [id]);

  const handleSubmit = async () => {
    const isAdmin = username === '관리자';

    if (!username.trim() || !newComment.trim()) return alert('내용을 입력해주세요.');
    if (!isAdmin && (!newPassword.trim() || newPassword.length !== 4)) return alert('비밀번호는 4자리여야 합니다.');

    try {
      await axios.post(
        `http://localhost:8080/api/notices/${id}/comments`,
        {
          username,
          content: newComment,
          password: isAdmin ? '0000' : newPassword,
        },
        { withCredentials: true }
      );

      if (!isLoggedIn) setUsername('');
      setNewComment('');
      setNewPassword('');
      const res = await axios.get(`http://localhost:8080/api/notices/${id}/comments`);
      setComments(res.data);
    } catch {
      alert('댓글 작성 실패');
    }
  };

  const handleDelete = async (commentId) => {
    let password = '0000';

    if (username !== '관리자') {
      password = prompt('비밀번호 4자리를 입력하세요');
      if (!password || password.length !== 4) return alert('비밀번호는 4자리여야 합니다.');
    }

    try {
      await axios.delete(`http://localhost:8080/api/notices/${id}/comments/${commentId}`, {
        data: { password },
        withCredentials: true,
      });
      const res = await axios.get(`http://localhost:8080/api/notices/${id}/comments`);
      setComments(res.data);
    } catch {
      alert('비밀번호가 일치하지 않거나 삭제에 실패했습니다.');
    }
  };

  const startEdit = async (comment) => {
    if (username === '관리자') {
      setEditingId(comment.id);
      setEditingContent(comment.content);
      setEditingPassword('0000');
      return;
    }

    const password = prompt('비밀번호 4자리를 입력하세요');
    if (!password || password.length !== 4) return alert('비밀번호는 4자리여야 합니다.');

    try {
      const res = await axios.post(
        `http://localhost:8080/api/notices/${id}/comments/${comment.id}/verify`,
        { password }
      );

      if (res.data) {
        setEditingId(comment.id);
        setEditingContent(comment.content);
        setEditingPassword(password);
      } else {
        alert('비밀번호가 틀렸습니다.');
      }
    } catch {
      alert('비밀번호 확인 실패');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingContent('');
    setEditingPassword('');
  };

  const submitEdit = async (commentId) => {
    if (!editingContent.trim()) return alert('수정할 내용을 입력해주세요.');

    try {
      await axios.put(`http://localhost:8080/api/notices/${id}/comments/${commentId}`, {
        content: editingContent,
        password: editingPassword,
      });

      const res = await axios.get(`http://localhost:8080/api/notices/${id}/comments`);
      setComments(res.data);
      cancelEdit();
    } catch {
      alert('수정 실패');
    }
  };

  const handleNoticeEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/notices/${id}`, {
        title: editTitle,
        content: editContent,
      }, { withCredentials: true });

      setNotice({ ...notice, title: editTitle, content: editContent });
      setEditNoticeModalOpen(false);
      alert('수정이 완료되었습니다.');
    } catch {
      alert('공지 수정 실패');
    }
  };

  if (!notice) return <div>불러오는 중...</div>;

  return (
    <>
      <Header />
      <div className="notice-detail-wrapper">
        <div className="notice-detail-card">
          <h2>{notice.title}</h2>
          <div>{new Date(notice.createdAt).toLocaleDateString()}</div>
          <p className="notice-content">{notice.content}</p>

          {username === '관리자' && (
            <div className="notice-admin-buttons">
              <button onClick={() => {
                setEditTitle(notice.title);
                setEditContent(notice.content);
                setEditNoticeModalOpen(true);
              }}>공지 수정</button>

              <button
                className="delete-btn"
                onClick={async () => {
                  const confirmed = window.confirm('정말 삭제하시겠습니까?');
                  if (!confirmed) return;

                  try {
                    await axios.delete(`http://localhost:8080/api/notices/${id}`, { withCredentials: true });
                    alert('삭제되었습니다.');
                    window.location.href = '/notice';
                  } catch {
                    alert('삭제 실패');
                  }
                }}
              >공지 삭제</button>
            </div>
          )}

          <div className="comment-section">
            <h3>댓글</h3>
            {comments.map((c) => (
              <div key={c.id} className="comment-item">
                <strong>{c.nickname}</strong>
                <span>{new Date(c.createdAt).toLocaleString()}</span>

                {editingId === c.id ? (
                  <>
                    <textarea className="comment-edit-textarea" value={editingContent} onChange={(e) => setEditingContent(e.target.value)} />
                    <div className="comment-buttons">
                      <button onClick={() => submitEdit(c.id)}>저장</button>
                      <button onClick={cancelEdit}>취소</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p>{c.content}</p>
                    {(username === c.nickname || username === '관리자') && (
                      <div className="comment-buttons">
                        <button onClick={() => startEdit(c)}>수정</button>
                        <button onClick={() => handleDelete(c.id)}>삭제</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            <div className="comment-form">
              <textarea
                className="commentText"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={isLoggedIn ? '댓글 내용을 입력하세요' : '로그인 후 댓글 작성이 가능합니다'}
                disabled={!isLoggedIn && username.trim() === ''}
              />
              {username !== '관리자' && (
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="비밀번호 (4자리)"
                  maxLength={4}
                />
              )}
              <button onClick={handleSubmit} disabled={!newComment.trim()}>
                작성
              </button>
            </div>

            <div className="notice-back-link">
              <Link to="/notice">← 목록으로 돌아가기</Link>
            </div>
          </div>
        </div>
      </div>

      {/* 공지 수정 모달 */}
      <Modal
        isOpen={editNoticeModalOpen}
        onRequestClose={() => setEditNoticeModalOpen(false)}
        ariaHideApp={false}
        className="edit-notice-modal"
        overlayClassName="modal-overlay"
      >
        <h2>공지 수정</h2>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="제목"
        />
        <textarea
          rows={10}
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          placeholder="내용"
        />
        <div className="modal-buttons">
          <button onClick={handleNoticeEdit}>저장</button>
          <button onClick={() => setEditNoticeModalOpen(false)}>취소</button>
        </div>
      </Modal>
    </>
  );
};

export default NoticeDetailPage;
