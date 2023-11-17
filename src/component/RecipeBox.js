import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const Container = styled.div`
  width: 265px;
  height: 390px;
  background-color: #FFFFFF;
  padding: 10px 14px;
`
const FoodImg = styled.div`
  background-image: url('${props => props.imageUrl}');
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`
const FoodName = styled.h3`
  color: #6A3900;
  font-family: Noto Sans KR;
  font-size: 20px;
  font-weight: 700;
`
const ButtonBox = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: Noto Sans KR;
  font-size: 15px;
  font-weight: 500;
`
const ReadMore = styled(Link)`
  width: 136px;
  height: 42px;
  background-color: #F3B04D;
  color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
`
const Registration = styled(Link)`
  width: 86px;
  height: 42px;
  background-color: #FF9A23;
  color: #FFFFFF;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
`

function RecipeBox({ recipeUrl, recipeName, recipeId }) {
  const navigate = useNavigate();

  const handleReadMoreCick = () => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <Container>
      {/* <FoodImg imageUrl={imageUrl}/> */}
      <FoodName>{recipeName}</FoodName>
      <ButtonBox>
        <ReadMore onClick={handleReadMoreCick}>자세히 보기</ReadMore>
        <Registration to="#!">등록</Registration>
      </ButtonBox>
    </Container>
  );
};

export default RecipeBox;