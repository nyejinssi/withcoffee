import { useNavigate } from "react-router-dom";
import logo from '../header/HeaderLogo.png';

const SignUpDone = () => {
    const navigate = useNavigate();
    return (
        <>
        <div style={{ textAlign: 'center', alignItems: 'center'}}>
        <br/> <br/>
            <h2> 환영합니다!</h2>
            <h1 color="blue"> 회원가입이 완료 되었습니다. </h1><br/>

            <button onClick={()=> navigate('/')} style={{ backgroundColor:'black', color:'white', border:'gray'}}>홈으로</button>
        </div>
        </>
    );
}

export default SignUpDone;