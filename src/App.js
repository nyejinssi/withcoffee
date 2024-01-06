import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './main/Main';
import Headers from './header/Headers';
import Sign from './Auth/Sign';
import UserInfo from './Auth/UserInfo';

const App = () => {
  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
        <Headers/>
        <Main />
        <Routes>
          {/* <Route path="/" element={<Main />} /> */}
          <Route path="/Auth" element={<Sign/>} />
          <Route path="/Auth/UserInfo" element={<UserInfo/>} />
        </Routes>
      </Router>
    </div>
  );
};


export default App;