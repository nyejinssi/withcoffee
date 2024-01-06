import React from 'react';
import {Link} from 'react-router-dom';
import MBTIbackground from './coffeembti.png';
const Main = () => {
    return (
        <div>
            <img src={MBTIbackground} alt="Example" />
            <div id="mbti_box">
                <Link to="/MBTI/MBTItest"><button>커피 MBTI</button></Link>
            </div>
        </div>
    );
};

export default Main;
