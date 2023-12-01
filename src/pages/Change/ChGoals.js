import LoginBackground from "../../component/LoginBackground";
import styled from "styled-components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
const TargetWeight = styled.div`
  margin-top: 50px;
  input {
    padding: 17px 25px;
    background-color: #FFFFFF;
    border-radius: 12px;
    color: #6A3900;
    font-family: Noto Sans KR;
    font-size: 18px;
    font-weight: 300;
    overflow: auto;
    width: 80%;
    height: 60px;
    border: 1px solid #000000;
  }
  input:focus {
    outline: none;
  }
`

function ChGoals() {
  const [targetWeight, setTargetWeight] = useState('');
  const navigate = useNavigate();

  const handleNextClick = async() => {
    if (!targetWeight) {
      alert('목표를 입력해주세요.');
      return;
    }
    try {
      const response = await fetch('/your-server-endpoint', {
        method: 'POST',
        body: JSON.stringify(targetWeight),
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
        <Title>Correct your information</Title>
        아래 입력된 정보로 프로필을 수정합니다. (3/3)
        <TargetWeight>
          <input
            type="number"
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            placeholder="목표 몸무게를 입력해주세요."
          />
        </TargetWeight>
        <Link to="/join3">이전</Link>
        <button onClick={handleNextClick}>수정하기</button>
      </Container>
    </LoginBackground>
  );
};

export default ChGoals;