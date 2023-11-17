import styled from "styled-components";
import Lottie from "../component/LottieComponent";
import bad from "./bad.json";

const LottieBox = styled.div`
  position: absolute;
  left: -65%;
  width: 220%;
  height: auto;
`

const LottieBad = () => {
  return (
    <LottieBox>
      <Lottie 
        animationData={bad}
        loop={true}
        speed={1}
        autoplay={true}
      />
    </LottieBox>
  )
}

export default LottieBad;