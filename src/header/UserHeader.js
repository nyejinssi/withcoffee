import { Link } from'react-router-dom';
import logo from './HeaderLogo.png'
import {React, useState} from 'react';

export default function Header() {
      return(
      <div>
            <Link to="/"><img src={logo} alt="로고" /></Link>
              <form>
                    <input
                    type="text"
                    placeholder="검색"
                    />
                    <button type="submit">검색</button>
                </form>
              <span>
                  <ul>
                      <li><Link to="/Shop/Shop" >  쇼핑 </Link> </li>
                      <li><Link to="/Community" >  커뮤니티 </Link> </li>
                      <li> <Link to="/mypage"> 마이페이지 </Link> </li>
                  </ul>
              </span>
        </div>
    );
} 
