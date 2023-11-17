import styled from "styled-components";
import { useState, useEffect } from "react";
import Logo from "../component/Logo";
import MenuBar from "../component/MenuBar";
import State from "../component/State";
import Advice from "../component/Advice";
import Profile from "../component/Profile";
import Diagnosis from "../component/Diagnosis";

const Body = styled.div`
  margin: 0;
  background-color: #FFFDFA;
  padding: 60px 330px;
  width: 100%;
  height: 100vh;
`
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 50px;
  padding-bottom: 30px;
  border-bottom: 1px solid #EFEFEF;
`
const MainContainer = styled.div`
  display: flex;
  justify-content: space-between;
`
const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 150px;
`
const StateBox = styled.div`
  margin-top: 70px;
  margin-left: 45px;
`

function Mypage() {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/mypage');
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          console.error('서버 응답 실패');
        }
      } catch (error) {
        console.error('데이터 가져오기 실패', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Body>
      <Header>
        <Logo/>
        <MenuBar/>
      </Header>
      <MainContainer>
        <StateBox>
          <State/>
        </StateBox>
        <Content>
          <Advice
            name={userData.name}
            weight={userData.weight}
            targetWeight={userData.goal_weight}
          />
          <Profile
            name={userData.name}
            age={userData.age}
            weight={userData.weight}
            height={userData.height}
            gender={userData.gender}
            active={userData.exercise}
          />
          <Diagnosis
            weight={userData.weight}
            targetWeight={userData.goal_weight}
            basalMetabolism={userData.basal_metabolism}
          />
        </Content>
      </MainContainer>
    </Body>
  );
};

export default Mypage;