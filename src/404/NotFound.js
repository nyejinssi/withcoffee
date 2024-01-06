import React from 'react';
import './404.css';

const NotFound = () => {
    return(
        <>
          <link
            href="https://fonts.googleapis.com/css?family=Montserrat:300,700"
            rel="stylesheet"
          />
          {/* Custom stlylesheet */}
          {/* HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries */}
          {/* WARNING: Respond.js doesn't work if you view the page via file:// */}
          {/*[if lt IE 9]>                
              <![endif]*/}
          <div id="notfound">
            <div className="notfound">
              <div className="notfound-404">
                <h1>
                  4<span />4
                </h1>
              </div>
              <h2>Oops! 없는 페이지네요~!</h2>
              <p>
                죄송하지만, 찾는 페이지는 존재하지 않습니다.
                불편을 드려 죄송합니다.
              </p>
              {/* <a href="#">Back to homepage</a> */}
            </div>
          </div>
        </>);
};

export default NotFound;

