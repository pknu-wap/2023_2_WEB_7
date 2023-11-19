import LoginBackground from '../component/LoginBackground';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { BiShow } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Container = styled.div`
  width: 100%;
  height: 100%;
  color: #000000;
  font-family: Noto Sans KR;
  font-size: 21px;
  font-weight: 300;
  position: relative;
  padding: 85px 109px 0px 85px;

  a {
    position: absolute;
    right: 109px;
    bottom: 40px;
    width: 110px;
    height: 55px;
    border-radius: 12px;
    background-color: #F3B04D;
    text-decoration: none;
    text-align: center;
    color: #FFFFFF;
    font-family: Noto Sans KR;
    font-size: 18px;
    font-weight: 500;
    padding: 15px 30px;
  }
`
const Title = styled.h2`
  font-family: Poppins;
  font-size: 48px;
  font-weight: 800;
  margin-left: -12px;
`
const ID = styled.div`
  margin-top: 50px;

  p {
    color: #000000;
    font-family: Noto Sans KR;
    font-size: 18px;
    font-weight: 400;
    margin: 10px 0;
  }

  input {
    padding: 17px 25px;
    background-color: #FFFFFF;
    border-radius: 12px;
    color: #6A3900;
    font-family: Noto Sans KR;
    font-size: 18px;
    font-weight: 300;
    overflow: auto;
    width: 100%;
    height: 60px;
    border: 1px solid #000000;
  }
  input:focus {
    outline: none;
  }

  span {
    font-size: 15px;
    color: red;
  }
`
const PassWord = styled.div`
  margin-top: 20px;
  position: relative;

  p {
    color: #000000;
    font-family: Noto Sans KR;
    font-size: 18px;
    font-weight: 400;
    margin: 10px 0;
  }

  input {
    padding: 17px 25px;
    background-color: #FFFFFF;
    border-radius: 12px;
    color: #6A3900;
    font-family: Noto Sans KR;
    font-size: 18px;
    font-weight: 300;
    overflow: auto;
    width: 100%;
    height: 60px;
    border: 1px solid #000000;
  }
  input:focus {
    outline: none;
  }
  svg {
    position: absolute;
    top: 53px;
    right: 12px;
    width: 50px;
    height: 28px;
    color: rgb(135, 135, 135);
  }
  span {
    font-size: 15px;
    color: red;
  }
`

function Login() {
  const [id, setid] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [idError, setidError] = useState('\t');
  const [passwordError, setPasswordError] = useState('\t');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (!idError&&!passwordError) {
      setidError('\t');
      setPasswordError('\t');
      fetch('api /login', {
        method: 'POST',
        body: JSON.stringify({id, password}),
        headers: {
          'Content-type': 'application/json',
        },
      })
        
        .then((response) => {
          if (response.ok) {
            navigate('/next-page.html');
          } else {
            console.log('서버 요청 실패');
            alert('가입된 회원정보가 없습니다.');
            setid('');
            setPassword('');
          }
        })
        .catch((error) => {
          console.error('오류 발생');
        });
    }
  }, [id, password, idError, passwordError, navigate]);

  const handleNextClick = async() => {
    if (id.length < 5 || !/^(?=.*[a-zA-Z])[\w]+$/.test(id)) {
      setidError('아이디는 5자 이상, 영어로 작성해야 합니다.');
      setid('');
    } else {
      setidError('');
    };
    if (
      password.length < 8 || password.length > 12 || !/^(?=.*[a-zA-Z])(?=.*[$@$!%*?&#])/.test(password)
    ) {
      setPasswordError('비밀번호는 8~12자 이내로, 영어, 숫자, 특수 기호를 포함해야 합니다.');
      setPassword('');
    } else {
      setPasswordError('');
    };
  };
  
  return (
    <LoginBackground>
      <Container>
        <Title>Welcome to EatPly!</Title>
        오늘도 잇플리와 건강한 식사하세요!
        <ID>
          <p>아이디</p>
          <input
            type="text"
            value={id}
            onChange={(e) => setid(e.target.value)}
            placeholder="5자 이상 작성해주세요."
          />
          {idError && <span>{idError}</span>}
        </ID>
        <PassWord>
          <p>비밀번호</p>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="영어, 숫자, 특수문자 포함 8~12자 이내 작성해주세요."
          />
          <BiShow
            onMouseDown={togglePasswordVisibility}
            onMouseUp={togglePasswordVisibility}
            as="button"
          />
          {passwordError && <span>{passwordError}</span>}
        </PassWord>
        <Link to="/next-page.html" onClick={handleNextClick}>로그인</Link>
      </Container>
    </LoginBackground>
  );
};

export default Login;