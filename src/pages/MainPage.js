import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ 이미 있음
import fullpage from 'fullpage.js';
import mainImage from '../images/hero.jpg';
import main2Image from '../images/main2.jpg';
import main3Image from '../images/main3.jpg';
import '../css/MainPage.css';
import 'fullpage.js/dist/fullpage.min.css';
import Header from '../components/Header';
import ContactForm from '../components/ContactForm';
import axios from 'axios';

const MainPage = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [mainCategory, setMainCategory] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', content: '', category: '' });
  const [agree, setAgree] = useState(false);

  useEffect(() => {
    new fullpage('#fullpage', {
        licenseKey: 'gplv3-license',
        autoScrolling: true,
        scrollOverflow : true,
        navigation: true,
        scrollingSpeed: 800,
        anchors: ['main-section', 'service-section', 'contact-section'],
        navigationTooltips: ['Main', 'Service', 'Contact'],
        showActiveTooltip: true,
    });

    return () => {
        if (window.fullpage_api) {
          window.fullpage_api.destroy('all');
        }
      };
    }, []);


    const openModal = (category) => {
      setMainCategory(category);
      setForm({ name: '', phone: '', content: '', category: category === '입주상담' ? '입주상담' : '요금문의' });
      setAgree(false);
      setShowModal(true);
    };

    const handleSubmit = async () => {
      if (!form.name || !form.phone || !form.content || !agree) {
        alert('모든 항목을 입력하고 동의해야 합니다.');
        return;
      }
  
      try {
        await axios.post('http://localhost:8080/api/admin/qna', {
          ...form,
          agreePrivacy: agree,
        });
        alert('상담 신청이 완료되었습니다.');
        setShowModal(false);
      } catch (err) {
        alert('전송에 실패했습니다.');
      }
    };


    useEffect(() => {
        const contactSection = document.getElementById('Contact');
        const footer = document.querySelector('.footer-slide-up');
      
        if (!contactSection || !footer) return;
      
        const handleMouseMove = (e) => {
          const rect = contactSection.getBoundingClientRect();
          const threshold = 100; // 하단 100px 이내 진입 시
      
          if (e.clientY > window.innerHeight - threshold && rect.top < window.innerHeight && rect.bottom > 0) {
            footer.classList.add('show');
          } else {
            footer.classList.remove('show');
          }
        };
      
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
          window.removeEventListener('mousemove', handleMouseMove);
        };
      }, []);
      

  return (
    <>
      <Header />
      <div id="fullpage">
        <div
          className="section main-section" id="Main" data-anchor="main-section"
          style={{
            backgroundImage: `url(${mainImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="hero-overlay">
            <h1>THE BEST CHOICE FOR SENIOR</h1>
            <p className="mainP">어르신들이 행복한 삶을 영위할 수 있도록 돕겠습니다.</p>
            <button onClick={() => navigate('/town/daily')}>사진보기 →</button>
          </div>
        </div>
 
        <div className="section section2" id="Service" data-anchor="service-section"
        style={{
            backgroundImage: `url(${main2Image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1,
          }}
          >
             <div className="card-section-wrapper">
          <h2>주요 서비스 안내</h2>
          <div className="card-container">
            <div className="service-card">
                <div className="vertical-label">NURSING HOME</div>
                    <img src={require('../images/nursing.jpg')} alt="요양센터" />
                    <div className="card-text">
                    <h3>요양센터</h3>
                    <p>전문적인 간호 서비스로 어르신의 삶을 따뜻하게 보살핍니다.</p>
                </div>
            </div>
            <div className="service-card">
            <div className="vertical-label">MEDICAL HOME</div>
              <img src={require('../images/medical.jpg')} alt="의료센터" />
              <div className="card-text">
              <h3>의료센터</h3>
              <p>상시 진료 가능한 의료진과 장비로 건강을 관리해드립니다.</p>
            </div>
            </div>
            <div className="service-card">
            <div className="vertical-label">CULTURE HOME</div>
              <img src={require('../images/culture.jpg')} alt="문화센터" />
              <div className="card-text">
              <h3>문화센터</h3>
              <p>다양한 문화활동과 프로그램으로 삶에 활력을 더합니다.</p>
            </div>
          </div>
          </div>
          </div>
        </div>

        <div className="section section3" id="Contact" data-anchor="contact-section"
        style={{
            backgroundImage: `url(${main3Image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1,
          }}>
        <ContactForm onOpenModal ={openModal}/>
        </div>
    </div>
        <footer className="footer-slide-up">
            <p>© 2025 GiGcompany. All rights reserved.</p>
            <p>경기도 성남시 분당구 실버로 777</p>
        </footer>
        {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{mainCategory} 신청</h3>
            <input name="name" placeholder="이름" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input name="phone" placeholder="전화번호" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            {mainCategory === '기타상담' && (
              <select name="category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                <option value="요금문의">요금문의</option>
                <option value="서비스문의">서비스문의</option>
                <option value="기타">기타</option>
              </select>
            )}
            <textarea
              name="content"
              placeholder="문의 내용을 입력해주세요"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
              <label className="checkbox-label">
                <input type="checkbox" className="checkbox"checked={agree} onChange={(e) => setAgree(e.target.checked)} /><span>개인정보 제공에 동의합니다</span>
              </label>
            <button onClick={handleSubmit}>상담 신청</button>
          </div>
        </div>
      )}
    </>
  );
};

export default MainPage;
