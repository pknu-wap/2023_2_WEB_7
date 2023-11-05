import salad from '../img/salad.png';
import broccoli from '../img/broccoli.png';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Background = styled.div`
  position: relative;
  display: flex;
`
const BackCircle = styled.div`
  position: relative;
  width: 742px;
  height: 742px;
  border-radius: 742px;
  background-color: #FFEBCC;

  img {
    position: absolute;
    top: -15px;
    right: 178px;
    width: 109px;
    height: 108px;
    filter: drop-shadow(0px 95px 6px rgba(0, 0, 0, 0.15));
  }
`
const Circle1 = styled.div`
  position: absolute;
  top: 59.21px;
  left: 59.21px;
  width: 623.57px;
  height: 623.57px;
  border-radius: 623.57px;
  border: 1px solid #C8C8C8;
`
const Circle2 = styled.div`
  position: absolute;
  top: 101.51px;
  left: 59.21px;
  width: 537.769px;
  height: 537.769px;
  border-radius: 537.769px;
  border: 1px solid #C8C8C8;

  img {
    position: absolute;
    top: 0.2px;
    right: 44.24px;
    width: 537.742px;
    height: 537.742px;
    filter: drop-shadow(2px 12px 33px rgba(0, 0, 0, 0.50));
  }
`
const MenuContainer = styled.div`
  position: absolute;
  top: 100px;
  left: 637px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 600px;

  p {
    color: #000;
    font-family: Noto Sans KR;
    font-size: 15px;
    font-weight: 300;
    margin-left: 22px;
    animation: moveUpDown 1s infinite;
  }
  @keyframes moveUpDown {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`
const MenuBox = styled(Link)`
  width: 240px;
  height: 75px;
  border-radius: 50px;
  background-color: #FFFFFF;
  box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.25);
  position: relative;

  img {
    position: absolute;
    top: 9px;
    left: 11px;
    width: 57px;
    height: 57px;
    border-radius: 50%;
  }

  span {
    position: absolute;
    top: 19px;
    left: 85px;
    color: #000000;
    font-family: Noto Sans KR;
    font-size: 22px;
    font-weight: 500;
  }

  &:hover {
    transform: translate(0, -10%);
    background-color: #F3B04D;
    box-shadow: 3px 12px 15px 2px rgba(0, 0, 0, 0.23);
    span{
      top: 20px;
      left: 87px;
      font-size: 23px;
      color: #FFFFFF;
    }
  }
`

function MenuPad() {
  return (
    <Background>
      <BackCircle>
        <img src={broccoli} alt="브로콜리"/>
        <Circle1/>
        <Circle2>
          <img src={salad} alt="샐러드"/>
        </Circle2>
      </BackCircle>
      <MenuContainer>
        <MenuBox to="/refrigerator">
          <img src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2080&q=80" alt="냉장고"/>
          <span>냉장고</span>
        </MenuBox>
        <MenuBox to="/planer">
          <img src="https://images.unsplash.com/photo-1529651737248-dad5e287768e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1965&q=80" alt="식단"/>
          <span>식단</span>
        </MenuBox>
        <MenuBox to="/report">
          <img src="https://images.unsplash.com/photo-1634117622592-114e3024ff27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1925&q=80" alt="리포트"/>
          <span>리포트</span>
        </MenuBox>
        <MenuBox to="/mypage">
          <img src="https://images.unsplash.com/photo-1470790376778-a9fbc86d70e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2008&q=80" alt="마이페이지"/>
          <span>마이페이지</span>
        </MenuBox>
        <p>▲ 잇플리 가입 후 이용해보세요.</p>
      </MenuContainer>
    </Background>
  );
};

export default MenuPad;