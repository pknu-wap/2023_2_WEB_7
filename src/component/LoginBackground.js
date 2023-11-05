import EatPly_back from '../img/EatPly_back.png';
import EatPly_login from '../img/EatPly_login.png';
import styled from 'styled-components';

const Background = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-image: url(${EatPly_back});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  padding: 93px 130px;
  position: relative;
`
const LoginBox = styled.div`
  width: 80%;
  height: 90%;
  background-color: #FFFDFA;
  box-shadow: 0px 6px 4px 2px rgba(0, 0, 0, 0.25);
  display: flex;

  img {
    width: auto;
    height: 100%;
  }
`
const TextBox = styled.div`
  flex: 1;
`

function LoginBackground(props) {
  return (
    <Background>
      <LoginBox>
        <img src={EatPly_login} alt="로그인"/>
        <TextBox>
          {props.children}
        </TextBox>
      </LoginBox>
    </Background>
  );
};

export default LoginBackground;