import { Link } from'react-router-dom';
import logo from './HeaderLogo.png'
import {React, useState} from 'react';

export default function Header() {
      return(
      <div>
            <img src={logo} alt="로고" />
              <form>
                    <input
                    type="text"
                    placeholder="검색"
                    />
                    <button type="submit">검색</button>
                </form>
              <span>
                  <ul>
                      <li><Link to="/Shop/Shop" style={{ fontSize: "1.8vw", fontWeight:"bold" }}>  쇼핑 </Link> </li>
                      <li><Link to="/Shop/Shop" style={{ fontSize: "1.8vw", fontWeight:"bold" }}>  커뮤니티 </Link> </li>
                      <li> <Link to="/Auth" style={{ fontSize: "1.8vw", fontWeight:"bold" }}> 로그인 | 회원가입 </Link> </li>
                  </ul>
              </span>
        </div>
    );
} 
