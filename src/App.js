import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './main/Main';
import Headers from './header/Headers';
import Sign from './Auth/Sign';
import UserInfo from './Auth/UserInfo';
import WritePost from './community/WritePost';
import CommunityHome from './community/CommunityHome';
import Post from './community/Post';
import PostDetails from './community/PostDetails';

const App = () => {
  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
        <Headers/>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/Auth" element={<Sign/>} />
          <Route path="/Auth/UserInfo" element={<UserInfo/>} />
          <Route path="/community/Post" element={<Post/>} /> 
          <Route path="/community/write" element={<WritePost/>} /> 
          <Route path="/community/*" element={<CommunityHome/>} />
          <Route path="/community/:category/:postId" element={<PostDetails />} />
        </Routes>
      </Router>
    </div>
  );
};


export default App;