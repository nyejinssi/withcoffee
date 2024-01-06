import { useNavigate } from "react-router-dom";
import Home from "../Main";

const SignUpDone = () => {
    const navigate = useNavigate();
    return (
        <div>
            <h1> 회원가입이 완료되었습니다. </h1>
            <button onClick={()=> navigate('/')}>홈으로</button>
        </div>
    );
}

export default SignUpDone;