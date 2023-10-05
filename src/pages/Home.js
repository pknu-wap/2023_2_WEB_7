import logo from '../logo.png';
import { BiSearch } from 'react-icons/bi';
import styled from 'styled-components';
import Menu from '../component/menu.js';

function Home() {
  return (
    <div>
      <Header>
        <Logo>
          <img src={logo} alt="로고" />
          <p>Eat<span>P</span>ly</p>
        </Logo>
        <Login>
          <p>로그인</p>
          <p>회원가입</p>
        </Login>
      </Header>
      <Main>
        <MainText>
          <h1>
            <span>잇플리</span>와 함께 본인에게 맞는<br/>식단으로 건강한 관리를<br/>시작하세요!
          </h1>
          <h6>잇플리는 고객의 기초대사량, 활동대사량 등을 고려하여 계산한 영양 지표를 통해<br/>목표 달성을 위한 맞춤 영양 가이드를 제공합니다.</h6>
          <div>
            <StartButton>
              <a href="#!">시작하기</a>
            </StartButton>
            <SearchStyle>
              <form>
                <fieldset>
                  <input type="textarea" placeholder="레시피 검색"/>
                  <BiSearch></BiSearch>
                </fieldset>
              </form>
            </SearchStyle>
          </div>
        </MainText>
        <div>
          <Menu />
        </div>
      </Main>
    </div>
  )
}


const Main = styled.div`
  display: flex;
  flex-direction: row;
`

const SearchStyle = styled.div`
  margin-top: 45px;
  display: inline-block;
  margin-left: 45px;
  
fieldset {
  display: flex;
  justify-content: center;
  position: relative;
  border: 0 none;
  margin: 0;
}

input {
  box-sizing: border-box;
  padding: 18px 85px 18px 35px;
  background-color: #FFFFFF;
  border-radius: 50px;
  color: #6A3900;
  font-family: Noto Sans KR;
  font-size: 28px;
  font-style: normal;
  font-weight: 500;
  overflow: auto;
  width: 375px;
  height: 77px;
}

svg {
  position: absolute;
  top: 21px;
  right: 42px;
  color: #6A3900;
  width: 45px;
  height: 50px;
}
`

const StartButton = styled.div`
  box-sizing: border-box;
  display: inline-block;
  border-radius: 50px;
  background: #F3B04D;
  padding: 18px 44px;
  margin-top: 45px;
  height: 77px;
  

  a {
    font-family: Noto Sans KR;
    font-size: 28px;
    font-style: normal;
    font-weight: 500;
    text-decoration: none;
    color: #6A3900;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
`

const Logo = styled.div`
  display: flex;
  margin-left: 20px;

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
    margin: 18px 0 0 8px;
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

const Login = styled.div`
  display: flex;
  margin-right: 40px;
  gap: 55px;
  margin-top: 23px;
  color: #000;
  font-family: Noto Sans KR;
  font-size: 22px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`

const MainText = styled.div`
  margin-top: 240px;

  h1 {
    color: #000;
    font-family: Noto Sans KR;
    font-size: 52px;
    font-style: normal;
    font-weight: 700;
    line-height: normal;
    margin: 0;
  }

  span {
    color: #FF9A23;
  }

  h6 {
    color: #000;
    font-family: Noto Sans KR;
    font-size: 19px;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    margin: 15px 0 0 0;
  }
`

export default Home;