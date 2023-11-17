import styled from "styled-components";
import Lottie from "../component/LottieComponent";
import loading from "./loading.json";

const LottieBox = styled.div`

`

const LottieLoading = () => {
  return (
    <LottieBox>
      <Lottie 
        animationData={loading}
        loop={true}
        speed={1}
        autoplay={true}
      />
    </LottieBox>
  )
}

export default LottieLoading;