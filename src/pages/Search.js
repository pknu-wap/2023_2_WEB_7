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
  margin: 142px 0 0 160px;
`
const Recommend = styled.div`
`
const Text = styled.div`
`

function Search() {
  const { query } = useParams();
  const [searchData, setSearchData] = useState({
    //받아올 데이터
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/search/${foodName}`);

        if (response.ok) {
          const data = await response.json();
          setSearchData(data);
        } else {
          console.error('서버 응답 실패');
        }
      } catch (error) {
        console.error('데이터 가져오기 실패', error);
      }
    };

    fetchData();
  }, [foodName]);

  return (
    <Body>
      <HelpBar/>
      <Content>
        <MenuBar showSearchBar={false}/>
        <SearchContainer>
          <SearchBar/>
          <Recommend/>
        </SearchContainer>
        <Text>
          <h1>{`'${query}'에 대한 레시피`}</h1>
        </Text>
        <RecipeBox/>
      </Content>
    </Body>
  );
};

export default Search;