import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Masonry from 'react-masonry-css';
import '../css/UserDailySnapPage.css';
import Header from '../components/Header';

const UserDailySnapPage = () => {
  const [snaps, setSnaps] = useState([]);
  const [modalSnap, setModalSnap] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/town/daily')
      .then((res) => setSnaps(res.data))
      .catch(() => alert('일상 사진을 불러오지 못했습니다.'));
  }, []);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <>
          <Header />
    <div className="user-daily-bg">
      <div className="user-daily-wrapper">
        <h2>📷 일상 스냅</h2>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {snaps.map((snap) => (
            <div key={snap.id} className="snap-card" onClick={() => setModalSnap(snap)}>
              <img src={`http://localhost:8080${snap.photoUrl}`} alt={snap.title} />
              <div className="snap-card-info">
                <h4>{snap.title}</h4>
                <p>{snap.content}</p>
              </div>
            </div>
          ))}
        </Masonry>

        {modalSnap && (
          <div className="modal-backdrop" onClick={() => setModalSnap(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <img src={`http://localhost:8080${modalSnap.photoUrl}`} alt={modalSnap.title} />
              <h3>{modalSnap.title}</h3>
              <p>{modalSnap.content}</p>
              <button onClick={() => setModalSnap(null)}>닫기</button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default UserDailySnapPage;
