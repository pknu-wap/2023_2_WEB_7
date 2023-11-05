import LoginBackground from '../../component/LoginBackground';
import styled from 'styled-components';
import { useState, useEffect } from 'react';
import { BiShow } from 'react-icons/bi';
import { useNavigate } from 'react-router';
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

  button {
    position: absolute;
    right: 109px;
    bottom: 40px;
    width: 110px;
    height: 55px;
    border: none;
    border-radius: 12px;
    background-color: #F3B04D;
    text-decoration: none;
    text-align: center;
    color: #FFFFFF;
    font-family: Noto Sans KR;
    font-size: 18px;
    font-weight: 500;
    padding: 15px 30px;
    cursor: pointer;
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
const Question = styled(Link)`
  position: absolute;
  bottom: 185px;
  right: 540px;
  color: #FF9A23;
  font-size: 17px;
`

function IDPW() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('\t');
  const [passwordError, setPasswordError] = useState('\t');
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (!usernameError&&!passwordError) {
      console.log(username);
      setUsernameError('\t');
      setPasswordError('\t');
      fetch('/your-server-endpoint', {
        method: 'POST',
        body: JSON.stringify({username, password}),
        headers: {
          'Content-type': 'application/json',
        },
      })
        
        .then((response) => {
          if (response.ok) {
            navigate('/join2');
          } else {
            console.log('서버 요청 실패');
            alert('가입된 회원정보가 없습니다.');
            setUsername('');
            setPassword('');
          }
        })
        .catch((error) => {
          console.error('오류 발생');
        });
    }
  }, [username, password, usernameError, passwordError, navigate]);

  const handleNextClick = () => {
    if (username.length < 5 || !/^(?=.*[a-zA-Z])[\w]+$/.test(username)) {
      setUsernameError('아이디는 5자 이상, 영어로 작성해야 합니다.');
      setUsername('');
    } else {
      setUsernameError('');
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
        사용할 아이디와 비밀번호를 알려주세요! (1/4)
        <ID>
          <p>아이디</p>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="5자 이상 작성해주세요."
          />
          {usernameError && <span>{usernameError}</span>}
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
        <button onClick={handleNextClick}>다음</button>
      </Container>
      <Question to="/login">이미 가입된 회원이신가요?</Question>
    </LoginBackground>
  );
};

export default IDPW;