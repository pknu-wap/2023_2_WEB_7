import HelpBar from "../component/HelpBar";
import MenuBar from "../component/MenuBar";
import { GoPeople } from "react-icons/go";
import { IoTimeOutline } from "react-icons/io5";
import { GiStarsStack } from "react-icons/gi";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

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
  display: grid;
  grid-template-column: repeat(2, 1fr);

  h3 {
    font-size: 28px;
    font-weight: 500;
  }
  span {
    font-size: 20px;
    margin-bottom: 10px;
    font-weight: 500;
  }
`
const IngredientRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 10px 0;
  border-bottom: 1px solid #000000;
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
    font-size: 28px;
    font-weight: 500;
    margin-bottom: 50px;
  }
  section {
    display: flex;
    justify-content: space-between;
    padding: 25px 0;
  }
  p {
    font-size: 22px;
    padding-right: 50px;
  }
  img {
    width: 300px;
    height: 236px;
    border-radius: 10px;
  }
`
const NutritionalIngredients = styled.div`
  padding: 60px 60px 500px 80px;
  color: #000000;
  font-family: Noto Sans KR;

  h3 {
    font-size: 28px;
    font-weight: 500;
  }
  div {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    width: 1260px;
    text-align: center;
  }
  span {

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
const Controller = styled.div`
  position: fixed;
  bottom: 50px;
  right: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 205px;
  height: 75px;
  border-radius: 100px;
  background-color: #F3B04D;

  p {
    font-size: 20px;
    font-weight: 500;
    color: #FFFFFF;
  }
  &: hover {
    cursor: pointer;
  }
`

function Recipe() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [nutritionalInfo, setNutritionalInfo] = useState(null);
  const [recipeData, setRecipeData] = useState({
    name: '',
    ingredients: [],
    recipe: [],
    recipeImg: [],
    recipeIntro: [],
    infoSide: [],
    mainImg: '',
  });

  useEffect(() => {
    const fetchDataFromServer = async () => {
      try {
        const response = await fetch(`http://3.112.14.157:5000/user/recipe/${recipeId}`);
        const data = await response.json();

        const ingredientsArray = data.recipe_info.ingredients.split(',');

        setRecipeData({
          name: data.recipe_info.name,
          ingredients: ingredientsArray,
          recipe: data.recipe_info.recipe,
          recipeImg: data.recipe_info.recipe_img,
          recipeIntro: data.recipe_info.recipe_intro,
          infoSide: data.recipe_info.info_side,
          mainImg: data.recipe_info.recipe_main_img,
        });

        const gptResponse = await fetchChatGPT(data.recipe_info.ingredients);
        setNutritionalInfo(gptResponse);
        console.log(nutritionalInfo);
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다.', error);
      }
    };
    fetchDataFromServer();
  }, [recipeId]);

  const fetchChatGPT = async (ingredients) => {
    const messages =[
      { role: 'system', content: 'You are a helpful assistant.'},
      { role: 'user', content: `${ingredients}는 요리에 사용된 식재료와 양이야. 이걸로 추정되는 칼로리, 탄수화물, 단백질, 지방을 알려줘. 정확하지 않아도 돼. 범위 말고 값으로 알려줘. 대답은 딕셔너리 형태로 주면 돼. 다른 대답은 하지마.`}
    ];
    const api_key = process.env.REACT_APP_GPT_KEY;
    const config = {
      headers: {
        Authorization: `Bearer ${api_key}`,
        'Content-Type': 'application/json',
      },
      timeout: 100000,
    }

    const gptData = {
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
      n: 1,
      messages: messages,
    };
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', gptData, config);
      return response.data.choices[0].message.content.split('\n');
    } catch (error) {
      console.error('API 호출 실패', error);
    }
  };

  const handleAddToPlanner = () => {
    const foodData = {
      name: recipeData.name,
      calories: nutritionalInfo[3],
      carbs: nutritionalInfo[0],
      protein: nutritionalInfo[1],
      fat: nutritionalInfo[2],
    };

    navigate('/planner', { state: {foodData} });
  };
  
  return (
    <Body>
      <HelpBar/>
      <Content>
        <Header>
          <MenuBar search/>
        </Header>
        <RecipeMain>
          <img src={recipeData.mainImg} alt="음식 사진"/>
          <h3>{recipeData.name}</h3>
          <p>{recipeData.recipeIntro}</p>
          <SubInfo>
            <Section>
              <GoPeople />
              <span>{recipeData.infoSide[0]}</span>
            </Section>
            <Section>
              <IoTimeOutline />
              <span>{recipeData.infoSide[1]}</span>
            </Section>
            <Section>
              <GiStarsStack />
              <span>{recipeData.infoSide[2]}</span>
            </Section>
          </SubInfo>
        </RecipeMain>
        <Ingredient>
          <h3>재료</h3>
          <div>
            <Category>
              <span>이름</span>
              <span>양</span>
            </Category>
            {recipeData.ingredients && recipeData.ingredients.map((ingredients, index) => {
              const [name, quantity] = ingredients.trim().split(' ');
              return (
                <IngredientRow key={index}>
                  <span>{name}</span>
                  <span>{quantity}</span>
                </IngredientRow>
              );
            })}
          </div>
        </Ingredient>
        <CookingProcedure>
          <h3>조리 순서</h3>
          {recipeData.recipe && recipeData.recipe.map((step, index) => (
            <section key={index}>
              <p>{step}</p>
              <img src={recipeData.recipeImg[index]} alt={`조리 사진 ${index + 1}`}/>
            </section>
          ))}
        </CookingProcedure>
        <NutritionalIngredients>
          <h3>영양성분표</h3>
          <div>
            <NutCategory>
              <span>탄수화물(g)</span>
              <span>단백질(g)</span>
              <span>지방(g)</span>
              <span>열량(kcal)</span>
            </NutCategory>
            {recipeData.nutritionalInfo && recipeData.nutritionalInfo.map((value, index) => (
              <NutValue key={index}>
                <span>{value}</span>
              </NutValue>
            ))}
          </div>
        </NutritionalIngredients>
      </Content>
      <Controller onClick={handleAddToPlanner}>
        <p>식단 등록</p>
      </Controller>
    </Body>
  );
};

export default Recipe;