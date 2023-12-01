import HelpBar from "../component/HelpBar";
import MenuBar from "../component/MenuBar";
import SearchBar from "../component/SearchBar";
import RecipeBox from "../component/RecipeBox";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
const SearchContainer = styled.div`
  margin: 140px 0 0 130px;
`
const Recommend = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 10px;
  margin: 17px 0 0 3px;
  width: 1120px;
  
  li {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 28px;
    border-radius: 14px;
    background-color: #FFEBCC;
    color: #000000;
    font-family: Noto Sans KR;
    font-size: 14px;
    font-weight: 300;
    padding: 4px 12px;
  }
  li:hover {
    cursor: pointer;
  }
`
const Text = styled.div`
  margin: 60px 0 0 130px;

  h1 {
    color: #000000;
    font-family: Noto Sans KR;
    font-size: 38px;
    font-weight: 400;
  }
  span {
    font-weight: 700;
  }
  p {
    margin-top: 30px;
    color: #000;
    font-family: Noto Sans KR;
    font-size: 18px;
    font-weight: 300;
  }
`
const Line = styled.div`
  border: 1px solid #F3B04D;
  margin: 8px 175px 13px 120px;
`
const RecipeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin: 0 175px 0 130px;
`

function Search() {
  const { query } = useParams();
  const navigate = useNavigate();
  const [averageCalories, setAverageCalories] = useState('평균 칼로리 계산 중...');
  const [searchData, setSearchData] = useState({
    recommend: [],
    recipes: [],
  });

  useEffect(() => {
    setAverageCalories('평균 칼로리 계산 중...');
    const fetchDataFromServer = async () => {
      try {
        const response = await fetch(`http://3.112.14.157:5000/user/search/${query}`);
        const data = await response.json();
        setSearchData({
          recommend: data.search_info[0],
          recipes: data.search_info[1],
        });

        const gptResponse = await fetchChatGPT(query);
        setAverageCalories(gptResponse);
      } catch (error) {
        console.error('데이터를 불러오는데 실패했습니다.', error);
      }
    };
    fetchDataFromServer();
  }, [query]);

  const fetchChatGPT = async (query) => {
    const messages = [
      { role: 'system', content: 'You are a helpful assistant.'},
      { role: 'user', content: `${query}의 평균 칼로리 범위를 알려줘. 정확하지 않아도 돼. 대답은 "${query}의 평균 칼로리는 (칼로리 범위)입니다." 이렇게 하면 돼. 즉, 숫자만 얘기하고 단위나 다른 대답은 하지마. "네 알겠습니다"도 하지마.`}
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

  const handleRecipeSearch = (selectedFood) => {
    if (selectedFood) {
      navigate(`/search/${selectedFood}`);
    } 
  }

  return (
    <Body>
      <HelpBar/>
      <Content>
        <MenuBar search showSearchBar={false}/>
        <SearchContainer>
          <SearchBar/>
          <Recommend>
            {searchData.recommend && searchData.recommend.map((keyword) => (
              <li key={keyword} onClick={() => handleRecipeSearch(keyword)}>{keyword}</li>
            ))}
          </Recommend>
        </SearchContainer>
        <Text>
          <h1><span>{`'${query}'`}</span>에 대한 레시피</h1>
          <p>{`${averageCalories}`}</p>
        </Text>
        <Line/>
        <RecipeGrid>
          {searchData.recipes && searchData.recipes.map((recipe) => (
            <RecipeBox
              key={recipe.food_number}
              recipeImg={recipe.food_img}
              recipeName={recipe.food_name}
              recipeId={recipe.food_number}
            />
          ))}
        </RecipeGrid>
      </Content>
    </Body>
  );
};

export default Search;