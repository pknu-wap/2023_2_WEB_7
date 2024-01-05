import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const FoodName = styled.h3`
  color: #6A3900;
  font-family: Noto Sans KR;
  font-size: 17px;
  font-weight: 700;
  padding: 5px;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 280px;
  height: 390px;
  background-color: #FFFFFF;
  padding: 10px 14px;

  // &:hover {
  // ${FoodName} {
  //   animation: marquee 5s linear infinite;
  // }
  // }

  // @keyframes marquee {
  // 0% {
  //   transform: translateX(100%);
  // }
  // 100% {
  //   transform: translateX(-100%);
  // }
`
const FoodImg = styled.div`
  background-image: url('${props => props.imageUrl}');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 272px;
`

const ButtonBox = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: Noto Sans KR;
  font-size: 15px;
  font-weight: 500;
  margin-top: auto;
`
const ReadMore = styled.div`
  width: 145px;
  height: 42px;
  background-color: #F3B04D;
  color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }
`
const Registration = styled(Link)`
  width: 100px;
  height: 42px;
  background-color: #FF9A23;
  color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
`

function RecipeBox({ recipeImg, recipeName, recipeId }) {
  const navigate = useNavigate();

  const handleReadMoreClick = () => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <Container>
      <FoodImg imageUrl={recipeImg}/>
      <FoodName>{recipeName}</FoodName>
      <ButtonBox>
        <ReadMore onClick={handleReadMoreClick}>자세히 보기</ReadMore>
        <Registration to="/planner">등록</Registration>
      </ButtonBox>
    </Container>
  );
};

export default RecipeBox;