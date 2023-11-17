import HelpBar from "../component/HelpBar";
import MenuBar from "../component/MenuBar";
import { GoPeople } from "react-icons/go";
import { IoTimeOutline } from "react-icons/io5";
import { GiStarsStack } from "react-icons/gi";
import styled from "styled-components";

const Body = styled.div`
  margin: 0;
  width: 100%;
  height: 100%;
  background-color: #FFFDFA;
`
const Content = styled.div`
  margin-left: 476px;
`
const Header = styled.div`
  height: 140px;
  border-bottom: 4px solid #EFEFEF;
`
const RecipeMain =styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 100px 0 85px 0;
  border-bottom: 15px solid #EFEFEF;
  color: #000000;
  font-family: Noto Sans KR;

  h3 {
    margin: 30px 0 12px 0;
    font-size: 40px;
    font-weight: 700;
  }
  p {
    font-size: 18px;
    font-weight: 500;
  }
`
const SubInfo = styled.div`
  display: flex;
  gap: 175px;
  margin-top: 110px;
`
const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  svg {
    width: 30px;
    height: 30px;
  }
`
const Ingredient = styled.div`
  padding: 60px 60px 50px 80px;
  border-bottom: 15px solid #EFEFEF;
  color: #000000;
  font-family: Noto Sans KR;

  h3 {
    font-size: 40px;
    font-weight: 500;
  }
`
const Category = styled.div`
  width: 100%;
  margin-top: 60px;
  border-bottom: 2px solid #000000;
  display: grid;
  grid-template-columns: 1fr 1fr;
  font-size: 25px;
  font-weight: 400;
`
const CookingProcedure = styled.div`
  padding: 60px 60px 50px 80px;
  border-bottom: 15px solid #EFEFEF;
  color: #000000;
  font-family: Noto Sans KR;

  h3 {
    font-size: 40px;
    font-weight: 500;
  }
`
const NutritionalIngredients = styled.div`
  padding: 60px 60px 500px 80px;
  color: #000000;
  font-family: Noto Sans KR;

  h3 {
    font-size: 40px;
    font-weight: 500;
  }
`
const NutCategory = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 40px;
  padding: 13px 70px;
  border-top: 2px solid #8B9F2A;
  border-bottom: 1px solid #8B9F2A;
`
const NutValue = styled.div`
`

function Recipe() {
  return (
    <Body>
      <HelpBar/>
      <Content>
        <Header>
          <MenuBar search/>
        </Header>
        <RecipeMain>
          <img src="#!" alt="음식 사진"/>
          <h3>레시피이름</h3>
          <p>레시피 추가 설명</p>
          <SubInfo>
            <Section>
              <GoPeople />
              <span>몇인분</span>
            </Section>
            <Section>
              <IoTimeOutline />
              <span>몇시간 이내</span>
            </Section>
            <Section>
              <GiStarsStack />
              <span>난이도</span>
            </Section>
          </SubInfo>
        </RecipeMain>
        <Ingredient>
          <h3>재료</h3>
          <Category>
            <span>이름</span>
            <span>양</span>
          </Category>
          //동적 테이블 생성
        </Ingredient>
        <CookingProcedure>
          <h3>조리 순서</h3>
          <section>
            <p>설명</p> //동적으로 생성
            <img src="#!" alt="조리 사진"/>
          </section>
        </CookingProcedure>
        <NutritionalIngredients>
          <h3>영양성분표</h3>
          <NutCategory>
            <span>탄수화물(g)</span>
            <span>단백질(g)</span>
            <span>지방(g)</span>
            <span>열량(kcal)</span>
          </NutCategory>
          <NutValue>
            <span>동적생성</span>
          </NutValue>
        </NutritionalIngredients>
      </Content>
    </Body>
  );
};

export default Recipe;