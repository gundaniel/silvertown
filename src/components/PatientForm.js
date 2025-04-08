import React, { useState } from 'react';
import axios from 'axios';

const PatientForm = () => {
  const [patient, setPatient] = useState({
    name: '',
    age: '',
    disease: '',
    guardianName: '',
    guardianPhone: '',
    memo: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8080/api/patients', patient)
      .then(() => {
        alert('환자 등록 완료!');
        setPatient({
          name: '',
          age: '',
          disease: '',
          guardianName: '',
          guardianPhone: '',
          memo: '',
        });
      })
      .catch((error) => {
        console.error('등록 실패:', error);
        alert('등록에 실패했습니다.');
      });
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>📝 환자 등록</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="이름" value={patient.name} onChange={handleChange} required /><br /><br />
        <input name="age" type="number" placeholder="나이" value={patient.age} onChange={handleChange} required /><br /><br />
        <input name="disease" placeholder="질병 정보" value={patient.disease} onChange={handleChange} /><br /><br />
        <input name="guardianName" placeholder="보호자 이름" value={patient.guardianName} onChange={handleChange} required /><br /><br />
        <input name="guardianPhone" placeholder="보호자 연락처" value={patient.guardianPhone} onChange={handleChange} required /><br /><br />
        <textarea name="memo" placeholder="메모" value={patient.memo} onChange={handleChange} rows={3} /><br /><br />
        <button type="submit">등록하기</button>
      </form>
    </div>
  );
};

export default PatientForm;
