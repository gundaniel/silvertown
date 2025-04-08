import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import '../css/AdminServicePicture.css';

const AdminDailySnapUploadPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [snaps, setSnaps] = useState([]);
  const [editingId, setEditingId] = useState(null); // 수정 중인 스냅 ID
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !date) {
      alert('제목, 설명, 날짜는 필수입니다.');
      return;
    }

    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('date', date);

    try {
      // 수정인 경우 기존 항목 삭제 후 다시 업로드
      if (editingId) {
        await axios.delete(`http://localhost:8080/api/snap/${editingId}`);
      }

      await axios.post('http://localhost:8080/api/snap/daily/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });

      alert(editingId ? '수정 완료!' : '업로드 완료!');
      resetForm();
      fetchSnaps();
      fileInputRef.current.value = '';
    } catch (err) {
      alert('업로드 실패');
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setFile(null);
    setPreviewUrl('');
    setEditingId(null);
  };

  const fetchSnaps = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/snap');
      setSnaps(res.data);
    } catch (err) {
      console.error('스냅 불러오기 실패', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:8080/api/snap/${id}`);
        fetchSnaps();
      } catch (err) {
        alert('삭제 실패');
      }
    }
  };

  const handleEdit = (snap) => {
    setTitle(snap.title);
    setDescription(snap.description);
    setDate(snap.createdAt.slice(0, 10)); // yyyy-mm-dd
    setEditingId(snap.id);
    setPreviewUrl(`http://localhost:8080${snap.imageUrl}`);
    setFile(null); // 새 파일 선택 시 덮어쓰기
  };

  useEffect(() => {
    fetchSnaps(); 
  }, []);

  return (
    <>
      <Header />
      <div className="admin-upload-container">
        <h2>{editingId ? '봉사/행사 사진 수정' : '📤 봉사/행사 사진 업로드'}</h2>
        <form onSubmit={handleSubmit} className="upload-form">
          <label>제목</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>설명</label>
          <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} required />

          <label>날짜</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

          <label>사진 선택</label>
          <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef}/>

          {previewUrl && <img src={previewUrl} alt="미리보기" className="preview-image" />}

          <button type="submit" className="upload-btn">{editingId ? '수정' : '업로드'}</button>
          {editingId && <button type="button" className="cancel-btn" onClick={resetForm}>취소</button>}
        </form>

        <div className="snap-list">
          <h3>📸 등록된 사진</h3>
          <div className="snap-grid">
            {snaps.map((snap) => (
              <div key={snap.id} className="snap-card">
                <img src={`http://localhost:8080${snap.imageUrl}`} alt={snap.title} className="snap-image" />
                <h4>{snap.title}</h4>
                <p>{snap.description}</p>
                <span>{new Date(snap.createdAt).toLocaleDateString()}</span>
                <div className="btn-group">
                  <button onClick={() => handleEdit(snap)} className="edit-btn">수정</button>
                  <button onClick={() => handleDelete(snap.id)} className="delete-btn">삭제</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDailySnapUploadPage;
