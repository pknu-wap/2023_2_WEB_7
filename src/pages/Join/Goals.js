import LoginBackground from "../../component/LoginBackground";
import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

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
    width: 115px;
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
    padding: 15px 20px;
    cursor: pointer;
  }
  a {
    position: absolute;
    right: 230px;
    bottom: 40px;
    display: block;
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
  }
`
const Title = styled.h2`
  font-family: Poppins;
  font-size: 48px;
  font-weight: 800;
  margin-left: -12px;
`
const BoxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 80px;
  font-family: Noto Sans KR;
  font-size: 20px;
  font-weight: 400;
`
const ClickBox = styled.div`
  border: 1px solid #B0B0B0;
  border-radius: 12px;
  width: 80%;
  text-align: center;
  padding: 10px 0;
  background-color: ${(props) => (props.selected ? '#F3B04D' : '#FFFFFF')};
  color: ${(props) => (props.selected ? '#FFFFFF' : '#000000')};
  cursor: pointer;
`

function Goals() {
  const [selectedBox, setSelectedBox] = useState('');
  const navigate = useNavigate();

  const clickBoxesOptions = [
    { id: '증량', label: '체중 증량'},
    { id: '감량', label: '체중 감량'},
    { id: '유지', label: '체중 유지'},
  ];

  const handleBoxClick = (selected, id) => {
    if (selected) {
      setSelectedBox('');
    } else {
      setSelectedBox(id);
    }
  };

  const handleNextClick = async() => {
    try {
      console.log(selectedBox);
      if (!selectedBox) {
        alert('목표를 선택해주세요.');
        return;
      }
      const response = await fetch('/your-server-endpoint', {
        method: 'POST',
        body: JSON.stringify(selectedBox),
        headers: {
          'Content-type': 'application/json',
        },
      });

      if (response.ok) {
        navigate('/new-page.html');
      } else {
        console.log('서버 요청 실패');
      }
    } catch(error) {
      console.error('오류 발생', error);
    }
  };

  return (
    <LoginBackground>
      <Container>
        <Title>Choose your goal!</Title>
        잇플리에게 당신의 목표를 알려주세요! (4/4)
        <BoxContainer>
          {clickBoxesOptions.map((box) => (
            <ClickBox
              key={box.id}
              id={box.id}
              selected={selectedBox === box.id}
              onClick={() => handleBoxClick(selectedBox === box.id, box.id)}
            >{box.label}</ClickBox>  
          ))}
        </BoxContainer>
        <Link to="/join3">이전</Link>
        <button onClick={handleNextClick}>가입하기</button>
      </Container>
    </LoginBackground>
  );
};

export default Goals;