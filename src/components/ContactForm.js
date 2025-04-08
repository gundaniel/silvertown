import React from 'react';
import '../css/ContactForm.css';

const ContactForm = ({ onOpenModal }) => {
  return (
    <div className="section3-overlay">
      <div className="section3-left">
        <span className="section3-number">01</span>
        <img src={require('../images/room1.jpg')} alt="객실" />
        <h3>SENIOR TOWN</h3>
        <p>여유와 품격이 함께하는 풍요로운 생활</p>
        <div className="side-button side-button-left">
          <button onClick={() => onOpenModal('입주상담')}>입주상담</button>
        </div>
      </div>

      <div className="section3-right">
        <h2>C O U N S E L O R</h2>
        <p>
          따뜻한 마음을 담은<br />
          세심한 상담
        </p>
        <div className="side-button side-button-right">
          <button onClick={() => onOpenModal('기타상담')}>기타상담</button>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
