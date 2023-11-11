import HelpBar from "../component/HelpBar";
import MenuBar from "../component/MenuBar";
import SearchBar from "../component/SearchBar";
import RecipeBox from "../component/RecipeBox";
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
const SearchContainer = styled.div`
  margin: 142px 0 0 160px;
`
const Recommend = styled.div`
`
const Text = styled.div`
`

function SearchFoodName() {
  return (
    <Body>
      <HelpBar/>
      <Content>
        <MenuBar/>
        <SearchContainer>
          <SearchBar/>
          <Recommend/>
        </SearchContainer>
        <Text>
          <h1>'샐러드'에 대한 레시피</h1>
        </Text>
        <RecipeBox/>
      </Content>
    </Body>
  );
};

export default SearchFoodName;