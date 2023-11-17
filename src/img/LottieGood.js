import styled from "styled-components";
import Lottie from "../component/LottieComponent";
import good from "./good.json";

const LottieBox = styled.div`
  position: absolute;
  left: -65%;
  width: 220%;
  height: auto;
`

const LottieGood = () => {
  return (
    <LottieBox>
      <Lottie 
        animationData={good}
        loop={true}
        speed={1}
        autoplay={true}
      />
    </LottieBox>
  );
};

export default LottieGood;