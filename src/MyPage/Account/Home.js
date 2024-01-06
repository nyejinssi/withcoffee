import React from 'react';
import { Link } from 'react-router-dom';
import Col from 'react-bootstrap/Col';
import './Home.css';

const Home = () => {
    return (
        <>
        <Col lg="3" md="3" sm="1" xs="1">
            <div className="myCafeIn">
                  <Link to="/Home/*">My CafeIn</Link>
                    <ul className="list-group list-group-flush" style={{ listStyle: "none" }}>
                        <li>
                        <Link to="/MyPage/Cart/CHome/*" >장바구니</Link>
                        </li>
                        <hr/>
                        <li>
                        <Link to="/MyPage/Like/LHome/*"> 찜한 상품</Link>
                        </li>
                        <hr />
                        <li>
                        <Link to="/MyPage/Shop/ShopList/*">주문목록</Link>
                        </li>
                        <hr />
                        <li>
                        <Link to="/MyPage/Review/Review/*">리뷰관리</Link>
                        </li>
                        <li>
                        <Link to="/MyPage/Review/Review/*" style={{ color: "#6F6F6F" }}>작성 가능한 리뷰</Link>
                        </li>
                        <li>
                        <Link to="/Mypage/Review/RList/*" style={{ color: "#6F6F6F" }}>내가 작성한 리뷰 </Link></li>
                        <hr/>
                        <li>
                          <Link to="/MyPage/Account/Home/*" style={{color:'#8D5124', fontWeight:550}}>계정 관리</Link>
                          </li>
                    </ul>
                </div>
                </Col> 

            <div className='myPageAccount' style={{marginTop:"15%"}}>
                <div className="myPageAccountHomeBackground">
                <h2 style={{ marginTop: "5%", marginBottom: "1%", marginLeft: "1%" }}>
            계정관리
          </h2>
                    <table style={{width:"100%"}}>
                        <tr>
                        <td>
                            <h5 className='AccountTitle'>계정 정보</h5>
                            <Link to="/MyPage/Account/ChangeAccount/*"> <button className='myPageAccountMNprofileButton'>수정</button></Link> {/*link 오류 */} 
                        </td></tr>
                        <tr>
                            <td><h5 className='AccountTitle'>비밀번호</h5>
                            <Link to="/MyPage/Account/ChangePassword/*"><button className='myPageAccountMNprofileButton'>변경</button></Link></td>
                        </tr>
                        
                    </table>
                </div>
            </div>
        </>
    );
};

export default Home;