import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer,Views } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../css/SchedulePage.css';
import ScheduleModal from '../components/ScheduleModal';
import Header from '../components/Header';
import 'moment/locale/ko'; 
moment.locale('ko');     


const localizer = momentLocalizer(moment);

const SchedulePage = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false); // 관리자 여부
  const [calendarView, setCalendarView] = useState('month');
const [calendarDate, setCalendarDate] = useState(new Date());


  useEffect(() => {
    fetchEvents();
    checkAdmin();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/admin/schedule');
      const formatted = res.data.map(e => ({
        id: e.id,
        title: e.title,
        start: new Date(e.start),
        end: new Date(e.end),
        description: e.description,
        color: e.color || '#A0522D',
      }));
      console.log(formatted); // 🔥 여기서 색상 정보가 정상적으로 포함되어 있는지 확인
      setEvents(formatted);
    } catch {
      alert('일정 불러오기 실패');
    }
  };

  const checkAdmin = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/admin/check', {
        withCredentials: true,
      });
      setIsAdmin(res.data === true);
    } catch {
      setIsAdmin(false);
    }
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  const handleSlotSelect = ({ start, end }) => {
    if (isAdmin) {
      openModal({ start, end });
    }
  };

  const handleEventSelect = (event) => {
    if (isAdmin) {
      openModal(event);
    }
  };

  const handleViewChange = (view) => {
    setCalendarView(view);
  };
  
  const handleNavigate = (date) => {
    setCalendarDate(date);
  };
  

  const handleSubmit = async (eventData) => {
    try {
        if (eventData.id) {
            await axios.put(`http://localhost:8080/api/admin/schedule/${eventData.id}`, eventData);
            alert('일정이 수정되었습니다.');
          } else {
            await axios.post(`http://localhost:8080/api/admin/schedule`, eventData);
            alert('일정이 등록되었습니다.');
          }
      
          fetchEvents();
          closeModal(); // 🔥 모달 닫기
        } catch {
          alert('일정 저장 실패');
        }
      };

  const handleDelete = async (eventId) => {
    const confirm = window.confirm('이 일정을 삭제하시겠습니까?');
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:8080/api/admin/schedule/${eventId}`);
      fetchEvents();
    } catch {
      alert('삭제 실패');
    }
  };

  return (
    <>
      <Header />
    <div className="schedule-page">
    <div className="schedule-card">
      <h2>프로그램 일정</h2>

      {isAdmin && (
        <button className="add-schedule-btn" onClick={() => openModal(null)}>
          + 일정 추가
        </button>
      )}

      <Calendar
        localizer={localizer}
        events={events}
        selectable={isAdmin}
        onSelectSlot={handleSlotSelect}
        onSelectEvent={handleEventSelect}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        view={calendarView}                // ✅ 현재 뷰 상태
        onView={handleViewChange}          // ✅ 뷰 변경 핸들러
        date={calendarDate}                // ✅ 현재 날짜 상태
        onNavigate={handleNavigate} 
        views={['month', 'week', 'day', 'agenda']}
        messages={{
            date: '날짜',
            time: '시간',
            event: '일정',
            allDay: '하루종일',
            week: '주',
            work_week: '업무 주',
            day: '일',
            month: '월',
            previous: '이전',
            next: '다음',
            yesterday: '어제',
            tomorrow: '내일',
            today: '오늘',
            agenda: '일정목록',
            noEventsInRange: '해당 기간에는 일정이 없습니다.',
            showMore: (total) => `+ ${total}개 더보기`,
          }}   
          
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: event.color || '#A0522D',
              color: '#fff',
              borderRadius: '5px',
              padding: '2px 5px',
            },
          })}
      />

      {modalOpen && (
        <ScheduleModal
          isOpen={modalOpen}
          onRequestClose={closeModal}
          onSubmit={handleSubmit}
          onDelete={handleDelete}
          initialData={selectedEvent}
        />
      )}
    </div>
    </div>
    </>
  );
};

export default SchedulePage;
