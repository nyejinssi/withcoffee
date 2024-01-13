import React, { useState } from 'react';
import Link from 'react-dom/client';
import {qnaList, infoList} from './MBTIdata';
import './qna.css';
import './mbti_result.css';

const MBTItest = () => {
  const [qIdx, setQIdx] = useState(0);
  const [mbtiSelect, setMbtiSelect] = useState([...Array(27)].map(() => 0));

  const calResult = () => {
    var resultArray = mbtiSelect.indexOf(Math.max(...mbtiSelect));
    return resultArray;
}

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
      }
      else {
        setTimeout(() => {
          const target = qnaList[qIdx].a[idx].type;
          for(let i = 0; i < target.length; i++){
            mbtiSelect[target[i]] += 1;
            } //select에 answer 받은 값 넣기. ex) select[0] = espresso(1번째 버튼)
  
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

  return (
    <>
      <div className="container pb-5 mx-auto" style={{marginTop:"15%"}}>
        <section id="mbti_main" className="mx-auto">
          <h3 className="p-5">'내가 좋아하는 원두'를 잘 모르겠는 당신!</h3>
          <h3 className="pt-2 pb-5" style={{ textAlign: 'end' }}>
            그리고 새로운 원두를 도전해보고 싶은 당신!
          </h3>
          <br/>
          <h3 className="pb-5" style={{ textAlign: 'center' }}>
            '나의 커피 취향'이 궁금한 당신을 위한
          </h3>
          
          <h1 >커피 MBTI</h1>
          <button
            type="button"
            className="btn btn-secondary btn-lg"
            onClick={begin}
          >
            시작하기
          </button>
        </section>
        <section id="mbti_qna">
          <div className="status mx-auto mt-8">
            <div className="statusBar" />
          </div>
          <div className="qBox my-5 py-3 mx-auto"  />
          <div className="answerBox mx-auto">
            <div className="row row-cols-1 row-cols-md-2 g-2">
              <div className="col">
                <div className="card">
                  <img
                    src="./img/question/0-A.png"
                    className="card-img-top leftMbtiImage"
                    alt="..."
                  />
                </div>
              </div>
              <div className="col">
                <div className="card">
                  <img
                    src="./img/question/0-B.png"
                    className="card-img-top rightMbtiImage"
                    alt="..."
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="mbti_result">
          <div
          >
            당신의 커피 취향
          </div>
          <div
            className="resultName"
            
          ></div>
          <div
            id="resultImage"
            className="col-3 mx auto"
            style={{ float: 'right'}}
          ></div>
          <div
            className="resultFlavor"
            style={{ float: 'left', width: 515, marginBottom: 50 }}
          ></div>
          <div
            className="resultDesc"
            style={{
            }}
          ></div>
          <button type="button" className="btn btn-secondary btn-lg buyMBTI" >
            구매하러 가기
          </button>
        </section>
      </div>
    </>
  );
}

export default MBTItest;