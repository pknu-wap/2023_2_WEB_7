import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #EFEFEF;
  border-radius: 10px;
  width: 830px;
  padding: 30px 54px;
  background-color: #FFFFFF;

  h5 {
    color: #000000;
    font-family: Noto Sans KR;
    font-size: 16px;
    font-weight: 400;
  }
  span {
    font-weight: 700;
  }
`

function Advice({name, weight, targetWeight}) {
  
  //증량, 감량, 유지 판단
  const weightDifference = targetWeight - weight;
  let action = '유지';
  if (weightDifference > 0) {
    action = '증량';
  } else if (weightDifference < 0) {
    action = '감량';
  };

  // 예상 소요 기간 계산
  const period = Math.abs(weightDifference) * 2;

  let message = '';
  switch (action) {
    case '증량':
      message = (
        <h5>
          <span>{name}</span>님께 권장드리는 증량 속도는 1주당 +0.5kg으로 
          목표 체중인 {targetWeight}kg까지의 예상 소요 기간은 {period}주 입니다. 
          급격한 증량은 체지방량 증가로 인한 비만 등의 건강상의 문제를 일으킬 수 있으니 
          권장 증량 속도에 맞춰 목표를 달성하세요!
        </h5>
      );
      break;
    case '감량':
      message = (
        <h5>
          <span>{name}</span>님께 권장드리는 감량 속도는 1주당 -0.5kg으로 
          목표 체중인 {targetWeight}kg까지의 예상 소요 기간은 {period}주 입니다. 
          무리한 식습관은 근 손실, 요요 등의 건강상의 문제를 일으킬 수 있으니 영양 정보에 맞춰 목표를 달성하세요!
        </h5>
      );
      break;
    case '유지':
      message = (
        <h5>
          <span>{name}</span>님의 목표는 {targetWeight}kg을 유지하는 것입니다. 
          균형 잡힌 식단은 체중 유지에 매우 중요해요! 규칙적인 식습관과 적절한 운동을 통해 건강한 몸과 마음을 유지하세요.
        </h5>
      );
      break;
  };

  return (
    <Container>
      {message}
    </Container>
  );
};

export default Advice;