import LottieBad from "../img/LottieBad";
import LottieGood from "../img/LottieGood";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 260px;
`
const CircleBox = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 1px solid #EFEFEF;
  overflow: hidden;
  background-color: #FFF1DC;
`
const ProgressBarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 20px;
  background-color: #FFEBCC;
  border-radius: 25px;
  overflow: hidden;
`
const ProgressBar = styled.div`
  width: ${(props) => (props.progress*100).toFixed(2)}%;
  height: 100%;
  background-color: #F3B04D;
  border-radius: 25px;
`
const Text = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #FFFFFF;
  font-family: Noto Sans KR;
  font-size: 14px;
  font-weight: 500;
`
const GoalText = styled.h5`
  color: #000000;
  font-family: Noto Sans KR;
  font-size: 15px;
  font-weight: 400;
`

function State({name, weight, targetWeight}) {

  const weightDifference = targetWeight - weight;
  let action = '유지';
  let animationLottie = null;
  let goalText = '';

  if (weightDifference > 0) {
    action = '증량';
    animationLottie = <LottieBad/>;
    goalText = `목표까지 ${targetWeight - weight}kg 남았어요!`;
  } else if (weightDifference < 0) {
    action = '감량';
    animationLottie = <LottieBad/>;
    goalText = `목표까지 ${weight - targetWeight}kg 초과했어요!`;
  } else {
    animationLottie = <LottieGood/>;
    goalText = '현재 목표 체중을 유지 중이에요!';
  };

  const progress = weight / targetWeight;

  return (
    <Container>
      <CircleBox>
        {animationLottie}
      </CircleBox>
      <h3>{name}</h3>
      <ProgressBarContainer>
        <ProgressBar progress={progress}>
          <Text>{`${weight}/${targetWeight}kg`}</Text>
        </ProgressBar>
      </ProgressBarContainer>
      <GoalText>{goalText}</GoalText>
    </Container>
  );
};

export default State;