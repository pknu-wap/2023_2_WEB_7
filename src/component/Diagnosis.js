import styled from "styled-components";

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
const Text =styled.h2`
  font-size: 25px;
  font-weight: 500;
`
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

function Diagnosis({weight, targetWeight, basalMetabolism}) {

  const weightDifference = targetWeight - weight;
  let action = '유지';
  if (weightDifference > 0) {
    action = '증량';
  } else if (weightDifference < 0) {
    action = '감량';
  };

  let recommendCalories = basalMetabolism;
  if (action === '증량') {
    recommendCalories += 500;
  } else if (action === '감량') {
    recommendCalories -= 500;
  };

  const recCal = Math.round(recommendCalories);
  const carb = Math.round((recommendCalories * 0.5) / 4);
  const protein = Math.round((recommendCalories * 0.3) / 4);
  const fat = Math.round((recommendCalories * 0.2) / 9);

  return ( 
    <Container>
      <Text>진단</Text>
      <ContentBox>
        <span>권장 섭취 칼로리</span>
        <span>{recCal}kcal</span>
      </ContentBox>
      <ContentBox>
        <span>탄수화물</span>
        <span>{carb}g</span>
      </ContentBox>
      <ContentBox>
        <span>단백질</span>
        <span>{protein}g</span>
      </ContentBox>
      <ContentBox>
        <span>지방</span>
        <span>{fat}g</span>
      </ContentBox>
    </Container>
  );
};

export default Diagnosis;