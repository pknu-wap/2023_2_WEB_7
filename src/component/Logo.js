import logo from '../img/logo.png';
import styled from 'styled-components';

const LogoBox = styled.div`
  display: flex;

  img {
    width: 71px;
    height: 65px;
    flex-shrink: 0;
  }

  p {
    color: #F3B04D;
    font-family: Modak;
    font-size: 47px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin: 6px 0 0 8px;
  }  

  span {
    color: #8B9F2A;
    font-family: Modak;
    font-size: 47px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
  }
`

function Logo() {
  return (
    <LogoBox>
      <img src={logo} alt="로고" />
      <p>Eat<span>P</span>ly</p>
    </LogoBox>
  );
};

export default Logo;