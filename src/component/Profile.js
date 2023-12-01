import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  color: #000000;
  font-family: Noto Sans KR;
  width: 830px;
  padding: 30px 54px;
  border: 1px solid #EFEFEF;
  border-radius: 10px;
  background-color: #FFFFFF;
`
const Text = styled.div`
  display: flex;
  justify-content: space-between;

  h2 {
    font-size: 25px;
    font-weight: 500;
  }
`
// const Change = styled(Link)`
//   color: #F3B04D;
//   font-size: 18px;
//   font-weight: 500;
// `
const ContentBox = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #EFEFEF;
  padding: 15px 5px;

  span {
    font-size: 15px;
    font-weight: 500;
  }
`

function Profile({name, age, weight, height, gender, active}) {
  const getGenderText = (gender) => {
    return gender === 1 ? "남성" : gender === 2 ? "여성" : "";
  };

  const getActiveText = (active) => {
    switch (active) {
      case 1:
        return "거의 앉아서 일함";
      case 2:
        return "적은 활동량";
      case 3:
        return "평균적인 활동량";
      case 4:
        return "많은 활동량";
      case 5:
        return "아주 많은 활동량";
      default:
        return "";
    }
  };

  return (
    <Container>
      <Text>
        <h2>프로필</h2>
        {/* <Change to="#!">수정</Change> */}
      </Text>
      <ContentBox>
        <span>이름</span>
        <span>{name}</span>
      </ContentBox>
      <ContentBox>
        <span>나이</span>
        <span>{age}세</span>
      </ContentBox>
      <ContentBox>
        <span>몸무게</span>
        <span>{weight}kg</span>
      </ContentBox>
      <ContentBox>
        <span>키</span>
        <span>{height}cm</span>
      </ContentBox>
      <ContentBox>
        <span>성별</span>
        <span>{getGenderText(gender)}</span>
      </ContentBox>
      <ContentBox>
        <span>활동량</span>
        <span>{getActiveText(active)}</span>
      </ContentBox>
    </Container>
  );
};

export default Profile;