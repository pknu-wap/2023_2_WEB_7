import Logo from "../component/Logo";
import MenuBar from "../component/MenuBar";
import styled from "styled-components";
import { useState } from "react";
import ReactModal from "react-modal";
import axios from 'axios';
import LottieLoading from "../img/LottieLoading";

const Body = styled.div`
  margin: 0;
  background-color: #FFFDFA;
  padding: 60px 270px;
  width: 100%;
  height: 100vh;

  h2 {
    margin: 50px 0 30px;
    color: #000000;
    font-family: Noto Sans KR;
    font-size: 37px;
    font-weight: 700;
  }
`
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Ingredient = styled.div`
  p {
    margin: 0 0 10px 13px;
    color: #000000;
    font-family: Noto Sans KR;
    font-size: 23px;
    font-weight: 400;
  }
`
const IngredientContainer = styled.div`
  position: relative;
  width: 100%;
  height: 280px;
  border-radius: 7px;
  border: 1px solid #000000;
  background-color: #FFFFFF;

  input {
    border: none;
    border-bottom: 1px solid #000000;
    width: 510px;
    padding-left: 10px;
    color: #000000;
    font-family: Noto Sans KR;
    font-size: 18px;
    font-weight: 300;
    overflow: auto;
  }
  input:focus {
    outline: none;
  }
`
const InputBox = styled.div`
  display: flex;
  gap: 10px;
  margin: 40px 0 15px 40px;
`
const AddIngredient = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 72px;
  height: 40px;
  border: none;
  background-color: #EFEFEF;
  color: #000000;
  font-family: Noto Sans KR;
  font-size: 16px;
  font-weight: 400;

  &:hover {
    cursor: pointer;
  }
`
const AddItem = styled.div`
  margin: 0 40px;
  height: 95px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px 10px;
  overflow: auto;
`
const IngredientBox = styled.div`
  margin: 0;
  height: 28px;
  border-radius: 14px;
  background-color: #FFEBCC;
  padding: 4px 10px 4px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #000000;
  font-family: Noto Sans KR;
  font-size: 14px;
  font-weight: 400;
`
const DelButton = styled.button`
  color: #8B9F2A;
  font-family: Noto Sans KR;
  font-size: 14px;
  font-weight: 300;
  border: none;
  background-color: #FFEBCC;
  padding-right: 0;

  &:hover {
    cursor: pointer;
  }
`
const InputComplete = styled.button`
  position: absolute;
  right: 30px;
  bottom: 20px;
  width: 115px;
  height: 50px;
  border-radius: 2px;
  background-color: #F3B04D;
  border: none;
  color: #FFFFFF;
  font-family: Noto Sans KR;
  font-size: 17px;
  font-weight: 400;

  &:hover {
    cursor: pointer;
  }
`
const Recipes = styled.div`
  margin-top: 60px;
  p {
    margin: 0 0 10px 13px;
    color: #000000;
    font-family: Noto Sans KR;
    font-size: 23px;
    font-weight: 400;
  }
`
const RecipesContainer = styled.div`
  width: 100%;
  border-radius: 7px;
  border: 1px solid #000000;
  background-color: #FFFFFF;
  padding: 50px 55px;
`
const RecipeItem = styled.div`
  widht: 100%;
  height: 145px;
  display: flex;
  gap: 28px;

  img {
    width: 210px;
    height: 100%;
  }
  section {
    display: flex;
    flex-direction: column;
    gap: 6px;
    color: #000000;
    font-family: Noto Sans KR;
  }
  h2 {
    font-size: 22px;
    font-weight: 700;
  }
  p {
    font-size: 18px;
    font-weight: 300;
  }
`
const RecipeSearch = styled.button`
`
const RecipeLoading = styled.div`
  display: flex;
  justify-content: center;
  align-items:center;
