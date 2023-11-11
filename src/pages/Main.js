import Logo from "../component/Logo.js";
import SearchBar from "../component/SearchBar.js";
import MenuPad from "../component/MenuPad.js";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Body = styled.div`
  margin: 0;
  background-color: #FFFDFA;
  width: 100%;
  height: 100%;
  display: flex;
`
const LeftBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 0 0 150px;
  width: 715px;
`
const Container = styled.div`
  margin-top: 149px;
`
const Content = styled.div`
  font-family: Noto Sans KR;
  color: #000000;
  span {
    color: #FF9A23;
  }
  h1 {
    font-size: 48px;
    font-weight: 700;
  }
  h6 {
    font-size: 15px;
    font-weight: 300;
  }
`
const UnderBox = styled.div`
  margin-top: 45px;
  width: 100%;
  display: flex;
  justify-content: space-between;
`
const StartButton = styled(Link)`
  display: inline-block;
  border-radius: 50px;
  background-color: #F3B04D;
  padding: 15px 37px;
  height: 59px;
  color: #6A3900;
  font-family: Noto Sans KR;
  font-size: 20px;
  font-weight: 500;
  text-decoration: none;
`
const RightBox = styled.div`
  margin: 100px 0 0 150px;
`

function Main() {
  return (
    <Body>
      <LeftBox>
        <Logo home/>
        <Container>
          <Content>
            <h1><span>잇플리</span>와 함께 본인에게 맞는<br/>식단으로 건강한 관리를<br/>시작하세요!</h1>
            <h6>잇플리는 고객의 기초대사량, 활동대사량 등을 고려하여 계산한 영양 지표를 통해 목표 달성을<br/> 위한 맞춤 영양 가이드를 제공합니다.</h6>
          </Content>
          <UnderBox>
            <StartButton to="/join1">
              시작하기
            </StartButton>
            <SearchBar home />
          </UnderBox>
        </Container>
      </LeftBox>
      <RightBox>
        <MenuPad/>
      </RightBox>
    </Body>
  );
};

export default Main;