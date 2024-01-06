import React from 'react';
import ReactDOM from'react-dom';
import { Link } from 'react-router-dom';

const Done = () => {
    return (
        <>
      <div style={{ display: "grid", justifyItems: "center", marginTop: "15%" }}>
        <h1 style={{ fontWeight: 600 }}>상품이 정상적으로 주문되었습니다.</h1>
        <h2>감사합니다.</h2>
      </div>
      <Link to="/MyPage/Home/*">
        <button
          className="btn btn-primary btn-lg"
          type="button"
          style={{
            background: "#0071E3",
            border: "1px solid #F1F1F1",
            borderRadius: 14,
            textDecoration: "none",
            right: "10%",
            marginTop: "5%",
            position: "fixed"
          }}
        >
          계속 쇼핑하기
        </button>
      </Link>
      {/*홈페이지 링크 연결*/}
    </>

    );
};

export default Done;