`

ReactModal.setAppElement('#root');


function Refrigerator() {
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleIngredientInputChange = (e) => {
    setIngredientInput(e.target.value);
  };

  const handleAddIngredient = () => {
    if (ingredientInput.trim() !== '') {
      setIngredients((prevIngredients) => [...prevIngredients, ingredientInput]);
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredients((prevIngredients) => prevIngredients.filter((_, i) => i !== index));
  };

  const handleInputComplete = async () => {
    setLoading(true);
    openModal();
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.'},
      { role: 'user', content: '가지고 있는 재료는' + ingredients.join(', ') + '이고, 이걸로 만들 수 있는 음식 알려줘. 이 재료를 전부 사용할 필요 없고, 일부만 사용한 음식부터 전부 사용한 음식 모두 괜찮아. 대답은 "(음식 이름): (사용한 식재료)" 이렇게 하면 돼. 다른 대답은 하지마. 여기서 사용한 식재료는 내가 알려준 식재료 중에서 사용된 식재료를 말하는거야.'}
    ];
    const api_key = process.env.REACT_APP_GPT_KEY;
    console.log(api_key);
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
      const assistantMessage = await response.data.choices[0].message.content.split('\n');
      console.log(assistantMessage);
      const recipesArray = extractRecipes(assistantMessage);

      const recipesWithImages = await Promise.all(
        Object.keys(recipesArray).map(async (food) => {
          const imageUrl = await fetchKakaoImage(food);
          return {
            food,
            usedIngredients: recipesArray[food],
            imageUrl,
          };
        })
      );

      setRecipes(recipesArray);;
    } catch(error) {
      console.error('API 호출 실패', error);
    }
    setLoading(false);
    closeModal();
  };

  const fetchKakaoImage = async (food) => {
    try {
      const response = await axios.get('https://dapi.kakao.com/v2/search/image', {
        headers: {
          Authorization: 'KakaoAK ',
        },
        params: {
          query: food,
          page: 1,
          size: 1,
        },
      });
      return response.data.documents[0].image_url;
    } catch (error) {
      console.error('Kakao API 호출 실패', error);

      return '';
    }
  };

  const extractRecipes = (text) => {
    const recipes = [];
    const regex = /"\d+\. (.*?): (.*?)"/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const food = match[1].trim();
      const usedIngredients = match[2].trim().split(', ').map((ingredient) => ingredient.trim());
      
      recipes.push({
        food: food,
        usedIngredients: usedIngredients,
      });
    }
    console.log(Array.isArray(recipes), recipes);
    console.log(recipes.length);
    return recipes;
  }

  const sendIngredientsToServer = async (ingredients) => {
    try {
      const response = await fetch('/server-endpoint', {
        method: 'POST',
        body: JSON.stringify({ingredients}),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        console.log('재료항목 저장 완료');
      } else {
        console.log('서버 요청 실패');
      }
    } catch(error) {
      console.error('오류 발생', error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };
  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <Body>
      <Header>
        <Logo/>
        <MenuBar/>
      </Header>
      <h2>냉장고</h2>
      <Ingredient>
        <p>어떤 식재료로 만들어볼까요?</p>
        <IngredientContainer>
          <InputBox>
            <input
              type="text"
              value={ingredientInput}
              onChange={handleIngredientInputChange}
              placeholder="냉장고에 있는 식재료를 입력해주세요!"
            />
            <AddIngredient onClick={(e) => {handleAddIngredient(); sendIngredientsToServer(); }}>추가</AddIngredient>
          </InputBox>
          <AddItem>
            {ingredients.map((ingredient, index) => (
              <IngredientBox key={index}>
                {ingredient}
                <DelButton onClick={(e) => {handleRemoveIngredient(index); sendIngredientsToServer(); }}>X</DelButton>
              </IngredientBox>
            ))}
          </AddItem>
          <InputComplete onClick={handleInputComplete}>입력 완료</InputComplete>
        </IngredientContainer>
      </Ingredient>
      <ReactModal 
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          content: {
            width: '400px',
            height: '400px',
            margin: 'auto',
            display: 'flex',
            justifiContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
        contentLabel="로딩 중"
      >
        {loading ? (
          <RecipeLoading>
            <LottieLoading/>
            <p>잇플리가 레시피를 찾고 있어요!<br/>잠시만 기다려주세요.</p>
          </RecipeLoading>
        ) : null}
      </ReactModal>
      <Recipes>
        <p>현재 재료로 만들 수 있는 레시피에요!</p>
        <RecipesContainer>
          {recipes.map(({food, usedIngredients, imageUrl}, index) => (
            <RecipeItem key={index}>
              <img src={imageUrl} alt="음식 사진"/>
              <section>
                <h3>{food}</h3>
                <p>{usedIngredients.join(', ')}</p>
              </section>
              <RecipeSearch>레시피 검색</RecipeSearch>
            </RecipeItem>
          ))}
        </RecipesContainer>
      </Recipes>
    </Body>
  );
};

export default Refrigerator;