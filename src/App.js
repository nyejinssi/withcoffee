import React , {useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import { authService } from './fbase';
import GlobalStyle from './globalStyle';

import Main from './main/Main';
import Headers from './header/Headers';
import UserHeader from './header/UserHeader';

import Image from './coffeeMBTI/imageInput';
import MbtibeansInput from './coffeeMBTI/MbtibeansInput';
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
import LikedProduct from './MyPage/LikedProduct';
import MyReview from './MyPage/MyReview';
//------- MBTI------------------------
import Start from './coffeeMBTI/StartPage'; 
import Question from './coffeeMBTI/QuestionPage'; 
//-----------------Shop-------------------
import Beans from './shop/Beans';
import Tools from './shop/Tools';
import Detail from './shop/Detail';
import WriteReview from './shop/Write';
import Search from './shop/Search';

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
        <GlobalStyle />
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
              <Route path="/Edit/:postId" element={<Edit />}/>
              <Route path="/mypage/LikedProduct/*" element={<LikedProduct/>}/>
              <Route path="/mypage/MyReview/*" element={<MyReview/>}/>

              <Route path="/Review/Write/:productId" element={<WriteReview/>}/>
            </>
          ):(
            <>
              <Route path="/Auth" element={<Sign/>} />
            </>
          )}
          <Route path="/" element={<Main />} />
          <Route path="/image" element={<Image />} />
          <Route path="/mbtibeans" element={<MbtibeansInput/>} />
          <Route path="/Auth/PhoneSignIn" element={<PhoneSignIn/>} />
          <Route path='/MBTI/MBTIMain' element={<Start/>} />
          <Route path='/MBTI/Question' element={<Question/>} />
          
          <Route path="/shop/Beans" element={<Beans/>}/>
          <Route path="/shop/Tools" element={<Tools/>}/>
          <Route path="/shop/Detail/:productId"  element={<Detail/>}/>
          <Route path="/shop/Search/:searchQuery" element={<Search />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};


export default App;