import logo from '../img/logo.png';
import styled, { css } from 'styled-components';

const LogoBox = styled.div`
  display: flex;
  
  img {
    width: 46px;
    height: 42px;
  }
  p {
    color: #F3B04D;
    font-family: Modak;
    font-size: 35px;
    font-weight: 400;
    margin: 6px 0 0 4px;
  }
  span {
    color: #8B9F2A;
  }

  ${(props) =>
    props.home &&
    css`
      img {
        width: 71px;
        height: 65px;
      }
      p {
        font-size: 47px;
        margin: 6px 0 0 8px;
      }
    `}
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