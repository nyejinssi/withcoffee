import React from 'react';
import { Link } from 'react-router-dom';
import MBTIbackground from './coffeembti.png';
import './Home.css';

const Main = () => {
  return (
    <div style={{ position: 'relative', textAlign: 'center' }}>
      <img src={MBTIbackground} alt="Example" style={{ maxWidth: '100%', height: 'auto' }} />
      <div
        id="mbti_box"
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <Link to="/MBTI/MBTItest" style={{ textDecoration: 'none' }}>
          <button style={{ backgroundColor: '#ffffff', color: '#000000', padding: '10px 20px', border: 'none' }}>
            커피 MBTI
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Main;
