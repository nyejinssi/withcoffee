import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';  // Import useNavigate
import { qnaList, infoList } from './MBTIdata';
import './qna.css';
import './mbti_result.css';

const MBTItest = () => {
  const [qIdx, setQIdx] = useState(0);
  const [mbtiSelect, setMbtiSelect] = useState([...Array(27)].map(() => 0));
  const navigate = useNavigate();

  const calResult = () => {
    var resultArray = mbtiSelect.indexOf(Math.max(...mbtiSelect));
    return resultArray;
  };

  const setResult = () => {
    const point = calResult();
    const resultName = document.querySelector('.resultName');
    resultName.innerHTML = infoList[point]?.name || '';

    const resultImg = document.createElement('img');
    const imgDiv = document.querySelector('#resultImage');
    const imgURL = require(`./img/image-${point}.jpg`);
    resultImg.src = imgURL;
    resultImg.alt = point;
    resultImg.classList.add('img-fluid');
    imgDiv.appendChild(resultImg);

    const resultFlavor = document.querySelector('.resultFlavor');
    resultFlavor.innerHTML = infoList[point]?.flavor?.join('<br/>') || '';

    const resultDesc = document.querySelector('.resultDesc');
    resultDesc.innerHTML = infoList[point]?.desc?.join('<br/>') || '';
  };

  const goResult = () => {
    const mbtiQna = document.querySelector('#mbti_qna');
    const mbtiResult = document.querySelector('#mbti_result');
    mbtiQna.style.WebkitAnimation = 'fadeOut 1s';
    mbtiQna.style.Animation = 'fadeOut 1s';

    setTimeout(() => {
      mbtiResult.style.WebkitAnimation = 'fadeIn 1s';
      mbtiResult.style.Animation = 'fadeIn 1s';
      setTimeout(() => {
        mbtiQna.style.display = 'none';
        mbtiResult.style.display = 'block';
      }, 450);
    });
    setResult();
  };

  const goNext = (idx) => {
    if (idx === qnaList.length) {
      goResult();
      return;
    }

    setQIdx(idx);

    const q = document.querySelector('.qBox');
    q.innerHTML = qnaList[idx].q;

    const status = document.querySelector('.statusBar');
    status.style.width = `${(100 / qnaList.length) * idx}%`;

    const qnaURL = './img/question/';
    const leftMbtiURL = require(`./img/question/${idx}-A.png`);
    const rightMbtiURL = require(`./img/question/${idx}-B.png`);

    const leftMbtiImage = document.querySelector('.leftMbtiImage');
    const rightMbtiImage = document.querySelector('.rightMbtiImage');

    leftMbtiImage.src = leftMbtiURL;
    rightMbtiImage.src = rightMbtiURL;

    leftMbtiImage.style.display = 'block';
    rightMbtiImage.style.display = 'block';

    leftMbtiImage.classList.remove('fadeOut');
    rightMbtiImage.classList.remove('fadeOut');

    leftMbtiImage.classList.add('fadeIn');
    rightMbtiImage.classList.add('fadeIn');

    leftMbtiImage.addEventListener('click', () => imageNext(idx, 0), false);
    rightMbtiImage.addEventListener('click', () => imageNext(idx, 1), false);
  };

  const imageNext = (qIdx, idx) => {
    const leftMbtiImage = document.querySelector('.leftMbtiImage');
    const rightMbtiImage = document.querySelector('.rightMbtiImage');

    leftMbtiImage.disabled = true;
    leftMbtiImage.classList.remove('fadeIn');
    leftMbtiImage.classList.add('fadeOut');

    rightMbtiImage.disabled = true;
    leftMbtiImage.classList.remove('fadeIn');
    rightMbtiImage.classList.add('fadeOut');

    setTimeout(() => {
      if (qIdx + 1 === qnaList.length) {
        goResult();
        return;
      } else {
        setTimeout(() => {
          const target = qnaList[qIdx].a[idx].type;
          for (let i = 0; i < target.length; i++) {
            mbtiSelect[target[i]] += 1;
          }

          leftMbtiImage.style.display = 'none';
          rightMbtiImage.style.display = 'none';
          goNext(qIdx + 1);
        }, 450);
      }
    }, 450);
  };

  const begin = () => {
    const mbtiMain = document.querySelector('#mbti_main');
    const mbtiQna = document.querySelector('#mbti_qna');
    mbtiMain.style.WebkitAnimation = 'fadeOut 1s';
    mbtiMain.style.Animation = 'fadeOut 1s';

    setTimeout(() => {
      mbtiQna.style.WebkitAnimation = 'fadeIn 1s';
      mbtiQna.style.Animation = 'fadeIn 1s';
      setTimeout(() => {
        mbtiMain.style.display = 'none';
        mbtiQna.style.display = 'block';
      }, 450);
      goNext(0);
    }, 450);
  };

  // 컴포넌트가 마운트되면 자동으로 시작
  useEffect(() => {
    begin();
  }, []);

  return (
    <>
      <div className="container pb-5 mx-auto" style={{ marginTop: '15%', backgroundColor:'black'}}>
        <section id="mbti_main" className="mx-auto">
          <div>문제를 로딩중입니다 . . .</div>
        </section>
        <section id="mbti_qna">
          <div className="status mx-auto mt-8">
            <div className="statusBar" />
          </div>
          <div className="qBox my-5 py-3 mx-auto" style={{ marginTop: '5%' }}/>
          <div className="answerBox mx-auto" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="row" style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="col" style={{ margin: '10px' }}>
                <div className="card">
                  <img
                    src="./img/question/0-A.png"
                    className="card-img-top leftMbtiImage"
                    alt="..."
                    style={{ maxWidth: '100%', height: 'auto', border:'1px solid white' }}
                  />
                </div>
              </div>
              <div className="col" style={{ margin: '10px' }}>
                <div className="card">
                  <img
                    src="./img/question/0-B.png"
                    className="card-img-top rightMbtiImage"
                    alt="..."
                    style={{ maxWidth: '100%', height: 'auto', border:'1px solid white'}}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="mbti_result">
          <div>당신의 커피 취향</div>
          <div className="resultName" style={{color:'white'}}></div>
          <div
            id="resultImage"
            style={{ float: 'right'}}
          ></div>
          <div
            className="resultFlavor"
            style={{ float: 'left', marginBottom: 50, color:'white' }}
          ></div>
          <div
            className="resultDesc"
            style={{color:'white'}}
          ></div>
          <Link to={infoList[calResult()]?.link || '/default-link'}>
            <button style={{ marginTop: '20px' }}>구매하러 가기</button>
          </Link>
        </section>
      </div>
    </>
  );
};

export default MBTItest;
