import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';  // Import useNavigate
import { qnaList, infoList } from './MBTIdata';
import './qna.css';
import './mbti_result.css';

const MBTItest = () => {
  const [qIdx, setQIdx] = useState(0);
  const [mbtiSelect, setMbtiSelect] = useState(Array(27).fill(0));
  const navigate = useNavigate();

  const calResult = () => {
    var resultArray = mbtiSelect.indexOf(Math.max(...mbtiSelect));
    return resultArray;
  };

  const setResult = () => {
    const point = calResult();
    const resultName = document.querySelector('.resultName');
    resultName.innerHTML = infoList[point]?.name || '';

    const resultFlavor = document.querySelector('.resultFlavor');
    resultFlavor.innerHTML = infoList[point]?.flavor?.join('<br/>') || '';

    const resultDesc = document.querySelector('.resultDesc');
    resultDesc.innerHTML = infoList[point]?.desc?.join('<br/>') || '';
  };

  const goResult = () => {
    const mbtiQna = document.querySelector('#mbti_qna');
    const mbtiResult = document.querySelector('#mbti_result');

    setTimeout(() => {
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

    // leftMbtiImage.classList.remove('fadeOut');
    // rightMbtiImage.classList.remove('fadeOut');

    // leftMbtiImage.classList.add('fadeIn');
    // rightMbtiImage.classList.add('fadeIn');

    leftMbtiImage.addEventListener('click', () => imageNext(idx, 0), false);
    rightMbtiImage.addEventListener('click', () => imageNext(idx, 1), false);
  };

  const imageNext = (qIdx, idx) => {
    const leftMbtiImage = document.querySelector('.leftMbtiImage');
    const rightMbtiImage = document.querySelector('.rightMbtiImage');

    leftMbtiImage.disabled = true;
    rightMbtiImage.disabled = true;

    setTimeout(() => {
      if (qIdx + 1 === qnaList.length) {
        goResult();
        return;
      } else {
        setTimeout(() => {
          const target = qnaList[qIdx].a[idx].type;
          target.forEach((i) => {
            mbtiSelect[i] += 1;
          });

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

    setTimeout(() => {
      setTimeout(() => {
        mbtiMain.style.display = 'none';
        mbtiQna.style.display = 'block';
      }, 450);
      goNext(0);
    }, 450);
  };

  useEffect(() => {
    begin();
  }, []);

  return (
    <>
      <div className="container mx-auto" style={{backgroundColor:'black'}}>
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
          <div className="resultName" style={{color:'white'}}>당신의 커피 취향: </div>
          {/* <div className="resultName" style={{color:'white'}}></div> */}
          <div
            className="resultDesc"
            style={{color:'white'}}
          ></div>
          <div
            className="resultFlavor"
            style={{ float: 'left', color:'white' }}
          ></div>
          <Link to={infoList[calResult()]?.link || '/default-link'}>
            <button className="mbtiBuyButton" style={{ marginTop: '20px' }}>구매하러 가기</button>
          </Link>
        </section>
      </div>
    </>
  );
};

export default MBTItest;