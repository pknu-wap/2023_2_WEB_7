import styled from "styled-components";
import { useState, useEffect } from "react";
import Logo from "../component/Logo";
import MenuBar from "../component/MenuBar";

const Body = styled.div`
  margin: 0;
  background-color: #FFFDFA;
  padding: 60px 270px;
  width: 100%;
  height: 100vh;
`
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

function Report() {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/server-endpoint');
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
    </Body>
  );
};

export default Report;