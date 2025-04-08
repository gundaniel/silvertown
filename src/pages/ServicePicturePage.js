import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import Header from '../components/Header';
import '../css/ServicePicturePage.css'; // CSS 파일 경로 확인!
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// 커스텀 화살표 컴포넌트
const PrevArrow = (props) => (
  <button className="custom-arrow prev" onClick={props.onClick}>
    ≪
  </button>
);

const NextArrow = (props) => (
  <button className="custom-arrow next" onClick={props.onClick}>
    ≫
  </button>
);

const DailySnapPage = () => {
  const [snaps, setSnaps] = useState([]);

  useEffect(() => {
    const fetchSnaps = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/snap');
        setSnaps(res.data);
      } catch {
        alert('일상 사진을 불러오는 데 실패했습니다.');
      }
    };

    fetchSnaps();
  }, []);

  const settings = {
    dots: false, // ✅ 점 제거
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  return (
    <>
      <Header />
      <div className="daily-snap-background">
        <div className="daily-snap-wrapper">
          <h2 className="daily-snap-title">📸 봉사활동사진</h2>

          <Slider {...settings} className="snap-slider">
            {snaps.map((snap) => (
              <div key={snap.id} className="snap-slide">
                <img
                  src={`http://localhost:8080${snap.imageUrl}`}
                  alt={snap.title}
                  className="snap-image"
                />
                <div className="snap-info">
                  <h3>{snap.title}</h3>
                  <p>{snap.description}</p>
                  <span>{new Date(snap.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </>
  );
};

export default DailySnapPage;
