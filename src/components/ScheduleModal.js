// src/components/ScheduleModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import '../css/ScheduleModal.css';
import moment from 'moment-timezone';


const ScheduleModal = ({ isOpen, onRequestClose, onSubmit, onDelete, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [color, setColor] = useState('#A0522D'); // 기본 색상 브라운

 
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      
      const startDate = moment(initialData.start).local().format('YYYY-MM-DDTHH:mm');
      const endDate = moment(initialData.end).local().format('YYYY-MM-DDTHH:mm');

    setStart(startDate);
    setEnd(endDate);
    } else {
      setTitle('');
      setDescription('');
      setStart('');
      setEnd('');
      setColor('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !start || !end) {
      alert('제목, 시작일, 종료일은 필수입니다.');
      return;
    }
    onSubmit({
      id: initialData?.id,
      title,
      description,
      start: new Date(start).toISOString(),  
      end: new Date(end).toISOString(),    
      color, 
    });

    
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="일정 등록"
      className="schedule-modal"
      overlayClassName="schedule-modal-overlay"
      ariaHideApp={false}
    >
      <h3>{initialData ? '일정 수정' : '일정 등록'}</h3>
      <form onSubmit={handleSubmit} className="schedule-form">
        <label>제목</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>시작</label>
        <input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required />

        <label>종료</label>
        <input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required />

        <label>설명</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        
        <label>색상선택</label><br/>
        <input 
          className="color-picker"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ width: '100px', height: '50px', border: 'none', background: 'none',marginLeft:'0px', paddingLeft:'0px' }}
        />
        

        <div className="modal-buttons">
          <button type="submit">{initialData ? '수정' : '등록'}</button>
          {initialData && (
            <button type="button" className="delete-btn" onClick={() => onDelete(initialData.id)}>삭제</button>
          )}
          <button type="button" className="cancel-btn" onClick={onRequestClose}>취소</button>
        </div>
      </form>
    </Modal>
  );
};

export default ScheduleModal;
