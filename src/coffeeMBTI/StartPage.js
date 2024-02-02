// Main.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import start from './start.png';

const Main = () => {
    const navigate = useNavigate(); 
    const buttonClick = () => {
        navigate('/MBTI/Question');
    };

    return (
        <div style={{ 
            fontFamily: 'Pretendard-Regular', 
            backgroundColor: 'black',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh'
        }}>
          <img src={start} alt={"커피 이미지"} style={{width:'40%'}}/>
            <div style={{ 
                color: 'white',
                padding: '20px',
                textAlign: 'center',
                borderRadius: '8px',
                marginBottom: '30px' // 여기에 margin-bottom 추가
            }}>
                당신의 커피 취향은 무엇인가요? <br/>당신에게 어울리는 원두를 찾아보세요!
            </div>
            <button 
                onClick={buttonClick} 
                style={{
                    marginTop: '20px',
                    padding: '10px',
                    width: '25%',
                    backgroundColor: 'white',
                    color: 'black',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',marginBottom: '100px'
                }}
            > 
                시작하기 
            </button>
        </div>
    );
};

export default Main;
