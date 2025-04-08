import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientList = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/patients')
      .then(response => {
        setPatients(response.data);
      })
      .catch(error => {
        console.error('데이터 불러오기 실패:', error);
      });
  }, []);

  return (
    <div>
      <h2>📋 환자 목록</h2>
      <ul>
        {patients.map(patient => (
          <li key={patient.id}>
            {patient.name} ({patient.age}세) - 보호자: {patient.guardianName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientList;
