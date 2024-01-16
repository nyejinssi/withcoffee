import React , {useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import { authService } from './fbase';

import Main from './main/Main';
import Headers from './header/Headers';
import UserHeader from './header/UserHeader';
//--------------------------Sign------------------------------
import Sign from './Auth/Sign';
import PhoneSignIn from './Auth/PhoneSignIn';
import UserInfo from './Auth/UserInfo';
import PhoneUser from './Auth/PhoneUser';
import SignUpDone from './Auth/SignUpDone';
import Logout from './Auth/Logout';
//-----------------------community--------------------------
import WritePost from './community/WritePost';
import CommunityHome from './community/CommunityHome';
import Post from './community/Post';
import PostDetail from './community/PostDetail';
import PopularPosts from './community/PopularPosts';
import Edit from './community/Edit';

//-------------MyPage-------------
import Home from './MyPage/Home';
import MyComment from './MyPage/MyComment';
import SavedPost from './MyPage/SavedPost';
import UpdateInfo from './MyPage/UpdateInfo';
//------- MBTI------------------------
import MBTItest from './MBTI/MBTItest';
import MBTIdata from './MBTI/MBTIdata';

const App = () => {
  const [init, setInit] = useState(false); // init = false
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null); 
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if(user){
        setIsLoggedIn(true);
        setUserObj(user);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  return (
    <div className="App">
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        {isLoggedIn ? (
            <UserHeader/>
          ):(
          <Headers />
        )}
        <Routes>
          {isLoggedIn ? (
            <>
              <Route path="/Auth/Info/Email/*" element={<UserInfo/>} />
              <Route path="/Auth/Info/Phone/*" element={<PhoneUser/>} />
              <Route path="/Auth/SignUpDone/*" element={<SignUpDone/>} />
              <Route path="/Auth/logout/*" element={<Logout/>} />
              
              <Route path="/community/Post" element={<Post/>} /> 
              <Route path="/community/write" element={<WritePost/>} /> 
              <Route path="/community/*" element={<CommunityHome/>} />
              <Route path="/community/:category/:postId" element={<PostDetail />} />
              
              <Route path="/mypage/*" element={<Home/>} />
              <Route path="/mypage/MyComment/*" element={<MyComment/>} />
              <Route path="/mypage/SavedPost/*" element={<SavedPost/>} />
              <Route path="/mypage/UpdateInfo/*" element={<UpdateInfo/>} />
              <Route path="/Edit/:postId" element={<Edit />} />
            </>
          ):(
            <>
              <Route path="/Auth" element={<Sign/>} />
            </>
          )}
          <Route path="/" element={<Main />} />
          <Route path="/MBTI/MBTItest/*" element={<MBTItest/>} />
          <Route path="/Auth/PhoneSignIn" element={<PhoneSignIn/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};


export default App;