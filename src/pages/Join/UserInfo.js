import LoginBackground from "../../component/LoginBackground";
import styled from "styled-components";
import { useState } from 'react';
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
const Name = styled.div`
  margin-top: 25px;
  display: flex;
  align-items: center;
  
  p {
    color: #000000;
    font-family: Noto Sans KR;
    font-size: 18px;
    font-weight: 400;
    margin-right: 36px;
  }

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
const Age = styled.div`
  margin-top: 15px;
  display: flex;
  align-items: center;
  p {
    color: #000000;
    font-family: Noto Sans KR;
    font-size: 18px;
    font-weight: 400;
    margin-right: 36px;
  }

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
const Weight = styled.div`
  margin-top: 15px;
  display: flex;
  align-items: center;
  p {
    color: #000000;
    font-family: Noto Sans KR;
    font-size: 18px;
    font-weight: 400;
    margin-right: 20px;
  }

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
const Height = styled.div`
  margin-top: 15px;
  display: flex;
  align-items: center;
  p {
    color: #000000;
    font-family: Noto Sans KR;
    font-size: 18px;
    font-weight: 400;
    margin-right: 53px;
  }

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
const Gender = styled.div`
  margin-top: 25px;
  color: #000000;
  font-family: Noto Sans KR;
  font-size: 18px;
  font-weight: 400;
  p {
    display: inline-block;
    margin-right: 53px;
  }
  label {
    margin-right: 53px;
  }
  input {
    margin-right: 10px;
  }
`

function UserInfo() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [gender, setGender] = useState(1);
  const navigate = useNavigate();

  const handleGenderChange = (e) => {
    setGender(parseInt(e.target.value));
  };

  const handleNextClick = async() => {
    if (!name || !age || !weight || !height) {
      alert('모든 필드를 입력하세요.');
      return;
    }

    const data={
      name,
      age,
      gender,
      weight,
      height,
    };

    try {
      const response=await fetch('/user/join', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json',
        },
      });

      if (response.ok) {
        navigate('/next-page.html');
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
        <Title>Enter your Information!</Title>
        잇플리에게 당신의 정보를 알려주세요! (2/4)
        <Name>
          <p>이름</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요."
          />
        </Name>
        <Age>
          <p>나이</p>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="나이를 입력하세요."
          />
        </Age>
        <Weight>
          <p>몸무게</p>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="몸무게를 입력해주세요."
          />
        </Weight>
        <Height>
          <p>키</p>
          <input 
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder="키를 입력해주세요."
          />
        </Height>
        <Gender>
          <p>성별</p>
          <label>
            <input
              type="radio"
              name="gender"
              value={1}
              checked={gender===1}
              onChange={handleGenderChange}
            />
            남성
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value={2}
              checked={gender===2}
              onChange={handleGenderChange}
            />
            여성
          </label>
        </Gender>
        <Link to="/join1">이전</Link>
        <button onClick={handleNextClick}>다음</button>
      </Container>
    </LoginBackground>
  );
};

export default UserInfo;