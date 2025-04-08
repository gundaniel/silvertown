import React, { useEffect, useState, useRef } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import '../css/DietModal.css';

const DietModal = ({ isOpen, onClose, onSubmit, onDelete, initialData, selectedDate }) => {
    const [menu, setMenu] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [origin, setOrigin] = useState('');
    const fileInputRef = useRef(null);

  
    useEffect(() => {
      if (initialData) {
        setMenu(initialData.menu || '');
        setPhotoUrl(initialData.photoUrl || '');
        setOrigin(initialData.origin || '');
      } else {
        setMenu('');
        setPhotoUrl('');
        setOrigin('');
      }
    }, [initialData]);
  
    const handleImageChange = async (e) => {
        e.preventDefault(); // 혹시 몰라서 방어적으로 추가
        const file = e.target.files[0];
        if (!file) return;
      
        const formData = new FormData();
        formData.append('file', file);
      
        try {
          const res = await axios.post('http://localhost:8080/api/diet/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          setPhotoUrl(res.data.url);
          fileInputRef.current.value = '';
        } catch (err) {
          console.error('업로드 에러:', err);
          alert('사진 업로드 실패');
        }
      };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (!menu) {
        alert('식단 내용을 입력해주세요.');
        return;
      }
  
      onSubmit({
        id: initialData?.id,
        date: selectedDate,
        menu,
        photoUrl,
        origin,
      });
    };
  
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="식단 등록"
      ariaHideApp={false}
      style={{
        content: {
          width: '400px',
          margin: 'auto',
          borderRadius: '10px',
          padding: '20px'
        }
      }}
    >
      <h3>{initialData ? '식단 수정' : '식단 등록'}</h3>
      <form onSubmit={handleSubmit} className="diet-modal-form"> 

        <label style={{ marginTop: '10px' }}>식단 내용</label>
        <textarea
          rows="6"
          value={menu}
          onChange={(e) => setMenu(e.target.value)}
          required
        />

        <label style={{ marginTop: '12px' }}>식단 사진</label>
        <div style={{ marginBottom: '10px' }}>
        {photoUrl ? (
            <img src={photoUrl} alt="미리보기"  className="diet-preview-image" />
        ) : (
            <label htmlFor="upload-btn" className="diet-upload-label" >
            📷 사진 업로드
            </label>
        )}
        <input id="upload-btn" type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} hidden/>
        </div>

        <div className="diet-modal-buttons">
          <button type="submit">{initialData ? '수정' : '등록'}</button>
          {initialData && (
            <button type="button" className="delete-btn" onClick={() => onDelete(initialData.id)} >
              삭제
            </button>
          )}
          <button type="button" className="cancel-btn" onClick={onClose}>취소</button>
        </div>
      </form>
    </Modal>
  );
};

export default DietModal;
