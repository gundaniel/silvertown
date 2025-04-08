import React, {useEffect, useState, useRef } from 'react';
import axios from 'axios';
import DietModal from '../components/DietModal';
import Header from '../components/Header';
import '../css/DietCalendarPage.css';
import html2canvas from 'html2canvas'; 
import jsPDF from 'jspdf';


const DietCalendarPage = () => {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [diets, setDiets] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDiet, setSelectedDiet] = useState(null);

  const handleYearChange = (e) => setSelectedYear(Number(e.target.value));
  const handleMonthChange = (e) => setSelectedMonth(Number(e.target.value));
  const handleWeekChange = (week) => setSelectedWeek(week);

  const printRef = useRef();

  const openPreview = (photoUrl) => setPreviewImage(photoUrl);
  const closePreview = () => setPreviewImage(null);

  const fileInputRef = useRef(null);
  
  const getDaysOfSelectedWeek = () => {
    const firstDay = new Date(selectedYear, selectedMonth - 1, 1);
    const dayOfWeek = firstDay.getDay();
    const offset = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
    const startDay = new Date(firstDay);
    startDay.setDate(startDay.getDate() + offset + (selectedWeek - 1) * 7);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDay);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const fetchDiets = async () => {
    const days = getDaysOfSelectedWeek();
    if (days.length === 0) return;
  
    const start = days[0].toISOString().slice(0, 10);
    const end = days[days.length - 1].toISOString().slice(0, 10);
  
    try {
      const res = await axios.get(`http://localhost:8080/api/diet/range?start=${start}&end=${end}`);
      console.log("🔍 응답 전체:", res);
      console.log("📦 받아온 diet 데이터:", res.data);
      
      
      setDiets(res.data);
      res.data.forEach((d, i) => {
        console.log(`${i}번째 식단 date 값:`, d.date);
      });
  
      setDiets(res.data);
    } catch {
      alert('식단 불러오기 실패');
    }
  };

  useEffect(() => {
    fetchDiets();
  }, [selectedYear, selectedMonth, selectedWeek]);

  const days = getDaysOfSelectedWeek();

  const findDietByDate = (dateStr) => {
    return diets.find((d) => {
      const dDate = new Date(d.date);
      const formatted = dDate.toISOString().slice(0, 10);
      return formatted === dateStr;
      
    });
  };
  

  const openModal = (dateObj, diet) => {
    const dateStr = dateObj.toISOString().slice(0, 10);
    setSelectedDate(dateStr);
    setSelectedDiet(diet || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedDiet(null);
    setSelectedDate(null);
  };

  const handleSubmit = async (dietData) => {
    try {
      if (dietData.id) {
        await axios.put(`http://localhost:8080/api/diet/${dietData.id}`, dietData);
        alert('식단이 수정되었습니다.');
      } else {
        await axios.post('http://localhost:8080/api/diet', dietData);
        alert('식단이 등록되었습니다.');
      }
      fetchDiets();
      closeModal();
      fileInputRef.current.value = '';
    } catch {
      alert('저장 실패');
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8080/api/diet/${id}`);
      alert('식단이 삭제되었습니다.');
      fetchDiets();
      closeModal();
    } catch {
      alert('삭제 실패');
    }
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;

    const canvas = await html2canvas(printRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();   // 보통 210mm
    const pdfHeight = pdf.internal.pageSize.getHeight(); // 보통 297mm

    const marginX = 10;
    const marginY = 10;
    const availableWidth = pdfWidth - marginX * 2;
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * availableWidth) / imgProps.width;

    //높이 초과 방지
    const finalHeight = imgHeight > pdfHeight - marginY * 2 ? pdfHeight - marginY * 2 : imgHeight;


    pdf.addImage(imgData, 'PNG', marginX, marginY, availableWidth, finalHeight);
    pdf.save(`식단표_${selectedYear}-${selectedMonth}_${selectedWeek}주차.pdf`);
  };

  return (
    <>
      <Header />
      <div className='diet-wrapper'>
        <div className="diet-calendar-container">
          <div className="diet-title-row">
              <h2 className="diet-calendar-title">🍽 식단표</h2>
              <button onClick={handleDownloadPDF} className="pdf-download-btn">📄 식단표 PDF 저장</button>
            </div>

            <div className="diet-calendar-selects">
              <select value={selectedYear} onChange={handleYearChange}>
                {[2023, 2024, 2025].map(y => <option key={y} value={y}>{y}년</option>)}
              </select>
              <select value={selectedMonth} onChange={handleMonthChange}>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}월</option>
                ))}
              </select>
            </div>

            <div className="diet-calendar-week-buttons">
              {[1, 2, 3, 4, 5].map(week => (
                <button
                  key={week}
                  onClick={() => handleWeekChange(week)}
                  className={`week-button ${selectedWeek === week ? 'active' : ''}`}
                >
                  {week}주차
                </button>
              ))}
            </div>
            
            <div ref={printRef}>
              <h3 style={{ textAlign: 'center', marginTop: '20px' }}>SILVERTOWN 식단표</h3>
              <p style={{ textAlign: 'center', marginBottom: '20px' }}>
                {selectedYear}년 {selectedMonth}월 {selectedWeek}주차
              </p>
            <div className="diet-day-cards">
              {days.map((day, i) => {
                const dateStr = day.toISOString().slice(0, 10);
                const diet = findDietByDate(dateStr);

                return (
                  <div
                    key={i}
                    onClick={() => openModal(day, diet)}
                    className="diet-day-card"
                  >
                    <strong>{day.toLocaleDateString('ko-KR', { weekday: 'short' })}</strong><br />
                    <span>{dateStr}</span>
                    <div className={`diet-menu ${diet ? '' : 'empty'}`}>
                      {diet ? diet.menu : '식단 정보 없음'}
                    </div>
                    {diet?.origin && (
                    <div style={{ marginTop: '6px', fontSize: '12px', color: '#666', whiteSpace: 'pre-line' }}>
                      <strong>원산지:</strong><br />{diet.origin}
                    </div>
                  )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <DietModal
          isOpen={modalOpen}
          onClose={closeModal}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          initialData={selectedDiet}
          selectedDate={selectedDate}
        />
      </div>
    </>
  );
};

export default DietCalendarPage;
