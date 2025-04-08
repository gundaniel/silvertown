import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../css/AdminDailyUploadPage.css';
import Header from '../components/Header';

const AdminDailyUploadPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [photos, setPhotos] = useState([]); 
  const [editingItem, setEditingItem] = useState(null); // 수정 대상
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const fileInputRef = useRef(null); 


  const fetchPhotos = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/town/daily');
      setPhotos(res.data);
    } catch (err) {
      console.error('사진 목록 불러오기 실패', err);
    }
  };

  useEffect(() => {
    fetchPhotos(); // 페이지 처음 로딩 시
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !content) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('content', content);

    try {
      await axios.post('http://localhost:8080/api/town/daily/upload', formData);
      alert('업로드 성공!');
      setTitle('');
      setContent('');
      setFile(null);
      setPreview(null);
      fileInputRef.current.value = '';
      fetchPhotos(); 
    } catch (err) {
      alert('업로드 실패');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
  
    try {
      await axios.delete(`http://localhost:8080/api/town/daily/${id}`);
      alert('삭제 완료!');
      fetchPhotos(); // 목록 다시 불러오기
    } catch (err) {
      alert('삭제 실패');
    }
  };
  
  const handleEdit = (item) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditContent(item.content);
  };
  
  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8080/api/town/daily/${editingItem.id}`, {
        title: editTitle,
        content: editContent
      });
      alert('수정 완료!');
      setEditingItem(null);
      fetchPhotos(); // 리스트 다시 불러오기
    } catch (err) {
      alert('수정 실패');
    }
  };
  

  return (
    <>
      <Header />
      <div className="daily-upload-container">
        <div className="daily-upload-bg">
          <form className="daily-upload-form" onSubmit={handleSubmit}>
            <h2>📷 일상 스냅 업로드</h2>
            <input
              type="text"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <input type="file" accept="image/*" onChange={handleFileChange}  />
            {preview && <img src={preview} alt="preview" className="image-preview" />}
            <button type="submit">등록하기</button>
          </form>

          <div className="uploaded-photo-list">
          {photos.map((item) => (
            <div key={item.id} className="photo-card">
              <img src={`http://localhost:8080${item.photoUrl}`} alt={item.title} />
              <div className="photo-info">
                <div className="photo-title">{item.title}</div>

                <div className="photo-actions">
                  <button onClick={() => handleEdit(item)} className="edit-btn">수정</button>
                  <button onClick={() => handleDelete(item.id)} className="delete-btn">삭제</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
          {editingItem && (
      <div className="edit-modal-backdrop" onClick={() => setEditingItem(null)}>
        <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
          <h3>📄 게시물 수정</h3>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="제목"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="내용"
          />
          <div className="edit-modal-actions">
            <button onClick={handleUpdate} className="edit-btn">저장</button>
            <button onClick={() => setEditingItem(null)} className="delete-btn">취소</button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default AdminDailyUploadPage;
