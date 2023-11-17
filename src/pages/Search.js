import HelpBar from "../component/HelpBar";
import MenuBar from "../component/MenuBar";
import SearchBar from "../component/SearchBar";
import RecipeBox from "../component/RecipeBox";
import styled from "styled-components";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Body = styled.div`
  margin: 0;
  width: 100%;
  height: 100vh;
  background-color: #FFFDFA;
`
const Content = styled.div`
  margin-left: 476px;
`
const SearchContainer = styled.div`
  margin: 142px 0 0 130px;
`
const Recommend = styled.div`
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
    font-weight: 400;
  }
`
const Line = styled.div`
  border: 1px solid #F3B04D;
  margin: 8px 175px 13px 120px;
`
const RecipeGrid = styled.div`
  display: grid;
  padding:
  grid-template-columns: repeat(4, 1fr);
`

function Search() {
  const { query } = useParams();
  const [searchData, setSearchData] = useState({
    recommend: [],
    recipes: [],
  });

  useEffect(() => {
    fetchDataFromServer()
      .then(data => {
        setSearchData({
          recommend: data[0],
          recipes: data[1],
        });
      })
      .catch(error => {
        console.error('데이터를 불러오는데 실패했습니다.', error);
      });
  }, [query]);

  const fetchDataFromServer = async () => {
    try {
      const response = await fetch(`/api/search/${query}`);
      const data = await response.json();

      return data;
    } catch (error) {
      throw new Error('데이터를 불러오는데 실패했습니다.');
    }
  };

  return (
    <Body>
      <HelpBar/>
      <Content>
        <MenuBar search showSearchBar={false}/>
        <SearchContainer>
          <SearchBar/>
          <Recommend>
            {searchData.recommend.map((keyword) => (
              <li key={keyword}>{keyword}</li>
            ))}
          </Recommend>
        </SearchContainer>
        <Text>
          <h1><span>{`'${query}'`}</span>에 대한 레시피</h1>
          <p>평균적으로 000Kcal 입니다.</p>
          {/* <p>평균적으로 {averageCal}kcal 입니다.</p> */}
        </Text>
        <Line/>
        <RecipeGrid>
          {searchData.recipes.map((recipe) => (
            <RecipeBox
              key={recipe.recipeNumber}
              recipeUrl={recipe.imageUrl}
              recipeName={recipe.recipeName}
              recipeId={recipe.recipeNumber}
            />
          ))}
        </RecipeGrid>
      </Content>
    </Body>
  );
};

export default Search;